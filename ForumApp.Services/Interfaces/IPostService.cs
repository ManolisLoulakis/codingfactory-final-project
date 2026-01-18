using System.Collections.Generic;
using System.Threading.Tasks;
using ForumApp.Services.DTOs;

namespace ForumApp.Services.Interfaces;

public interface IPostService
{
    Task<IEnumerable<PostDto>> GetAllPostsAsync();
    Task<PostDto?> GetPostByIdAsync(int id);
    Task<PostDto> CreatePostAsync(CreatePostDto dto, int userId);
    Task<IEnumerable<PostDto>> GetPostsByCategoryAsync(int categoryId);
    Task AddCommentAsync(CreateCommentDto dto, int userId);
    Task DeletePostAsync(int postId);
}
