using System.ComponentModel.DataAnnotations;

namespace PZPP.Backend.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        public User User { get; set; } = null!;

        public DateTime OrderDate { get; set; } = DateTime.Now;

        public int DeliveryOptionId { get; set; }

        public DeliveryOption DeliveryOption { get; set; } = null!;

        public required string Street { get; set; }

        public required string PostCode { get; set; }

        public required string City { get; set; }

        public List<OrderProduct> Products { get; set; } = new();
    }
}
