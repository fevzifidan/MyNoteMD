namespace MyNoteMD_API.Models
{
    public class Note: BaseEntity
    {
        public string Title { get; set; } = string.Empty;

        // Slug for public shares
        public string Slug { get; set; } = string.Empty;

        // Raw Markdown Content
        public string Content { get; set; } = string.Empty;

        public string? PublishedContent { get; set; } = string.Empty;
        public DateTimeOffset? PublishedAt { get; set; }

        public bool IsPublic { get; set; } = false;
        public bool HasUnpublishedChanges { get; set; } = false;

        // Foreign Keys
        public Guid CollectionId { get; set; }
        public virtual Collection Collection { get; set; } = null!;

        public Guid OwnerId { get; set; }
        public virtual AppUser Owner { get; set; } = null!;

        public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();
    }
}
