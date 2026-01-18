using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ForumApp.Core.Entities;
using ForumApp.Core.Interfaces;
using ForumApp.Services.DTOs;
using ForumApp.Services.Interfaces;

namespace ForumApp.Services.Implementations;

public class PostService : IPostService
{
    private readonly IPostRepository _postRepository;
    private readonly IGenericRepository<Category> _categoryRepository;
    private readonly IGenericRepository<Comment> _commentRepository;

    public PostService(IPostRepository postRepository, IGenericRepository<Category> categoryRepository, IGenericRepository<Comment> commentRepository)
    {
        _postRepository = postRepository;
        _categoryRepository = categoryRepository;
        _commentRepository = commentRepository;
    }

    public async Task<IEnumerable<PostDto>> GetAllPostsAsync()
    {
        var posts = await _postRepository.GetPostsWithDetailsAsync();
        return posts.Select(p => new PostDto
        {
            Id = p.Id,
            Title = p.Title,
            Content = p.Content,
            AuthorName = p.User.Username,
            CategoryId = p.CategoryId,
            CategoryName = p.Category.Name,
            CreatedAt = p.CreatedAt,
            CommentsCount = p.Comments.Count
        });
    }

    public async Task<PostDto?> GetPostByIdAsync(int id)
    {
        var posts = await _postRepository.GetPostsWithDetailsAsync();
        var p = posts.FirstOrDefault(x => x.Id == id);
        
        if (p == null) return null;

        return new PostDto
        {
            Id = p.Id,
            Title = p.Title,
            Content = p.Content,
            AuthorName = p.User.Username,
            CategoryId = p.CategoryId,
            CategoryName = p.Category.Name,
            CreatedAt = p.CreatedAt,
            CommentsCount = p.Comments.Count,
            Comments = p.Comments.Select(c => new CommentDto
            {
                Id = c.Id,
                Content = c.Content,
                PostId = c.PostId,
                UserId = c.UserId,
                AuthorName = c.User.Username,
                CreatedAt = c.CreatedAt
            }).OrderByDescending(c => c.CreatedAt).ToList()
        };
    }

    public async Task<PostDto> CreatePostAsync(CreatePostDto dto, int userId)
    {
        var category = await _categoryRepository.GetByIdAsync(dto.CategoryId);
        if (category == null) throw new Exception("Category not found");

        var post = new Post
        {
            Title = dto.Title,
            Content = dto.Content,
            CategoryId = dto.CategoryId,
            UserId = userId
        };

        var createdPost = await _postRepository.AddAsync(post);
        
        return new PostDto
        {
            Id = createdPost.Id,
            Title = createdPost.Title,
            Content = createdPost.Content,
            AuthorName = "You", 
            CategoryName = category.Name,
            CreatedAt = createdPost.CreatedAt,
            CommentsCount = 0
        };
    }

    public async Task<IEnumerable<PostDto>> GetPostsByCategoryAsync(int categoryId)
    {
        var posts = await _postRepository.GetPostsWithDetailsAsync();
        return posts
            .Where(p => p.CategoryId == categoryId)
            .Select(p => new PostDto
            {
                Id = p.Id,
                Title = p.Title,
                Content = p.Content,
                AuthorName = p.User.Username,
                CategoryName = p.Category.Name,
                CreatedAt = p.CreatedAt,
                CommentsCount = p.Comments.Count
            });
    }

    public async Task AddCommentAsync(CreateCommentDto dto, int userId)
    {
        var post = await _postRepository.GetByIdAsync(dto.PostId);
        if (post == null) throw new Exception("Post not found");

        var comment = new Comment
        {
            Content = dto.Content,
            PostId = dto.PostId,
            UserId = userId
        };

        await _commentRepository.AddAsync(comment);
    }

    public async Task DeletePostAsync(int postId)
    {
        var post = await _postRepository.GetByIdAsync(postId);
        if (post == null) throw new Exception("Post not found");
        await _postRepository.DeleteAsync(post);
    }
}
