using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyNoteMD_API.Data;
using MyNoteMD_API.DTOs;
using MyNoteMD_API.Services;
using MyNoteMD_API.Utils;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MyNoteMD_API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("v1/trash")]
    public class TrashController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAuditService _auditService;

        public TrashController(AppDbContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        private Guid GetCurrentUserId()
        {
            return Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        // Collections and Notes Together
        [HttpGet]
        public async Task<IActionResult> GetTrashItems([FromQuery] string? cursor, [FromQuery] int limit = 20)
        {
            limit = Math.Min(limit, 50);
            var userId = GetCurrentUserId();

            // 1. Notlar için ham veri sorgusu
            var noteQuery = _context.Notes
                .IgnoreQueryFilters()
                .Where(n => n.OwnerId == userId && n.DeletedAt != null)
                .Select(n => new
                {
                    Id = n.Id,
                    Type = "note",
                    TitleOrName = n.Title,
                    DeletedAt = n.DeletedAt,
                    // İlişkisel veriyi burada değil, sorgu birleştikten sonra veya manuel alacağız
                    ParentInfo = n.Collection.Name,
                    CountInfo = (int?)null
                });

            // 2. Koleksiyonlar için ham veri sorgusu
            var colQuery = _context.Collections
                .IgnoreQueryFilters()
                .Where(c => c.OwnerId == userId && c.DeletedAt != null)
                .Select(c => new
                {
                    Id = c.Id,
                    Type = "collection",
                    TitleOrName = c.Name,
                    DeletedAt = c.DeletedAt,
                    ParentInfo = (string?)null,
                    CountInfo = (int?)c.Notes.Count
                });

            // 3. Sorguları Birleştir (Şemalar artık tamamen aynı)
            var combinedQuery = noteQuery.Concat(colQuery);

            // 4. Cursor Filtrelemesi
            var decodedCursor = CursorHelper.Decode(cursor);
            if (decodedCursor != null)
            {
                var cursorDate = decodedCursor.Value.CreatedAt;
                var cursorId = decodedCursor.Value.Id;

                combinedQuery = combinedQuery.Where(x =>
                    x.DeletedAt < cursorDate ||
                    (x.DeletedAt == cursorDate && x.Id.CompareTo(cursorId) < 0));
            }

            // 5. Sıralama ve Veri Çekme
            // SQL burada UNION ALL yapıp ORDER BY ve LIMIT uygulayacak
            var rawItems = await combinedQuery
                .OrderByDescending(x => x.DeletedAt)
                .ThenByDescending(x => x.Id)
                .Take(limit + 1)
                .ToListAsync();

            // 6. Sonuçları DTO'ya Eşleme (Memory'de yapıyoruz, EF'i yormuyoruz)
            var items = rawItems.Select(x => new TrashItemDto(
                x.Id,
                x.Type,
                x.TitleOrName,
                x.DeletedAt,
                x.ParentInfo,
                x.CountInfo
            )).ToList();

            // 7. NextCursor Hesaplama
            string? nextCursor = null;
            if (items.Count > limit)
            {
                var lastItem = items[limit - 1];
                nextCursor = CursorHelper.Encode(lastItem.DeletedAt!.Value, lastItem.Id);
                items.RemoveAt(limit);
            }

            return Ok(new PagedTrashResponseDto(items, nextCursor));
        }

        // 2. Hard Delete All
        [HttpDelete]
        public async Task<IActionResult> EmptyTrash()
        {
            var userId = GetCurrentUserId();

            // Delete notes firstly to not encounter foreign key restrictions
            await _context.Notes
                .IgnoreQueryFilters()
                .Where(n => n.OwnerId == userId && n.DeletedAt != null)
                .ExecuteDeleteAsync();

            // Then remove collections
            await _context.Collections
                .IgnoreQueryFilters()
                .Where(c => c.OwnerId == userId && c.DeletedAt != null)
                .ExecuteDeleteAsync();

            await _auditService.LogAsync(userId, "TrashEmptied");

            return NoContent();
        }

        // 3. Hard Delete an Individual Item
        [HttpDelete("{type}/{id}")]
        public async Task<IActionResult> HardDelete(string type, Guid id)
        {
            var userId = GetCurrentUserId();

            if (type.ToLower() == "note")
            {
                var note = await _context.Notes.IgnoreQueryFilters()
                    .FirstOrDefaultAsync(n => n.Id == id && n.OwnerId == userId && n.DeletedAt != null);

                if (note == null) return NotFound();

                _context.Notes.Remove(note);
            }
            else if (type.ToLower() == "collection")
            {
                // We use `Include(Notes)` so that when EF Core deletes a collection, it also deletes the notes within it (Cascade)
                var collection = await _context.Collections.IgnoreQueryFilters()
                    .Include(c => c.Notes.Where(n => n.DeletedAt != null))
                    .FirstOrDefaultAsync(c => c.Id == id && c.OwnerId == userId && c.DeletedAt != null);

                if (collection == null) return NotFound();

                _context.Collections.Remove(collection);
            }
            else
            {
                return BadRequest("Invalid type (must be note or collection).");
            }

            await _context.SaveChangesAsync();
            await _auditService.LogAsync(userId, "HardDeleted", $"{type.ToLower()} with ID: {id} Hard Deleted");
            return NoContent();
        }

        // 4. Restore an Individual Item
        [HttpPost("{type}/{id}/restore")]
        public async Task<IActionResult> Restore(string type, Guid id)
        {
            var userId = GetCurrentUserId();

            if (type.ToLower() == "note")
            {
                var note = await _context.Notes.IgnoreQueryFilters()
                    .Include(n => n.Collection)
                    .FirstOrDefaultAsync(n => n.Id == id && n.OwnerId == userId && n.DeletedAt != null);

                if (note == null) return NotFound();

                /*
                 * CRITICAL CHECK: If the collection it belongs to is also in the trash, you can't restore the note!
                 * In that case, the collection must be restored first.
                 */

                var isCollectionDeleted = await _context.Collections.IgnoreQueryFilters()
                    .AnyAsync(c => c.Id == note.CollectionId && c.DeletedAt != null);

                if (isCollectionDeleted)
                {
                    return BadRequest(new { Message = "To restore this note, you must first restore the collection it belongs to." });
                }

                note.DeletedAt = null;
            }
            else if (type.ToLower() == "collection")
            {
                var collection = await _context.Collections.IgnoreQueryFilters()
                    .Include(c => c.Notes.Where(n => n.DeletedAt != null))
                    .FirstOrDefaultAsync(c => c.Id == id && c.OwnerId == userId && c.DeletedAt != null);

                if (collection == null) return NotFound();

                // First, we capture the moment the collection is deleted!
                var collectionDeletedTime = collection.DeletedAt.Value;

                // Now we can safely restore the collection.
                collection.DeletedAt = null;

                /*
                 * CASCADING RESTORE
                 * Only restore notes that were deleted at the same time (or together with) this collection.
                 * We find notes with the same timestamp (DeletedAt) as the collection (or with a maximum difference of 5 seconds).
                 */

                foreach (var note in collection.Notes)
                {
                    if (Math.Abs((note.DeletedAt!.Value - collectionDeletedTime).TotalSeconds) < 5)
                    {
                        note.DeletedAt = null;
                    }
                }
            }
            else
            {
                return BadRequest("Invalid type.");
            }

            await _context.SaveChangesAsync();
            await _auditService.LogAsync(userId, "RestoreFromTrash", $"{type.ToLower()} with ID: {id} Restored from Trash");
            return Ok(new { Message = "Item restored successfully." });
        }
    }
}
