using Bogus;
using Microsoft.EntityFrameworkCore;
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
            bool anyDeliveryOptions = await _context.DeliveryOptions.AnyAsync();
            bool anyCategories = await _context.ProductCategories.AnyAsync();
            bool anyProducts = await _context.Products.AnyAsync();

            // Delivery options
            var deliveryOptions = new List<DeliveryOption>()
            {
                new() {Name = "Poczta Polska - paczka pocztowa", Cost = 10.99m},
                new() {Name = "Poczta Polska - paczka pocztowa za pobraniem", Cost = 14.99m},
                new() {Name = "Kurier DPD", Cost = 17.90m},
                new() {Name = "Kurier DPD", Cost = 22.90m}
            };
            if(!anyDeliveryOptions)
                await _context.DeliveryOptions.AddRangeAsync(deliveryOptions);

            // Random categories
            var faker = new Faker("pl");
            var categories = faker.Commerce.Categories(8);
            var productCategories = categories.Select(x => new ProductCategory() { Name = x }).ToList();
            if(!anyCategories && !anyProducts)
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
            if(!anyCategories && !anyProducts)
            {
                for (int i = 0; i < productCount; i++)
                    await _context.Products.AddAsync(product.Generate());
            }

            await _context.SaveChangesAsync();
        }
    }
}
