using System.ComponentModel.DataAnnotations;

namespace ForumApp.Services.DTOs;

public class CreatePostDto
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    [Required]
    public int CategoryId { get; set; }
}
