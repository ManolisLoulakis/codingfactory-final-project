using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using ForumApp.Services.DTOs;
using ForumApp.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ForumApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegisterDto dto)
    {
        try
        {
            var token = await _authService.RegisterAsync(dto);
            return Ok(new { Token = token });
        }
        catch (System.Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto dto)
    {
        try
        {
            var token = await _authService.LoginAsync(dto);
            return Ok(new { Token = token });
        }
        catch (System.Exception ex)
        {
            return Unauthorized(new { Message = ex.Message });
        }
    }

    [HttpPost("promote/{email}")]
    public async Task<IActionResult> PromoteToAdmin(string email)
    {
        try
        {
            await _authService.PromoteToAdminAsync(email);
            return Ok(new { Message = $"User {email} is now an Admin" });
        }
        catch (System.Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [Authorize]
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        // Simple role check based on the claim we added in AuthService
        var roleClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
        if (roleClaim?.Value != "Admin") return Forbid();

        var users = await _authService.GetAllUsersAsync();
        return Ok(users);
    }

    [Authorize]
    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var roleClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
        if (roleClaim?.Value != "Admin") return Forbid();

        try
        {
            await _authService.DeleteUserAsync(id);
            return NoContent();
        }
        catch (System.Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("users/{id}/mute")]
    public async Task<IActionResult> MuteUser(int id, [FromBody] ModerationActionDto dto)
    {
        var roleClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
        if (roleClaim?.Value != "Admin") return Forbid();

        try
        {
            await _authService.MuteUserAsync(id, dto.DurationMinutes);
            return Ok(new { Message = "User muted successfully" });
        }
        catch (System.Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("users/{id}/unmute")]
    public async Task<IActionResult> UnmuteUser(int id)
    {
        var roleClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
        if (roleClaim?.Value != "Admin") return Forbid();

        try
        {
            await _authService.UnmuteUserAsync(id);
            return Ok(new { Message = "User unmuted successfully" });
        }
        catch (System.Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("users/{id}/ban")]
    public async Task<IActionResult> BanUser(int id, [FromBody] ModerationActionDto dto)
    {
        var roleClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
        if (roleClaim?.Value != "Admin") return Forbid();

        try
        {
            await _authService.BanUserAsync(id, dto.DurationMinutes);
            return Ok(new { Message = "User banned successfully" });
        }
        catch (System.Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("users/{id}/unban")]
    public async Task<IActionResult> UnbanUser(int id)
    {
        var roleClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
        if (roleClaim?.Value != "Admin") return Forbid();

        try
        {
            await _authService.UnbanUserAsync(id);
            return Ok(new { Message = "User unbanned successfully" });
        }
        catch (System.Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
}
