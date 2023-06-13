using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PZPP.Backend.Database;
using PZPP.Backend.Dto;
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
            var bytes = Convert.FromBase64String(cart);
            string jsonString = Encoding.ASCII.GetString(bytes);
            var cardData = JsonSerializer.Deserialize<List<CartBase64Dto>>(jsonString);
            if (cardData == null) return Results.BadRequest();

            var dto = new List<CartProductDto>();
            if (!cardData.Any()) return Results.Json(dto);

            var productIds = cardData.Select(x => x.Id).ToList();
            var products = await _context.Products
                .Where(x => productIds.Contains(x.Id))
                .ToListAsync();
            
            foreach (var product in products)
            {
                var productData = cardData.FirstOrDefault(x => x.Id == product.Id);
                if(productData == null) continue;
                var map = _mapper.Map<CartProductDto>(product);
                map.Quantity = productData.Q;
                dto.Add(map);
            }
            return Results.Json(dto);
        }
    }
}
