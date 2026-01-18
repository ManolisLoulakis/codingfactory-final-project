using System.Threading.Tasks;
using ForumApp.Core.Entities;

namespace ForumApp.Core.Interfaces;

public interface IUserRepository : IGenericRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByUsernameAsync(string username);
}
