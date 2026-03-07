using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using MyNoteMD_API.Services;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace MyNoteMD_API.Handlers
{
    public class OpaqueTokenAuthHandler: AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly ISessionService _sessionService;

        public OpaqueTokenAuthHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISessionService sessionService)
            : base(options, logger, encoder)
        {
            _sessionService = sessionService;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            // 1. Read the token in the Cookie
            if (!Request.Cookies.TryGetValue("MyNoteMD_Session", out var token))
            {
                return AuthenticateResult.NoResult();
            }

            // 2. Check the validity of the token from Redis
            var sessionData = await _sessionService.GetSessionAsync(token);
            if (sessionData == null)
            {
                // Token invalid or expired
                Response.Cookies.Delete("MyNoteMD_Session");
                // Decline request
                return AuthenticateResult.Fail("Invalid or expired session.");
            }

            // 3. SESSION HIJACKING CONTROL
            var currentIp = Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var currentUserAgent = Request.Headers["User-Agent"].ToString() ?? "Unknown";

            // User-Agent must be the same
            if (sessionData.UserAgent != currentUserAgent)
            {
                await _sessionService.RevokeSessionAsync(token); // Remove the token from Redis
                Response.Cookies.Delete("MyNoteMD_Session");

                return AuthenticateResult.Fail("User-Agent change detected.");
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, sessionData.UserId.ToString()),
                new Claim(ClaimTypes.Email, sessionData.Email),
                new Claim(ClaimTypes.Name, sessionData.GivenName),
                new Claim(ClaimTypes.Surname, sessionData.FamilyName)
            };

            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            await _sessionService.ExtendSessionAsync(token);

            return AuthenticateResult.Success(ticket);
        }
    }
}
