using System.Collections.Generic;
using System.Threading.Tasks;
using ForumApp.Core.Entities;
using ForumApp.Core.Interfaces;
using ForumApp.Services.Interfaces;

namespace ForumApp.Services.Implementations;

public class CategoryService : ICategoryService
{
    private readonly IGenericRepository<Category> _categoryRepository;

    public CategoryService(IGenericRepository<Category> categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
    {
        return await _categoryRepository.ListAllAsync();
    }

    public async Task<Category> CreateCategoryAsync(string name, string description)
    {
        var category = new Category
        {
            Name = name,
            Description = description
        };
        return await _categoryRepository.AddAsync(category);
    }
}
