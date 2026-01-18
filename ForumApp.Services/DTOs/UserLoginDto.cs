using System.ComponentModel.DataAnnotations;

namespace ForumApp.Services.DTOs;

public class UserLoginDto
{
    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
