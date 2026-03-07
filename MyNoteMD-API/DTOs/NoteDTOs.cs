using System.ComponentModel.DataAnnotations;

namespace MyNoteMD_API.DTOs
{
    public record CreateNoteDto(
        [Required, MaxLength(200)] string Title,
        [Required] Guid CollectionId
    );

    // 2. Patch DTO for Auto-Save (Draft)
    public record UpdateNoteDraftDto(
        string? Title,
        string? Content,
        List<Guid>? TagIds
    );

    public record NoteDetailDto(
        Guid Id,
        string Title,
        string Slug,
        string Content, // Draft Content
        string? PublishedContent, // Published Content
        bool IsPublic,
        bool HasUnpublishedChanges,
        Guid CollectionId,
        DateTimeOffset CreatedAt,
        DateTimeOffset? PublishedAt
    );

    public record PublicNoteDto(
        string Title,
        string Content, // PublishedContent
        string OwnerFullName,
        DateTimeOffset? PublishedAt
    );

    public record NoteSummaryDto(
        Guid Id,
        string Title,
        string Slug,
        bool IsPublic,
        bool HasUnpublishedChanges,
        DateTimeOffset CreatedAt
    );

    public record PagedNoteResponseDto(
        IEnumerable<NoteSummaryDto> Items,
        string? NextCursor
    );

    public record MoveNoteDto(
        [Required] Guid TargetCollectionId
    );
}
