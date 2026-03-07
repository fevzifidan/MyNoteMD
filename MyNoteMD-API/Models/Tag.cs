namespace MyNoteMD_API.Models
{
    public class Tag: BaseEntity
    {
        public string Name { get; set; } = string.Empty;

        public Guid OwnerId { get; set; }
        public virtual AppUser Owner { get; set; } = null!;

        // Navigation Property
        public virtual ICollection<Note> Notes { get; set; } = new List<Note>();
    }
}
