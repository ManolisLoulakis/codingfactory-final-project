using System;

namespace ForumApp.Services.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? MutedUntil { get; set; }
    public DateTime? BannedUntil { get; set; }
    public bool IsMuted { get; set; }
    public bool IsBanned { get; set; }
}
