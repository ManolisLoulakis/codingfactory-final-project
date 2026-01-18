using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using ForumApp.Core.Entities;
using ForumApp.Core.Interfaces;
using ForumApp.Services.DTOs;
using ForumApp.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ForumApp.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<string> RegisterAsync(UserRegisterDto dto)
    {
        if (await _userRepository.GetByUsernameAsync(dto.Username) != null)
            throw new Exception("Username already exists.");

        if (await _userRepository.GetByEmailAsync(dto.Email) != null)
            throw new Exception("Email already exists.");

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = UserRole.User
        };

        await _userRepository.AddAsync(user);
        return GenerateJwtToken(user);
    }

    public async Task<string> LoginAsync(UserLoginDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new Exception("Invalid attributes.");

        return GenerateJwtToken(user);
    }

    public async Task PromoteToAdminAsync(string email)
    {
        var user = await _userRepository.GetByEmailAsync(email);
        if (user == null) throw new Exception("User not found");

        user.Role = UserRole.Admin;
        await _userRepository.UpdateAsync(user);
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.ListAllAsync();
        return users.Select(u => new UserDto
        {
            Id = u.Id,
            Username = u.Username,
            Email = u.Email,
            Role = u.Role.ToString(),
            CreatedAt = u.CreatedAt,
            MutedUntil = u.MutedUntil,
            BannedUntil = u.BannedUntil,
            IsMuted = u.IsMuted,
            IsBanned = u.IsBanned
        });
    }

    public async Task DeleteUserAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) throw new Exception("User not found");
        await _userRepository.DeleteAsync(user);
    }

    public async Task MuteUserAsync(int userId, int durationMinutes)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) throw new Exception("User not found");
        user.MutedUntil = durationMinutes == 0 
            ? DateTime.MaxValue 
            : DateTime.UtcNow.AddMinutes(durationMinutes);
        await _userRepository.UpdateAsync(user);
    }

    public async Task UnmuteUserAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) throw new Exception("User not found");
        user.MutedUntil = null;
        await _userRepository.UpdateAsync(user);
    }

    public async Task BanUserAsync(int userId, int durationMinutes)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) throw new Exception("User not found");
        user.BannedUntil = durationMinutes == 0 
            ? DateTime.MaxValue 
            : DateTime.UtcNow.AddMinutes(durationMinutes);
        await _userRepository.UpdateAsync(user);
    }

    public async Task UnbanUserAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) throw new Exception("User not found");
        user.BannedUntil = null;
        await _userRepository.UpdateAsync(user);
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? "super_secret_key_12345678901234567890"; // Fallback for dev
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"] ?? "ForumApp",
            audience: jwtSettings["Audience"] ?? "ForumApp",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
