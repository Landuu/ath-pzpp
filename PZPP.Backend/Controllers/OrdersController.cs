using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PZPP.Backend.Database;
using PZPP.Backend.Dto;
using PZPP.Backend.Models;
using PZPP.Backend.Utils.Auth;
using System.Text;
using System.Text.Json;

namespace PZPP.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApiContext _context;
        private readonly IMapper _mapper;

        public OrdersController(ApiContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("cart")]
        public async Task<IResult> GetCart([FromQuery] string cart)
        {
            var cartData = await ParseBase64Cart(cart);
            if (cartData == null) return Results.BadRequest();
            return Results.Json(cartData);
        }

        [Authorize]
        [HttpGet("summary")]
        public async Task<IResult> GetSummary([FromQuery] string cart)
        {
            var user = await _context.Users
                .Include(x => x.UserInfo)
                .FirstOrDefaultAsync(x => x.Id == User.GetUID());
            if(user == null) return Results.BadRequest();

            var dto = new OrderSummaryDto()
            {
                Cart = await ParseBase64Cart(cart),
                UserInfo = user.UserInfo != null ? _mapper.Map<UserInfoDto>(user.UserInfo) : null,
                DeliveryOptions = await _context.DeliveryOptions.ToListAsync()
            };
            return Results.Json(dto);
        }

        [Authorize]
        [HttpPost("summary")]
        public async Task<IResult> PostSummary([FromBody] PostSummaryDto dto)
        {
            var user = await _context.Users
                .Include(x => x.UserInfo)
                .FirstOrDefaultAsync(x => x.Id == User.GetUID());
            var products = await ParseBase64Cart(dto.Cart);
            if (user == null || user.UserInfo == null || products == null) return Results.BadRequest();
            if (user.UserInfo.Street == null || user.UserInfo.PostCode == null || user.UserInfo.City == null) return Results.BadRequest();

            var orderProducts = new List<OrderProduct>();
            foreach (var p in products)
            {
                var databaseProduct = await _context.Products.FindAsync(p.Id);
                if (databaseProduct == null) 
                    continue;
                if (p.Quantity > databaseProduct.Stock) 
                    return Results.BadRequest("Stock");
                databaseProduct.Stock -= p.Quantity;
                orderProducts.Add(new OrderProduct()
                {
                    ProductId = p.Id,
                    Quantity = p.Quantity,
                    Price = p.PriceBrutto,
                    PriceTotal = p.Quantity * p.PriceBrutto
                });
            }

            var order = new Order()
            {
                UserId = user.Id,
                Street = user.UserInfo.Street,
                PostCode = user.UserInfo.PostCode,
                City = user.UserInfo.City,
                DeliveryOptionId = dto.DeliveryOptionId,
                Products = orderProducts
            };

            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
            return Results.Ok(order.Id);
        }

        private async Task<List<CartProductDto>?> ParseBase64Cart(string cart)
        {
            var bytes = Convert.FromBase64String(cart);
            string jsonString = Encoding.ASCII.GetString(bytes);
            var cartData = JsonSerializer.Deserialize<List<CartBase64Dto>>(jsonString);
            if(cartData == null) return null;
            if (!cartData.Any()) return new();

            var productIds = cartData.Select(x => x.Id).ToList();
            var products = await _context.Products
                .Where(x => productIds.Contains(x.Id))
                .ToListAsync();

            var dto = new List<CartProductDto>();
            foreach (var product in products)
            {
                var productData = cartData.FirstOrDefault(x => x.Id == product.Id);
                if (productData == null) continue;
                var map = _mapper.Map<CartProductDto>(product);
                map.Quantity = productData.Q;
                dto.Add(map);
            }
            return dto;
        }
    }
}
