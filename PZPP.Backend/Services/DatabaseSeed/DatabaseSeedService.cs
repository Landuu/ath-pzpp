using Bogus;
using Bogus.DataSets;
using PZPP.Backend.Database;
using PZPP.Backend.Models;
using System.Runtime.InteropServices;

namespace PZPP.Backend.Services.DatabaseSeed
{
    public class DatabaseSeedService : IDatabaseSeedService
    {
        private readonly ApiContext _context;

        public DatabaseSeedService(ApiContext context)
        {
            _context = context;
        }

        public async Task GenerateData()
        {
            // Random categories
            var faker = new Faker("pl");
            var categories = faker.Commerce.Categories(8);
            var productCategories = categories.Select(x => new ProductCategory() { Name = x }).ToList();
            await _context.ProductCategories.AddRangeAsync(productCategories);

            // Random products
            var product = new Faker<Product>("pl")
                    .RuleFor(p => p.Name, f => $"{f.Commerce.ProductAdjective()} {f.Commerce.ProductName()}")
                    .RuleFor(p => p.Description, f => f.Commerce.ProductDescription())
                    .RuleFor(p => p.ImageUrl, f => f.Image.LoremFlickrUrl(keywords: "computer, phone, laptop, keyboard, headphones"))
                    .RuleFor(p => p.PriceNetto, f => Convert.ToDecimal(f.Commerce.Price()))
                    .RuleFor(p => p.PriceBrutto, (f, data) => data.PriceNetto * 1.23m)
                    .RuleFor(p => p.Stock, f => f.Random.Number(2, 20))
                    .RuleFor(p => p.ProductCategory, f => f.PickRandom(productCategories));
                    
            int productCount = 50;
            for (int i = 0; i < productCount; i++)
                await _context.Products.AddAsync(product.Generate());

            await _context.SaveChangesAsync();
        }
    }
}
