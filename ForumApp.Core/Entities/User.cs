using System.Collections.Generic;

namespace ForumApp.Core.Entities;

public enum UserRole
{
    User,
    Admin
}

public class User : BaseEntity
{
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public UserRole Role { get; set; } = UserRole.User;
    public DateTime? MutedUntil { get; set; }
    public DateTime? BannedUntil { get; set; }

    public bool IsMuted => MutedUntil.HasValue && MutedUntil > DateTime.UtcNow;
    public bool IsBanned => BannedUntil.HasValue && BannedUntil > DateTime.UtcNow;
    public ICollection<Post> Posts { get; set; } = new List<Post>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
