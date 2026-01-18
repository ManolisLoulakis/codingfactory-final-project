using ForumApp.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ForumApp.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(AppDbContext context)
    {
        await context.Database.MigrateAsync();

        if (await context.Categories.AnyAsync()) return;

        // Categories
        var categories = new List<Category>
        {
            new Category { Name = "General", Description = "General discussions and random topics" },
            new Category { Name = "Technology", Description = "Tech news, gadgets, and innovations" },
            new Category { Name = "Programming", Description = "Coding tips, tutorials, and help" },
            new Category { Name = "Travel", Description = "Travel experiences and recommendations" },
            new Category { Name = "Food", Description = "Recipes, restaurants, and culinary adventures" },
            new Category { Name = "Music", Description = "Artists, albums, and music discussions" },
            new Category { Name = "Movies", Description = "Film reviews and recommendations" },
            new Category { Name = "Sports", Description = "Sports news and discussions" }
        };
        await context.Categories.AddRangeAsync(categories);
        await context.SaveChangesAsync();

        // Users (10 demo accounts)
        var users = new List<User>
        {
            new User { Username = "admin", Email = "admin@myopinion.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"), Role = UserRole.Admin },
            new User { Username = "john_doe", Email = "john@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"), Role = UserRole.User },
            new User { Username = "jane_smith", Email = "jane@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"), Role = UserRole.User },
            new User { Username = "mike_wilson", Email = "mike@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"), Role = UserRole.User },
            new User { Username = "sarah_jones", Email = "sarah@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"), Role = UserRole.User },
            new User { Username = "alex_brown", Email = "alex@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"), Role = UserRole.User },
            new User { Username = "emma_davis", Email = "emma@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"), Role = UserRole.User },
            new User { Username = "chris_miller", Email = "chris@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"), Role = UserRole.User },
            new User { Username = "lisa_taylor", Email = "lisa@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"), Role = UserRole.User },
            new User { Username = "david_clark", Email = "david@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"), Role = UserRole.User }
        };
        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();

        var general = categories[0];
        var tech = categories[1];
        var programming = categories[2];
        var travel = categories[3];
        var food = categories[4];
        var music = categories[5];
        var movies = categories[6];
        var sports = categories[7];

        // Posts with realistic content
        var posts = new List<Post>
        {
            new Post
            {
                Title = "Is AI going to replace programmers?",
                Content = "I've been thinking a lot about the future of programming with AI tools like GitHub Copilot and ChatGPT becoming so advanced. While these tools are incredibly helpful, I believe they're more like powerful assistants than replacements. What do you think? Will AI eventually write all our code, or will human creativity and problem-solving always be essential?",
                UserId = users[1].Id, CategoryId = tech.Id
            },
            new Post
            {
                Title = "Best practices for React in 2026",
                Content = "I've been working with React for 5 years now, and I wanted to share some patterns that have really improved my codebase: 1) Use custom hooks for reusable logic, 2) Implement proper error boundaries, 3) Use React Query or SWR for server state, 4) Keep components small and focused. What are your favorite React patterns?",
                UserId = users[2].Id, CategoryId = programming.Id
            },
            new Post
            {
                Title = "Hidden gems in Greece you must visit",
                Content = "Just came back from an amazing trip to Greece! While Santorini and Mykonos are beautiful, I discovered some incredible hidden spots: Milos island with its unique beaches, the medieval town of Monemvasia, and the stunning Vikos Gorge. These places were less crowded and equally breathtaking. Has anyone else explored off-the-beaten-path destinations in Greece?",
                UserId = users[3].Id, CategoryId = travel.Id
            },
            new Post
            {
                Title = "Homemade pasta changed my life",
                Content = "I always thought making fresh pasta was too difficult until I tried it last weekend. With just flour, eggs, and a rolling pin, I made the most delicious tagliatelle! The texture is completely different from store-bought pasta. It took about an hour but was totally worth it. Who else makes their own pasta at home?",
                UserId = users[4].Id, CategoryId = food.Id
            },
            new Post
            {
                Title = "The evolution of electronic music",
                Content = "From Kraftwerk to deadmau5, electronic music has come such a long way. I love how the genre keeps reinventing itself while honoring its roots. Currently obsessed with the new wave of artists mixing house with organic instruments. What era of electronic music do you think was the most innovative?",
                UserId = users[5].Id, CategoryId = music.Id
            },
            new Post
            {
                Title = "Dune Part 2 exceeded all expectations",
                Content = "Finally watched Dune Part 2 and I'm speechless. Denis Villeneuve has created a masterpiece. The scale, the sound design, the performances - everything was perfect. The sandworm riding scene gave me chills! I think this might be the best sci-fi film of the decade. What did you think of it?",
                UserId = users[6].Id, CategoryId = movies.Id
            },
            new Post
            {
                Title = "Morning workouts vs evening workouts",
                Content = "I've been experimenting with my workout schedule. Morning workouts give me energy for the day but I feel stronger in the evening. Studies suggest both have benefits - morning for consistency, evening for performance. What works better for you and why?",
                UserId = users[7].Id, CategoryId = sports.Id
            },
            new Post
            {
                Title = "Remote work: 3 years later",
                Content = "It's been 3 years since I switched to fully remote work. The good: better work-life balance, no commute, flexibility. The challenging: setting boundaries, loneliness sometimes, home office setup costs. Overall, I couldn't go back to an office. What has your remote work experience been like?",
                UserId = users[8].Id, CategoryId = general.Id
            },
            new Post
            {
                Title = "Learning Rust in 2026 - worth it?",
                Content = "I've been hearing a lot about Rust lately. Memory safety, performance, great tooling. I'm considering learning it as my next language. For those who've made the switch from C++ or Go, was it worth the learning curve? What projects do you recommend for beginners?",
                UserId = users[9].Id, CategoryId = programming.Id
            },
            new Post
            {
                Title = "Best coffee shops around the world",
                Content = "As a coffee enthusiast and traveler, I've visited amazing cafes worldwide. My favorites: Tim Wendelboe (Oslo), Blue Bottle (Tokyo), Cafe de Flore (Paris), and The Barn (Berlin). Each has its unique atmosphere and coffee philosophy. What are your favorite coffee spots?",
                UserId = users[1].Id, CategoryId = travel.Id
            },
            new Post
            {
                Title = "The art of slow cooking",
                Content = "In our fast-paced world, I've rediscovered the joy of slow cooking. There's something magical about a stew that's been simmering for 6 hours. The flavors develop in ways impossible with quick cooking methods. My go-to is a classic beef bourguignon. What's your favorite slow-cooked dish?",
                UserId = users[2].Id, CategoryId = food.Id
            },
            new Post
            {
                Title = "Vinyl comeback - is it just nostalgia?",
                Content = "Vinyl sales keep increasing year after year. Some say it's pure nostalgia, others claim analog sound is genuinely warmer. I started collecting records last year and I'm hooked - not just for the sound but for the ritual of playing an album. Are you team vinyl or team digital?",
                UserId = users[3].Id, CategoryId = music.Id
            }
        };
        await context.Posts.AddRangeAsync(posts);
        await context.SaveChangesAsync();

        // Comments
        var comments = new List<Comment>
        {
            // AI replacing programmers post
            new Comment { Content = "AI is a tool, not a replacement. Someone still needs to understand the business logic and architecture!", PostId = posts[0].Id, UserId = users[2].Id },
            new Comment { Content = "I use Copilot daily and it saves me hours. But I still need to review and understand everything it suggests.", PostId = posts[0].Id, UserId = users[3].Id },
            new Comment { Content = "The best programmers will be those who know how to effectively use AI tools. It's about adaptation!", PostId = posts[0].Id, UserId = users[4].Id },
            new Comment { Content = "I think junior positions might be affected, but senior roles requiring complex decision-making are safe.", PostId = posts[0].Id, UserId = users[5].Id },
            
            // React practices post
            new Comment { Content = "Don't forget about proper TypeScript usage! Type safety has saved me from so many bugs.", PostId = posts[1].Id, UserId = users[1].Id },
            new Comment { Content = "React Server Components are game-changing. Have you tried them with Next.js 14?", PostId = posts[1].Id, UserId = users[6].Id },
            new Comment { Content = "Zustand over Redux any day! So much simpler for most use cases.", PostId = posts[1].Id, UserId = users[7].Id },
            
            // Greece travel post
            new Comment { Content = "Milos is incredible! The lunar landscape of Sarakiniko beach is unforgettable.", PostId = posts[2].Id, UserId = users[5].Id },
            new Comment { Content = "Adding Naxos to your list - amazing local food and beautiful villages!", PostId = posts[2].Id, UserId = users[8].Id },
            new Comment { Content = "Visited Monemvasia last summer. Felt like stepping back in time!", PostId = posts[2].Id, UserId = users[9].Id },
            
            // Homemade pasta post
            new Comment { Content = "Try adding a bit of semolina flour - gives it a better texture!", PostId = posts[3].Id, UserId = users[1].Id },
            new Comment { Content = "Once you go fresh, you never go back. Store-bought pasta tastes like cardboard now 😅", PostId = posts[3].Id, UserId = users[6].Id },
            new Comment { Content = "Invest in a pasta machine - it makes the process so much easier!", PostId = posts[3].Id, UserId = users[2].Id },
            
            // Electronic music post
            new Comment { Content = "The 90s rave scene was peak creativity. Nothing beats that era!", PostId = posts[4].Id, UserId = users[7].Id },
            new Comment { Content = "Check out Bicep - they're doing amazing things blending techno with melodic elements.", PostId = posts[4].Id, UserId = users[8].Id },
            
            // Dune post
            new Comment { Content = "Florence Pugh was incredible as Princess Irulan. Can't wait for Messiah!", PostId = posts[5].Id, UserId = users[1].Id },
            new Comment { Content = "The IMAX experience was worth every penny. That sound design!", PostId = posts[5].Id, UserId = users[3].Id },
            new Comment { Content = "I've read all the books and this adaptation does them justice perfectly.", PostId = posts[5].Id, UserId = users[9].Id },
            
            // Morning vs evening workouts
            new Comment { Content = "Evening for strength training, morning for cardio. Best of both worlds!", PostId = posts[6].Id, UserId = users[2].Id },
            new Comment { Content = "I can only do mornings - if I wait till evening, I always find excuses to skip.", PostId = posts[6].Id, UserId = users[4].Id },
            
            // Remote work post
            new Comment { Content = "Hybrid is my sweet spot. 2 days office for collaboration, 3 days home for deep work.", PostId = posts[7].Id, UserId = users[6].Id },
            new Comment { Content = "Coworking spaces saved my mental health. Remote but not alone.", PostId = posts[7].Id, UserId = users[5].Id },
            new Comment { Content = "The key is having a dedicated workspace. Don't work from your couch!", PostId = posts[7].Id, UserId = users[1].Id },
            
            // Rust post
            new Comment { Content = "Start with 'The Rust Book' and then build a CLI tool. Perfect learning path!", PostId = posts[8].Id, UserId = users[2].Id },
            new Comment { Content = "The borrow checker will frustrate you at first but then it clicks. Worth it!", PostId = posts[8].Id, UserId = users[3].Id },
            
            // Coffee post
            new Comment { Content = "Stumptown in Portland is incredible too! Add it to your list for next time.", PostId = posts[9].Id, UserId = users[4].Id },
            new Comment { Content = "Cafe culture varies so much by country. Love how each place approaches coffee differently.", PostId = posts[9].Id, UserId = users[7].Id },
            
            // Slow cooking post
            new Comment { Content = "A good Dutch oven is worth its weight in gold for slow cooking!", PostId = posts[10].Id, UserId = users[8].Id },
            new Comment { Content = "Try osso buco next - the marrow is incredible after slow cooking.", PostId = posts[10].Id, UserId = users[9].Id },
            
            // Vinyl post
            new Comment { Content = "It's the full experience for me - artwork, liner notes, the ritual. Digital can't match that.", PostId = posts[11].Id, UserId = users[1].Id },
            new Comment { Content = "I do both - vinyl for albums I love, streaming for discovery.", PostId = posts[11].Id, UserId = users[5].Id },
            new Comment { Content = "Started collecting last year too. My wallet hates me but my ears are happy!", PostId = posts[11].Id, UserId = users[6].Id }
        };
        await context.Comments.AddRangeAsync(comments);
        await context.SaveChangesAsync();
    }
}
