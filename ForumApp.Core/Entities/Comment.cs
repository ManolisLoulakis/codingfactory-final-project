namespace ForumApp.Core.Entities;

public class Comment : BaseEntity
{
    public required string Content { get; set; }
    
    // Foreign Keys
    public int PostId { get; set; }
    public Post Post { get; set; } = null!;
    
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}
