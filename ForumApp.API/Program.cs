using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Database
builder.Services.AddDbContext<ForumApp.Infrastructure.Data.AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories
builder.Services.AddScoped(typeof(ForumApp.Core.Interfaces.IGenericRepository<>), typeof(ForumApp.Infrastructure.Repositories.GenericRepository<>));
builder.Services.AddScoped<ForumApp.Core.Interfaces.IUserRepository, ForumApp.Infrastructure.Repositories.UserRepository>();
builder.Services.AddScoped<ForumApp.Core.Interfaces.IPostRepository, ForumApp.Infrastructure.Repositories.PostRepository>();

// Services
builder.Services.AddScoped<ForumApp.Services.Interfaces.IAuthService, ForumApp.Services.Implementations.AuthService>();
builder.Services.AddScoped<ForumApp.Services.Interfaces.IPostService, ForumApp.Services.Implementations.PostService>();
builder.Services.AddScoped<ForumApp.Services.Interfaces.ICategoryService, ForumApp.Services.Implementations.CategoryService>();

// Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "ForumApp",
        ValidAudience = "ForumApp",
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("super_secret_key_12345678901234567890"))
    };
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder.WithOrigins("http://localhost:5173")
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ForumApp.Infrastructure.Data.AppDbContext>();
        await ForumApp.Infrastructure.Data.DbInitializer.InitializeAsync(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

app.Run();
