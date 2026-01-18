using System.Collections.Generic;
using System.Threading.Tasks;
using ForumApp.Core.Entities;

namespace ForumApp.Core.Interfaces;

public interface IPostRepository : IGenericRepository<Post>
{
    Task<IReadOnlyList<Post>> GetPostsWithDetailsAsync();
}
