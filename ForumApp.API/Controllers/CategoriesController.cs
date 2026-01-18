using System.Threading.Tasks;
using ForumApp.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ForumApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _categoryService.GetAllCategoriesAsync();
        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request)
    {
        var category = await _categoryService.CreateCategoryAsync(request.Name, request.Description);
        return Ok(category);
    }
}

public class CreateCategoryRequest
{
    public required string Name { get; set; }
    public required string Description { get; set; }
}
