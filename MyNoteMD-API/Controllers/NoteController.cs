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
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MyNoteMD_API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("v1/notes")]
    public class NoteController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAuditService _auditService;

        public NoteController(AppDbContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        private Guid GetCurrentUserId()
        {
            return Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        private string GenerateSlug(string title, Guid id)
        {
            string str = title.ToLowerInvariant();
            str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
            str = Regex.Replace(str, @"\s+", " ").Trim();
            str = str.Replace(" ", "-");

            // To avoid collisions, we append the first 8 characters of the UUID to the end.
            var shortId = id.ToString().Substring(0, 8);
            return $"{str}-{shortId}";
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? cursor, [FromQuery] int limit = 20, [FromQuery] string? search = null)
        {
            // 1. Set a maximum limit
            limit = Math.Min(limit, 50);

            var userId = GetCurrentUserId();

            var query = _context.Notes.Where(n => n.OwnerId == userId);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchTerm = search.ToLower();
                // EF Core translates the term into PostgreSQL to use ILIKE (case-insensitive).
                query = query.Where(n =>
                    n.Title.ToLower().Contains(searchTerm) ||
                    n.Content.ToLower().Contains(searchTerm));
            }

            // 2. Apply Cursor Logic
            var decodedCursor = CursorHelper.Decode(cursor);
            if (decodedCursor != null)
            {
                var cursorDate = decodedCursor.Value.CreatedAt;
                var cursorId = decodedCursor.Value.Id;

                query = query.Where(n =>
                    n.CreatedAt < cursorDate ||
                    (n.CreatedAt == cursorDate && n.Id.CompareTo(cursorId) < 0));
            }

            // Check whether a next item exists
            var notes = await query
                .OrderByDescending(n => n.CreatedAt)
                .ThenByDescending(n => n.Id)
                .Take(limit + 1)
                .Select(n => new NoteSummaryDto(
                    n.Id, n.Title, n.Slug, n.IsPublic, n.HasUnpublishedChanges, n.CreatedAt, n.UpdatedAt
                ))
                .ToListAsync();

            // 6. NextCursor Calculation
            string? nextCursor = null;

            if (notes.Count > limit)
            {
                // Remove the last item (used to check) from the list
                var lastItem = notes[limit - 1];
                nextCursor = CursorHelper.Encode(lastItem.CreatedAt, lastItem.Id);

                notes.RemoveAt(limit);
            }

            return Ok(new PagedNoteResponseDto(notes, nextCursor));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateNoteDto request)
        {
            var userId = GetCurrentUserId();

            // Check whether the collection belongs to the user or not
            var collectionExists = await _context.Collections
                .AnyAsync(c => c.Id == request.CollectionId && c.OwnerId == userId);

            if (!collectionExists)
            {
                await _auditService.LogAsync(userId, "NoteNotCreated", $"Specified Collection with ID: {request.CollectionId} Is Not Suitable");
                return BadRequest("Invalid collection.");
            }

            var noteId = Guid.CreateVersion7();

            var note = new Note
            {
                Id = noteId,
                Title = request.Title,
                Slug = GenerateSlug(request.Title, noteId),
                Content = "", // Draft starts empty
                PublishedContent = "", // No current published content exists
                CollectionId = request.CollectionId,
                OwnerId = userId,
                HasUnpublishedChanges = true,
                IsPublic = false // Private by default
            };

            _context.Notes.Add(note);
            await _context.SaveChangesAsync();
            await _auditService.LogAsync(userId, "NewNoteCreated", $" Note Created with ID: {noteId} in Collection with ID: {request.CollectionId}");

            return StatusCode(201, new { Id = note.Id, Slug = note.Slug });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var userId = GetCurrentUserId();

            var note = await _context.Notes
                .Where(n => n.Id == id && n.OwnerId == userId)
                .Select(n => new NoteDetailDto(
                    n.Id, n.Title, n.Slug, n.Content, n.PublishedContent,
                    n.IsPublic, n.HasUnpublishedChanges, n.CollectionId,
                    n.CreatedAt, n.UpdatedAt, n.PublishedAt
                ))
                .FirstOrDefaultAsync();

            if (note == null)
            {
                await _auditService.LogAsync(userId, "NoteNotFound", $"[GET] Requested Note ID: {id}");
                return NotFound();
            }

            return Ok(note);
        }

        // Update Note
        [HttpPatch("{id}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateNoteDraftDto request)
        {
            var userId = GetCurrentUserId();
            var note = await _context.Notes.FirstOrDefaultAsync(n => n.Id == id && n.OwnerId == userId);

            if (note == null) return NotFound();

            bool isDraftChanged = false;

            if (request.Title != null && request.Title != note.Title)
            {
                note.Title = request.Title;
                note.Slug = GenerateSlug(request.Title, note.Id); // Slug should be changed if the title changes
                isDraftChanged = true;
            }

            if (request.Content != null && request.Content != note.Content)
            {
                note.Content = request.Content;
                isDraftChanged = true;
            }

            if (request.IsPublic.HasValue)
            {
                note.IsPublic = request.IsPublic.Value;
            }

            if (isDraftChanged)
            {
                note.HasUnpublishedChanges = true;
            }

            note.UpdatedAt = DateTimeOffset.Now;

            await _context.SaveChangesAsync();

            return NoContent(); // 204
        }

        // Publish
        [HttpPost("{id}/publish")]
        public async Task<IActionResult> Publish(Guid id)
        {
            var userId = GetCurrentUserId();
            var note = await _context.Notes.FirstOrDefaultAsync(n => n.Id == id && n.OwnerId == userId);

            if (note == null) return NotFound();

            // Publish the draft
            note.PublishedContent = note.Content;
            note.HasUnpublishedChanges = false;
            note.PublishedAt = DateTimeOffset.UtcNow;

            // This endpoint does not change the accessibility of the note

            await _context.SaveChangesAsync();
            await _auditService.LogAsync(userId, "NotePublished", $"Published Note ID: {id}");

            return Ok(new { Message = "Note published successfully.", Slug = note.Slug });
        }

        // Toggle Note Visibility
        [HttpPost("{id}/toggle-visibility")]
        public async Task<IActionResult> ToggleVisibility([FromRoute] Guid id)
        {
            var userId = GetCurrentUserId();
            var note = await _context.Notes.FirstOrDefaultAsync(n => n.Id == id && n.OwnerId == userId);

            if (note == null) return NotFound();

            note.IsPublic = !note.IsPublic;
            await _context.SaveChangesAsync();

            return Ok(new { Message = $"Note is now {(note.IsPublic ? "public" : "private")}." });
        }

        // Move the note to another collection
        [HttpPatch("{id}/move")]
        public async Task<IActionResult> Move(Guid id, [FromBody] MoveNoteDto request)
        {
            var userId = GetCurrentUserId();

            // Check whether the target collection exists and belongs to the user
            var validCollection = await _context.Collections.AnyAsync(c => c.Id == request.TargetCollectionId && c.OwnerId == userId);
            if (!validCollection) return BadRequest("Target collection is not suitable.");

            var note = await _context.Notes.FirstOrDefaultAsync(n => n.Id == id && n.OwnerId == userId);
            if (note == null) return NotFound();

            note.CollectionId = request.TargetCollectionId;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = GetCurrentUserId();
            var note = await _context.Notes.FirstOrDefaultAsync(n => n.Id == id && n.OwnerId == userId);

            if (note == null)
            {
                await _auditService.LogAsync(userId, "NoteNotFound", $"[DELETE] Requested Note ID: {id}");
                return NotFound();
            }

            note.DeletedAt = DateTimeOffset.UtcNow; // Soft Delete
            await _context.SaveChangesAsync();
            await _auditService.LogAsync(userId, "NoteDeleted", $"Deleted Note ID: {id}");

            return NoContent();
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpGet("public/{slug}")]
        public async Task<IActionResult> GetPublicNote(string slug)
        {
            var noteId = await _context.Notes
                .Include(n => n.Owner)
                .Where(n => n.Slug == slug && n.IsPublic)
                .Select(n => n.Id)
                .FirstOrDefaultAsync();

            // Notes should be public and not deleted
            var note = await _context.Notes
                .Include(n => n.Owner)
                .Where(n => n.Slug == slug && n.IsPublic)
                .Select(n => new PublicNoteDto(
                    n.Title,
                    n.PublishedContent ?? "", // Public endpoint does not show draft, shows published content
                    $"{n.Owner.GivenName} {n.Owner.FamilyName}",
                    n.PublishedAt
                ))
                .FirstOrDefaultAsync();

            if (note == null)
                return NotFound(new { Message = "Note could not found or it is private." });

            // await _auditService.LogAsync(userId, "PublicAccess", $"Accessed Note ID: {noteId}");

            return Ok(note);
        }
    }
}