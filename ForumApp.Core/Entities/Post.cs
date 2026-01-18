using System.Collections.Generic;

namespace ForumApp.Core.Entities;

public class Post : BaseEntity
{
    public required string Title { get; set; }
    public required string Content { get; set; }
    
    // Foreign Keys
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    
    // Navigation Properties
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
