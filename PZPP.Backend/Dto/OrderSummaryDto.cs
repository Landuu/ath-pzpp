namespace PZPP.Backend.Dto
{
    public class OrderSummaryDto
    {
        public List<CartProductDto>? Cart { get; set; }

        public UserInfoDto? UserInfo { get; set; }
    }
}
