using System.Collections.Generic;
using System.Threading.Tasks;
using ForumApp.Core.Entities;

namespace ForumApp.Services.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<Category>> GetAllCategoriesAsync();
    Task<Category> CreateCategoryAsync(string name, string description);
}
