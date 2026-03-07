using MyNoteMD_API.Models;
using StackExchange.Redis;
using System.Security.Cryptography;
using System.Text.Json;

namespace MyNoteMD_API.Services
{
    public class SessionService: ISessionService
    {
        private readonly IDatabase _redis;
        private readonly TimeSpan _sessionLifetime = TimeSpan.FromDays(7);
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SessionService(IConnectionMultiplexer redisMultiplexer, IHttpContextAccessor httpContextAccessor)
        {
            _redis = redisMultiplexer.GetDatabase();
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<string> CreateSessionAsync(AppUser user)
        {
            var context = _httpContextAccessor.HttpContext;
            var ipAddress = context?.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var userAgent = context?.Request.Headers["User-Agent"].ToString() ?? "Unknown";

            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var token = Convert.ToBase64String(tokenBytes)
                .Replace("+", "-").Replace("/", "_").Replace("=", "");

            // Prepare data to be hold in Redis
            var sessionData = new SessionData(user.Id, user.Email!, user.GivenName, user.FamilyName, ipAddress, userAgent);
            var json = JsonSerializer.Serialize(sessionData);

            // Save session data into Redis
            await _redis.StringSetAsync($"session:{token}", json, _sessionLifetime);

            // Add this new token to the user's active token list (Set).
            await _redis.SetAddAsync($"user_sessions:{user.Id}", token);
            await _redis.KeyExpireAsync($"user_sessions:{user.Id}", _sessionLifetime);

            return token;
        }

        public async Task<SessionData?> GetSessionAsync(string token)
        {
            var redisValue = await _redis.StringGetAsync($"session:{token}");
            if (redisValue.IsNullOrEmpty) return null;

            return JsonSerializer.Deserialize<SessionData>(redisValue.ToString());
        }

        public async Task RevokeSessionAsync(string token)
        {
            var sessionData = await GetSessionAsync(token);
            if (sessionData != null)
            {
                // Delete both the main session and the record in the user's set
                await _redis.KeyDeleteAsync($"session:{token}");
                await _redis.SetRemoveAsync($"user_sessions:{sessionData.UserId}", token);
            }
        }

        public async Task ExtendSessionAsync(string token)
        {
            // Extends the lifespan of the key in Redis back to 7 days
            await _redis.KeyExpireAsync($"session:{token}", _sessionLifetime);
        }

        public async Task RevokeAllUserSessionsAsync(Guid userId)
        {
            var userSessionsKey = $"user_sessions:{userId}";

            // Fetch all active tokens from the Redis Set by the user.
            var tokens = await _redis.SetMembersAsync(userSessionsKey);

            if (tokens.Length > 0)
            {
                // Remove all session tokens
                var keysToDelete = tokens.Select(t => (RedisKey)$"session:{t}").ToArray();
                await _redis.KeyDeleteAsync(keysToDelete);
            }

            // Completely clear the user's token list (Set)
            await _redis.KeyDeleteAsync(userSessionsKey);
        }
    }
}
