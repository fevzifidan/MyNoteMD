namespace MyNoteMD_API.Models
{
    public class Collection: BaseEntity
    {
        public string Name { get; set; } = string.Empty;

        // Foreign Key
        public Guid OwnerId { get; set; }
        public virtual AppUser Owner { get; set; } = null!;

        // Notes in the collection
        public virtual ICollection<Note> Notes { get; set; } = new List<Note>();
    }
}
