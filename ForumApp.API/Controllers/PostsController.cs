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
public class PostsController : ControllerBase
{
    private readonly IPostService _postService;

    public PostsController(IPostService postService)
    {
        _postService = postService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPosts()
    {
        var posts = await _postService.GetAllPostsAsync();
        return Ok(posts);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPost(int id)
    {
        var post = await _postService.GetPostByIdAsync(id);
        if (post == null) return NotFound();
        return Ok(post);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreatePost(CreatePostDto dto)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub) 
                          ?? User.Claims.FirstOrDefault(c => c.Type == "sub")
                          ?? User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        try
        {
            var post = await _postService.CreatePostAsync(dto, userId);
            return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post);
        }
        catch (System.Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("comments")]
    public async Task<IActionResult> AddComment(CreateCommentDto dto)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub) 
                          ?? User.Claims.FirstOrDefault(c => c.Type == "sub")
                          ?? User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        try
        {
            await _postService.AddCommentAsync(dto, userId);
            // In a real app we might return the created comment, but for now 204 No Content or 200 OK is fine.
            return Ok(new { Message = "Comment added successfully" });
        }
        catch (System.Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id)
    {
        try
        {
            await _postService.DeletePostAsync(id);
            return NoContent();
        }
        catch (System.Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
}
