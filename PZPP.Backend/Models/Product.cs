using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace PZPP.Backend.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(128)]
        public required string Name { get; set; }

        [MaxLength(512)]
        public required string Description { get; set; }

        [MaxLength(256)]
        public required string ImageUrl { get; set; }

        [Precision(10, 2)]
        public decimal PriceNetto { get; set; }

        [Precision(10, 2)]
        public decimal PriceBrutto { get; set; }

        public int Stock { get; set; }

        public int ProductCategoryId { get; set; }

        public ProductCategory ProductCategory { get; set; } = null!;
    }
}
