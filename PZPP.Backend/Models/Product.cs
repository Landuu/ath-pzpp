using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace PZPP.Backend.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(128)]
        public string Name { get; set; }

        [MaxLength(512)]
        public string Description { get; set; }

        [MaxLength(256)]
        public string ImageUrl { get; set; }

        [Precision(10, 2)]
        public decimal Price { get; set; }

        public int Stock { get; set; }
    }
}
