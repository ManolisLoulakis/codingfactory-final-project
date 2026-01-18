using System.Threading.Tasks;
using ForumApp.Services.DTOs;

namespace ForumApp.Services.Interfaces;

public interface IAuthService
{
    Task<string> RegisterAsync(UserRegisterDto dto);
    Task<string> LoginAsync(UserLoginDto dto);
    Task PromoteToAdminAsync(string email);
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
    Task DeleteUserAsync(int userId);
    Task MuteUserAsync(int userId, int durationMinutes);
    Task UnmuteUserAsync(int userId);
    Task BanUserAsync(int userId, int durationMinutes);
    Task UnbanUserAsync(int userId);
}
