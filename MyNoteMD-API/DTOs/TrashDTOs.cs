namespace MyNoteMD_API.DTOs
{
    public record TrashItemDto(
        Guid Id,
        string Type, // "note" or "collection"
        string TitleOrName,
        DateTimeOffset? DeletedAt,

        // Specified for only notes
        string? ParentCollectionName,

        // Specified for only collections
        int? AffectedNotesCount
    );

    public record PagedTrashResponseDto(
        IEnumerable<TrashItemDto> Items,
        string? NextCursor
    );
}
