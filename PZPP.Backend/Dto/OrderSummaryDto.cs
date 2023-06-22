using PZPP.Backend.Models;

namespace PZPP.Backend.Dto
{
    public class OrderSummaryDto
    {
        public List<CartProductDto>? Cart { get; set; }

        public UserInfoDto? UserInfo { get; set; }

        public List<DeliveryOption> DeliveryOptions { get; set; } = new();
    }
}
