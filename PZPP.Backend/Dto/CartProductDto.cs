namespace PZPP.Backend.Dto
{
    public class CartProductDto
    {
        public required int Id { get; set; }

        public required int Quantity { get; set; }

        public required int Stock { get; set; }

        public required string Name { get; set; }

        public required decimal PriceNetto { get; set; }

        public required decimal PriceBrutto { get; set; }

        public required string ImageUrl { get; set; }
    }
}
