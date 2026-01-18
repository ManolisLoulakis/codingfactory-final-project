using System.ComponentModel.DataAnnotations;

namespace ForumApp.Services.DTOs;

public class CreateCommentDto
{
    [Required]
    public string Content { get; set; } = string.Empty;

    [Required]
    public int PostId { get; set; }
}
