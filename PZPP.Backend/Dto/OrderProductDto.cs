using Microsoft.EntityFrameworkCore;

namespace PZPP.Backend.Dto
{
    public class OrderProductDto
    {
        public int ProductId { get; set; }

        public required string ProductName { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }

        public decimal PriceTotal { get; set; }
    }
}
