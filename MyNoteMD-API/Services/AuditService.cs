using MyNoteMD_API.Data;
using MyNoteMD_API.Models;

namespace MyNoteMD_API.Services
{
    public class AuditService: IAuditService
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuditService(AppDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task LogAsync(Guid userId, string action, string? details = null)
        {
            var context = _httpContextAccessor.HttpContext;

            // IP Adresini al (Proxy veya Cloudflare arkasındaysa X-Forwarded-For header'ına da bakılabilir)
            var ipAddress = context?.Connection.RemoteIpAddress?.ToString() ?? "Unknown";

            // Tarayıcı ve Cihaz bilgisini al
            var userAgent = context?.Request.Headers["User-Agent"].ToString() ?? "Unknown";

            var auditLog = new AuditLog
            {
                Id = Guid.CreateVersion7(),
                UserId = userId,
                Action = action,
                IpAddress = ipAddress,
                UserAgent = userAgent,
                Details = details,
                CreatedAt = DateTimeOffset.UtcNow
            };

            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync();
        }
    }
}
