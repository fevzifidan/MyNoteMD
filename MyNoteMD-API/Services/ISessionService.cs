using MyNoteMD_API.Models;

namespace MyNoteMD_API.Services
{
    public interface ISessionService
    {
        Task<string> CreateSessionAsync(AppUser user);
        Task<SessionData?> GetSessionAsync(string token);
        Task RevokeSessionAsync(string token);
        Task ExtendSessionAsync(string token);
        Task RevokeAllUserSessionsAsync(Guid userId);
    }

    // User data to be hold in Redis
    public record SessionData(
        Guid UserId,
        string Email,
        string GivenName,
        string FamilyName,
        string IpAddress,
        string UserAgent
    );
}
