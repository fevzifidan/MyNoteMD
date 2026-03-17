using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyNoteMD_API.Models;
using MyNoteMD_API.DTOs;
using System.Security.Claims;

namespace NoteFlow.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("v1/account")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;

        public AccountController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        private Guid GetCurrentUserId()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString)) return Guid.Empty;
            return Guid.Parse(userIdString);
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = GetCurrentUserId();

            if (userId == Guid.Empty)
                return Unauthorized(new { Message = "Oturum geçersiz." });

            // We fetch the user information from the database (for the most up-to-date data)
            var user = await _userManager.FindByIdAsync(userId.ToString());

            if (user == null)
                return NotFound(new { Message = "Kullanıcı bulunamadı." });

            // We return the user in UserDto format
            var userDto = new UserDTO(
                user.Id,
                user.Email!,
                user.GivenName,
                user.FamilyName
            );

            return Ok(new { user = userDto });
        }
    }
}