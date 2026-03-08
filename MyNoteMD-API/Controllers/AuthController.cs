using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Query.Internal;
using MyNoteMD_API.DTOs;
using MyNoteMD_API.Models;
using MyNoteMD_API.Services;
using System.Security.Claims;

namespace MyNoteMD_API.Controllers
{
    [ApiController]
    [Route("v1/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ISessionService _sessionService;
        private readonly IAuditService _auditService;

        public AuthController(UserManager<AppUser> userManager, ISessionService sessionService, IAuditService auditService)
        {
            _userManager = userManager;
            _sessionService = sessionService;
            _auditService = auditService;
        }

        private Guid GetCurrentUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.Parse(userId!);
        }

        [IgnoreAntiforgeryToken]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existingUser = await _userManager.FindByEmailAsync(request.Email);

            if (existingUser != null)
            {
                return BadRequest(new { Message = "Provided email address is already in use." });
            }

            var user = new AppUser
            {
                Id = Guid.CreateVersion7(),
                GivenName = request.GivenName,
                FamilyName = request.FamilyName,
                Email = request.Email,
                UserName = request.Email
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            await _auditService.LogAsync(user.Id, "RegisterSuccess");

            var userDto = new UserDTO(user.Id, user.Email, user.GivenName, user.FamilyName);

            return StatusCode(201, userDto);
        }

        [IgnoreAntiforgeryToken]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                if (user != null)
                {
                    await _auditService.LogAsync(user.Id, "LoginFailed", "Wrong Password Trial");
                }
                return Unauthorized(new { Message = "Wrong email or password!" });
            }

            // Create Opaque Token and Save into Redis
            var token = await _sessionService.CreateSessionAsync(user);

            // Create HttpOnly Cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            };

            // Add Cookie to Response Headers
            Response.Cookies.Append("MyNoteMD_Session", token, cookieOptions);

            await _auditService.LogAsync(user.Id, "LoginSuccess");

            var response = new AuthResponseDTO(new UserDTO(user.Id, user.Email!, user.GivenName, user.FamilyName));

            return Ok(response);
        }

        [Authorize]
        [IgnoreAntiforgeryToken]
        [HttpGet("csrf-token")]
        public IActionResult GetCsrfToken([FromServices] IAntiforgery antiforgery)
        {
            var tokens = antiforgery.GetAndStoreTokens(HttpContext);
            return Ok(new { token = tokens.RequestToken });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userId = GetCurrentUserId();

            // 1. Get Cookie Coming from Browser
            if (Request.Cookies.TryGetValue("MyNoteMD_Session", out var token))
            {
                // 2. Remove token in Redis (Session becomes immediately invalidated)
                await _sessionService.RevokeSessionAsync(token);
            }

            // 3. Instruct the browser to delete the cookie
            Response.Cookies.Delete("MyNoteMD_Session");

            await _auditService.LogAsync(userId, "Logout");

            return Ok(new { Message = "Successfully logged out." });
        }

        [Authorize]
        [HttpPost("logout-all")]
        public async Task<IActionResult> LogoutAllDevices()
        {
            var userId = GetCurrentUserId();

            // 1. Remove all session tokens in Redis
            await _sessionService.RevokeAllUserSessionsAsync(userId);

            // 2. Remove token in the current browser
            Response.Cookies.Delete("MyNoteMD_Session");

            // 3. Log the activity
            await _auditService.LogAsync(userId, "LogoutAllDevices", "The user has logged out of all devices.");

            return Ok(new { Message = "Your sessions have been terminated on all devices." });
        }
    }
}
