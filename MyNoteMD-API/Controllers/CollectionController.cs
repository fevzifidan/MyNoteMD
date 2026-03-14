using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyNoteMD_API.Data;
using MyNoteMD_API.DTOs;
using MyNoteMD_API.Models;
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
    [Route("v1/collections")]
    public class CollectionController: ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAuditService _auditService;

        public CollectionController(AppDbContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        private Guid GetCurrentUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.Parse(userId!);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? cursor, [FromQuery] int limit = 20, [FromQuery] string? search = null)
        {
            // 1. Üst limiti sınırla
            limit = Math.Min(limit, 50);

            var userId = GetCurrentUserId();

            // 2. Temel sorgu (Sadece kullanıcıya ait olanlar)
            var query = _context.Collections.Where(c => c.OwnerId == userId);

            // 3. Arama Filtresi (Koleksiyon isminde ara)
            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchTerm = search.ToLower();
                query = query.Where(c => c.Name.ToLower().Contains(searchTerm));
            }

            // 4. Cursor Mantığını Uygulama
            var decodedCursor = CursorHelper.Decode(cursor);
            if (decodedCursor != null)
            {
                var cursorDate = decodedCursor.Value.CreatedAt;
                var cursorId = decodedCursor.Value.Id;

                // "En yeni en üstte" (DESC) sıralaması için cursor filtresi:
                query = query.Where(c =>
                    c.CreatedAt < cursorDate ||
                    (c.CreatedAt == cursorDate && c.Id.CompareTo(cursorId) < 0));
            }

            // 5. Veriyi Çekme (Limit + 1 Taktiği)
            var collections = await query
                .OrderByDescending(c => c.CreatedAt)
                .ThenByDescending(c => c.Id)
                .Take(limit + 1)
                .Select(c => new CollectionResponseDto(
                    c.Id,
                    c.Name,
                    c.Notes.Count, // Global Soft Delete filtresi sayesinde silinmiş notları saymaz
                    c.CreatedAt
                ))
                .ToListAsync();

            // 6. NextCursor Hesaplanması
            string? nextCursor = null;

            if (collections.Count > limit)
            {
                // Bir sonraki sayfa var, cursor üret
                var lastItem = collections[limit - 1]; // Listedeki (limit içindeki) son gerçek eleman
                nextCursor = CursorHelper.Encode(lastItem.CreatedAt, lastItem.Id);

                // Fazladan çektiğimiz (+1) kontrol elemanını listeden çıkar
                collections.RemoveAt(limit);
            }

            return Ok(new PagedCollectionResponseDto(collections, nextCursor));
        }

        [HttpGet("lookup")]
        public async Task<IActionResult> GetLookUp()
        {
            var userId = GetCurrentUserId();

            // Just ID and Name
            var collections = await _context.Collections
                .Where(c => c.OwnerId == userId)
                .OrderBy(c => c.Name) // In alphabetical order
                .Select(c => new CollectionLookupDto(c.Id, c.Name))
                .ToListAsync();

            return Ok(collections);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCollectionDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var collection = new Collection
            {
                Id = Guid.CreateVersion7(),
                Name = request.Name,
                OwnerId = GetCurrentUserId()
            };

            _context.Collections.Add(collection);
            await _context.SaveChangesAsync();
            await _auditService.LogAsync(GetCurrentUserId(), "NewCollectionCreated", $"Created Collection ID: {collection.Id}");

            var response = new CollectionResponseDto(collection.Id, collection.Name, 0, collection.CreatedAt);

            return StatusCode(201, response); // 201 Created
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var userId = GetCurrentUserId();

            var collection = await _context.Collections
                .Where(c => c.Id == id && c.OwnerId == userId)
                .Select(c => new CollectionResponseDto(c.Id, c.Name, c.Notes.Count, c.CreatedAt))
                .FirstOrDefaultAsync();

            if (collection == null)
            {
                await _auditService.LogAsync(userId, "CollectionNotFound", $"[GET] Requested Collection ID: {id}");
                return NotFound(new { Message = "Collection not found or you do not have access permission." });
            }

            return Ok(collection);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateCollectionDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetCurrentUserId();

            var collection = await _context.Collections
                .FirstOrDefaultAsync(c => c.Id == id && c.OwnerId == userId);

            if (collection == null)
                return NotFound(new { Message = "Koleksiyon bulunamadı veya erişim yetkiniz yok." });

            // Update the name
            collection.Name = request.Name;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = GetCurrentUserId();

            // Fetch collections and notes inside it by EF Core Include
            var collection = await _context.Collections
                .Include(c => c.Notes)
                .FirstOrDefaultAsync(c => c.Id == id && c.OwnerId == userId);

            if (collection == null)
            {
                await _auditService.LogAsync(userId, "CollectionNotFound", $"[DELETE] Requested Collection ID: {id}");
                return NotFound();
            }

            // Cascading Soft Delete
            var now = DateTimeOffset.UtcNow;

            collection.DeletedAt = now; // Throw collection to trash

            foreach (var note in collection.Notes)
            {
                note.DeletedAt = now; // Throw notes in the collection to trash
            }

            await _context.SaveChangesAsync();
            await _auditService.LogAsync(userId, "CollectionDeleted", $"Deleted Collection ID: {id}");

            return NoContent(); // 204 No Content (Successfully Deleted)
        }

        [HttpGet("{id}/notes")]
        public async Task<IActionResult> GetNotesByCollection(Guid id, [FromQuery] string? cursor, [FromQuery] int limit = 20)
        {
            // 1. Set a maximum limit
            limit = Math.Min(limit, 50);

            var userId = GetCurrentUserId();

            // 2. Check whether the collection belongs to the user
            var hasAccess = await _context.Collections.AnyAsync(c => c.Id == id && c.OwnerId == userId);
            if (!hasAccess) return Forbid(); // 403 Forbidden

            // 3. Fundamental Query
            var query = _context.Notes
                .Where(n => n.CollectionId == id && n.OwnerId == userId);

            // 4. Apply Cursor Logic
            var decodedCursor = CursorHelper.Decode(cursor);
            if (decodedCursor != null)
            {
                var cursorDate = decodedCursor.Value.CreatedAt;
                var cursorId = decodedCursor.Value.Id;

                // Newest First Order:
                query = query.Where(n =>
                    n.CreatedAt < cursorDate ||
                    (n.CreatedAt == cursorDate && n.Id.CompareTo(cursorId) < 0));
            }

            // 5. Fetch Data
            var notes = await query
                .OrderByDescending(n => n.CreatedAt)
                .ThenByDescending(n => n.Id)
                .Take(limit + 1)
                .Select(n => new NoteSummaryDto(
                    n.Id, n.Title, n.Slug, n.IsPublic, n.HasUnpublishedChanges, n.CreatedAt
                ))
                .ToListAsync();

            // 6. NextCursor Calculation
            string? nextCursor = null;

            if (notes.Count > limit)
            {
                // Another item exists
                var lastItem = notes[limit - 1];
                nextCursor = CursorHelper.Encode(lastItem.CreatedAt, lastItem.Id);

                notes.RemoveAt(limit); // Remove the control item from the list
            }

            return Ok(new PagedNoteResponseDto(notes, nextCursor));
        }
    }
}
