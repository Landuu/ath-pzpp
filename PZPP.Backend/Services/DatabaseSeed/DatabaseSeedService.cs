using Bogus;
using Bogus.DataSets;
using PZPP.Backend.Database;
using PZPP.Backend.Models;

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
            var product = new Faker<Product>("pl")
                    .RuleFor(p => p.Name, f => $"{f.Commerce.ProductAdjective()} {f.Commerce.ProductName()}")
                    .RuleFor(p => p.Description, f => f.Commerce.ProductDescription())
                    .RuleFor(p => p.ImageUrl, f => f.Image.LoremFlickrUrl(keywords: "computer, phone, laptop, tool, powertool, switch"))
                    .RuleFor(p => p.Price, f => Convert.ToDecimal(f.Commerce.Price()))
                    .RuleFor(p => p.Stock, f => f.Random.Number(2, 20));

            int productCount = 50;
            for (int i = 0; i < productCount; i++)
                await _context.Products.AddAsync(product.Generate());

            await _context.SaveChangesAsync();
        }
    }
}
