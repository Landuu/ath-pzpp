using PZPP.Backend.Models;

namespace PZPP.Backend.Dto
{
    public class OrderDto
    {
        public int Id { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;

        public int DeliveryOptionId { get; set; }

        public DeliveryOption DeliveryOption { get; set; } = null!;

        public required string Street { get; set; }

        public required string PostCode { get; set; }

        public required string City { get; set; }

        public List<OrderProductDto> Products { get; set; } = new();

        public decimal TotalWithoutDelivery { get; set; }

        public decimal TotalWithDelivery { get; set; }
    }
}
