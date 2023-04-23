using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PZPP.Backend.Database;
using PZPP.Backend.Dto.User;
using PZPP.Backend.Models;
using PZPP.Backend.Utils.Auth;

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
            if (user == null) return Results.Forbid();

            user.UserInfo.Street = dto.Street;
            user.UserInfo.PostCode = dto.PostCode;
            user.UserInfo.City = dto.City;
            await _context.SaveChangesAsync();

            return Results.Ok();
        }
    }
}
