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
        DateTimeOffset CreatedAt,
        DateTimeOffset? UpdatedAt
    );

    public record PagedCollectionResponseDto(
        IEnumerable<CollectionResponseDto> Items,
        string? NextCursor
    );

    public record CollectionLookupDto(Guid Id, string Name);

    public record UpdateCollectionDto(
        [Required, MaxLength(100)] string Name
    );
}
