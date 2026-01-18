using System.Collections.Generic;

namespace ForumApp.Core.Entities;

public class Category : BaseEntity
{
    public required string Name { get; set; }
    public string? Description { get; set; }

    // Navigation Properties
    public ICollection<Post> Posts { get; set; } = new List<Post>();
}
