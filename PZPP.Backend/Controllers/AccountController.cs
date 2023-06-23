using AutoMapper;
using DevExtreme.AspNet.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PZPP.Backend.Database;
using PZPP.Backend.Dto;
using PZPP.Backend.Dto.User;
using PZPP.Backend.Models;
using PZPP.Backend.Utils.Auth;
using PZPP.Backend.Utils.Devextreme;

namespace PZPP.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ApiContext _context;
        private readonly IMapper _mapper;

        public AccountController(ApiContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IResult> GetAccountInfo()
        {
            int uid = User.GetUID();
            User? user = await _context.Users.Include(x => x.UserInfo).FirstOrDefaultAsync(x => x.Id == uid);
            if (user == null) return Results.Forbid();

            UserAccountDto dto = _mapper.Map<UserAccountDto>(user.UserInfo);
            return Results.Json(dto);
        }

        [HttpPut]
        public async Task<IResult> PutAccountInfo([FromForm] PutAccountInfoDto dto)
        {
            int uid = User.GetUID();
            User? user = await _context.Users.Include(x => x.UserInfo).FirstOrDefaultAsync(x => x.Id == uid);
            if (user == null) return Results.Forbid();

            user.UserInfo.FirstName = dto.FirstName;
            user.UserInfo.LastName = dto.LastName;
            user.UserInfo.Email = dto.Email;
            user.UserInfo.Phone = dto.Phone;
            await _context.SaveChangesAsync();

            return Results.Ok();
        }

        [HttpPut("address")]
        public async Task<IResult> PutAccountAddress([FromForm] PutAccountAddressDto dto)
        {
            int uid = User.GetUID();
            User? user = await _context.Users.Include(x => x.UserInfo).FirstOrDefaultAsync(x => x.Id == uid);
            if (user == null || user.UserInfo == null) return Results.Forbid();

            user.UserInfo.Street = dto.Street;
            user.UserInfo.PostCode = dto.PostCode;
            user.UserInfo.City = dto.City;
            await _context.SaveChangesAsync();

            return Results.Ok();
        }

        [HttpGet("orders")]
        public async Task<IResult> GetAccountOrders(DataSourceLoadOptions loadOptions)
        {
            var orders = await _context.Orders
                .Include(x => x.Products)
                    .ThenInclude(x => x.Product)
                .Include(x => x.DeliveryOption)
                .Where(x => x.UserId == User.GetUID())
                .OrderByDescending(x => x.Id)
                .ToListAsync();
            var dto = _mapper.Map<List<OrderDto>>(orders);
            var loadResult = DataSourceLoader.Load(dto, loadOptions);
            return Results.Json(loadResult);
        }

        [HttpGet("orders/{orderId}")]
        public async Task<IResult> GetAccountOrder([FromRoute] int orderId)
        {
            var order = await _context.Orders
                .Include(x => x.Products)
                    .ThenInclude(x => x.Product)
                .Include(x => x.DeliveryOption)
                .Where(x => x.UserId == User.GetUID())
                .FirstOrDefaultAsync(x => x.Id == orderId);
            if (order == null) return Results.BadRequest();
            var dto = _mapper.Map<OrderDto>(order);
            return Results.Json(dto);
        }
    }
}
