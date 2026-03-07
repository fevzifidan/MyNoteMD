using Microsoft.AspNetCore.Identity;

namespace MyNoteMD_API.Models
{
    public class AppUser: IdentityUser<Guid>
    {
        public string GivenName { get; set; } = string.Empty;
        public string FamilyName { get; set; } = string.Empty;
        public virtual ICollection<Collection> Collections { get; set; } = new List<Collection>();
        public virtual ICollection<Note> Notes { get; set; } = new List<Note>();
        public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();
    }
}
