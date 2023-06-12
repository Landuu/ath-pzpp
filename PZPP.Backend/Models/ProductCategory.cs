using System.ComponentModel.DataAnnotations;

namespace PZPP.Backend.Models
{
    public class ProductCategory
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(64)]
        public required string Name { get; set; }
    }
}
