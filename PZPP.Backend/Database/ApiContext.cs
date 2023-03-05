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
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(u => u.UserToken)
                .WithOne(t => t.User)
                .HasForeignKey<UserToken>(t =>t.UserId);
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserToken> UserTokens { get; set; }
    }
}
