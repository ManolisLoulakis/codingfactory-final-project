using System.Collections.Generic;
using System.Threading.Tasks;
using ForumApp.Core.Entities;
using ForumApp.Core.Interfaces;
using ForumApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ForumApp.Infrastructure.Repositories;

public class PostRepository : GenericRepository<Post>, IPostRepository
{
    public PostRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<IReadOnlyList<Post>> GetPostsWithDetailsAsync()
    {
        return await _context.Posts
            .Include(p => p.User)
            .Include(p => p.Category)
            .Include(p => p.Comments)
                .ThenInclude(c => c.User)
            .ToListAsync();
    }
}
