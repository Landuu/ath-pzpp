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
                .HasOne(u => u.UserInfo)
                .WithOne(i => i.User)
                .HasForeignKey<UserInfo>(i => i.UserId);
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserInfo> UserInfo { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<DeliveryOption> DeliveryOptions { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderProduct> OrderProducts { get; set; }


    }
}
