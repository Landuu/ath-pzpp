using Microsoft.EntityFrameworkCore;
using PZPP.Backend.Models;

namespace PZPP.Backend.Database
{
    public class ApiContext : DbContext
    {
        protected readonly IConfiguration _configuration;

        public ApiContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlServer(_configuration.GetConnectionString("Database"));
        }

        public DbSet<User> Users { get; set; }
    }
}
