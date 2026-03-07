namespace MyNoteMD_API.Models
{
    public class AuditLog: BaseEntity
    {
        public Guid UserId { get; set; }
        public string Action { get; set; } = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public string UserAgent { get; set; } = string.Empty;
        public string? Details { get; set; }
    }
}
