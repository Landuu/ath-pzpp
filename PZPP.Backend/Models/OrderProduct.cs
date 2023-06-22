using Microsoft.EntityFrameworkCore;

namespace PZPP.Backend.Models
{
    [PrimaryKey(nameof(OrderId), nameof(ProductId))]
    public class OrderProduct
    {
        public int OrderId { get; set; }

        public Order Order { get; set; } = null!;

        public int ProductId { get; set; }

        public Product Product { get; set; } = null!;

        public int Quantity { get; set; }

        [Precision(10, 2)]
        public decimal Price { get; set; }

        [Precision(10, 2)]
        public decimal PriceTotal { get; set; }
    }
}
