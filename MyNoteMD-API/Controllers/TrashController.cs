using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyNoteMD_API.Data;
using MyNoteMD_API.DTOs;
using MyNoteMD_API.Services;
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
        public async Task<IActionResult> GetTrashItems()
        {
            var userId = GetCurrentUserId();

            // Fetch deleted notes
            var deletedNotes = await _context.Notes
                .IgnoreQueryFilters() // Bypass global filter for that query
                .Include(n => n.Collection)
                .Where(n => n.OwnerId == userId && n.DeletedAt != null)
                .Select(n => new TrashItemDto(
                    n.Id,
                    "note",
                    n.Title,
                    n.DeletedAt,
                    n.Collection.Name,
                    null
                ))
                .ToListAsync();

            // Fetch deleted collections
            var deletedCollections = await _context.Collections
                .IgnoreQueryFilters()
                .Include(c => c.Notes.Where(n => n.DeletedAt != null))
                .Where(c => c.OwnerId == userId && c.DeletedAt != null)
                .Select(c => new TrashItemDto(
                    c.Id,
                    "collection",
                    c.Name,
                    c.DeletedAt,
                    null,
                    c.Notes.Count
                ))
                .ToListAsync();

            // Merge them together
            var allTrashItems = deletedNotes
                .Concat(deletedCollections)
                .OrderByDescending(item => item.DeletedAt)
                .ToList();

            return Ok(allTrashItems);
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
