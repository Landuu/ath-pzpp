using AutoMapper;
using PZPP.Backend.Dto;
using PZPP.Backend.Dto.Auth;
using PZPP.Backend.Dto.User;
using PZPP.Backend.Models;

namespace PZPP.Backend.MappingProfiles
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<User, UserContextDto>()
                .ForMember(dest => dest.UID, x => x.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name, x => x.MapFrom(src => src.UserInfo.FirstName + " " + src.UserInfo.LastName))
                .ForMember(dest => dest.IsAdmin, x => x.MapFrom(src => src.Login == "admin"));

            CreateMap<UserInfo, UserAccountDto>()
                .ForMember(dest => dest.Name, x => x.MapFrom(src => src.FirstName + " " + src.LastName));

            CreateMap<Product, CartProductDto>();
            CreateMap<UserInfo, UserInfoDto>();

            CreateMap<OrderProduct, OrderProductDto>()
                .ForMember(dest => dest.ProductName, x => x.MapFrom(src => src.Product.Name));

            CreateMap<Order, OrderDto>()
                .ForMember(dest => dest.TotalWithoutDelivery, x => x.MapFrom(src => CalculateOrderTotalWithoutDelivery(src)))
                .ForMember(dest => dest.TotalWithDelivery, x => x.MapFrom(src => CalculateOrderTotalWithDelivery(src)));


        }

        private static decimal CalculateOrderTotalWithoutDelivery(Order order)
        {
            return order.Products.Select(x => x.PriceTotal).Sum();
        }

        private static decimal CalculateOrderTotalWithDelivery(Order order)
        {
            return CalculateOrderTotalWithoutDelivery(order) + order.DeliveryOption.Cost;
        }
    }
}
