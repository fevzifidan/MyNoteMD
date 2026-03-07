using System;
using System.Threading.Tasks;

namespace MyNoteMD_API.Services
{
    public interface IAuditService
    {
        Task LogAsync(Guid userId, string action, string? details = null);
    }
}
