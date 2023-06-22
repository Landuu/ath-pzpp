using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace PZPP.Backend.Models
{
    public class DeliveryOption
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(64)]
        public required string Name { get; set; }

        [Precision(10, 2)]
        public required decimal Cost { get; set; }

        public string DisplayName => $"{Name} (+{Cost}zł)";
    }
}
