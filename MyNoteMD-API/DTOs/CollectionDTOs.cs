using System.ComponentModel.DataAnnotations;

namespace MyNoteMD_API.DTOs
{
    public record CreateCollectionDto (
        [Required, MaxLength(100)] string Name
    );

    public record CollectionResponseDto (
        Guid Id,
        string Name,
        int NoteCount,
        DateTimeOffset CreatedAt
    );

    public record PagedCollectionResponseDto(
        IEnumerable<CollectionResponseDto> Items,
        string? NextCursor
    );
}
