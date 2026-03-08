using System.ComponentModel.DataAnnotations;

namespace MyNoteMD_API.DTOs
{
    public record RegisterDTO
    (
        [Required, EmailAddress] string Email,
        [Required, MinLength(8)] string Password,
        [Required, MinLength(3)] string GivenName,
        [Required, MinLength(2)] string FamilyName
    );

    public record LoginDTO
    (
        [Required, EmailAddress] string Email,
        [Required, MinLength(8)] string Password
    );

    public record UserDTO
    (
        Guid Id,
        string Email,
        string GivenName,
        string FamilyName
    );

    public record AuthResponseDTO
    (
        UserDTO User
    );
}
