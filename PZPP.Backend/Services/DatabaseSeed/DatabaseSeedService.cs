using Bogus;
using PZPP.Backend.Database;
using PZPP.Backend.Models;

namespace PZPP.Backend.Services.DatabaseSeed
{
    public class DatabaseSeedService : IDatabaseSeedService
    {
        private readonly ApiContext _context;
        private readonly Faker _faker;
        private readonly Random _random;

        public DatabaseSeedService(ApiContext context)
        {
            _context = context;
            _faker = new Faker("pl");
            _random = new Random();
        }

        public async Task GenerateData()
        {
            int productCount = 25;
            var products = new List<Product>();
            for (int i = 0; i < productCount; i++)
                products.Add(GenerateProduct());

            await _context.AddRangeAsync(products);
            await _context.SaveChangesAsync();
        }

        private Product GenerateProduct()
        {
            return new Product()
            {
                Name = $"{_faker.Commerce.ProductMaterial()} {_faker.Commerce.ProductName()}",
                Description = _faker.Commerce.ProductDescription(),
                ImageUrl = "https://images.placeholders.dev/?width=512&height=512",
                Price = decimal.Round(Convert.ToDecimal(_random.Next(30, 1000) + _random.NextDouble()), 2, MidpointRounding.AwayFromZero)
            };
        }
    }
}
