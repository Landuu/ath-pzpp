using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using PZPP.Backend.Database;
using PZPP.Backend.Dto.Auth;
using PZPP.Backend.Models;
using PZPP.Backend.Services.Auth;
using PZPP.Backend.Utils.Auth;
using PZPP.Backend.Utils.JWT;
using PZPP.Backend.Utils.Results;

namespace PZPP.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApiContext _context;
        private readonly IMapper _mapper;
        // private readonly JWTSettings _jwtSettings;
        private readonly JWTHelper _jwtHelper;
        private readonly IAuthService _authService;

        public AuthController(ApiContext context, IOptions<JWTSettings> jwtSettings, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;

            // _jwtSettings = jwtSettings.Value;
            _jwtHelper = new(jwtSettings.Value);
            _authService = authService;
        }

        [HttpPost]
        public async Task<IResult> GetToken([FromBody] LoginDto dto)
        {
            User? user = _context.Users.FirstOrDefault(x => x.Login == dto.Login);
            if (user == null) return Results.BadRequest();

            bool isPasswordValid = _authService.ValidatePassword(user, dto.Password);
            if (!isPasswordValid) return Results.BadRequest();

            var tokenPair = _authService.GenerateTokens(user);
            user.RefreshToken = tokenPair.Refresh;
            Response.Cookies.Append(_authService.CookieKeyAccess, tokenPair.Access, _authService.CookieOptions);
            Response.Cookies.Append(_authService.CookieKeyRefresh, tokenPair.Refresh, _authService.CookieOptions);
            await _context.SaveChangesAsync();
            return Results.Ok();
        }


        [HttpGet("refresh")]
        public async Task<IResult> GetRefresh()
        {
            string? refreshToken = Request.Cookies[_authService.CookieKeyRefresh];
            if (refreshToken == null) return Results.Unauthorized();

            // Validate provided token
            bool isRefreshTokenValid = await _authService.ValidateRefreshToken(refreshToken);
            if (!isRefreshTokenValid)
                return Results.Extensions.UnauthorizedDeleteCookie(_authService.CookieKeyRefresh, _authService.CookieKeyAccess);

            int userId = _authService.GetUserIdFromToken(refreshToken);
            User? user = _context.Users.FirstOrDefault(x => x.Id == userId);
            if (user == null || user.RefreshToken == null || user.RefreshToken != refreshToken)
                return Results.Extensions.UnauthorizedDeleteCookie(_authService.CookieKeyRefresh, _authService.CookieKeyAccess);

            string token = _authService.GenerateRefreshToken(user);
            Response.Cookies.Append(_authService.CookieKeyAccess, token, _authService.CookieOptions);
            return Results.Ok();
        }

        [HttpPost("register")]
        public async Task<IResult> PostRegister([FromBody] RegisterDto dto)
        {
            bool isUser = await _context.Users.AnyAsync(x => x.Login == dto.Login);
            if (isUser) return Results.BadRequest();

            DateTime now = DateTime.Now;
            User user = new()
            {
                Login = dto.Login,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                RegisterDate = now,
                LastLogin = now
            };
            UserInfo userInfo = new()
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName
            };
            user.UserInfo = userInfo;
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            var tokenPair = _authService.GenerateTokens(user);
            user.RefreshToken = tokenPair.Refresh;
            Response.Cookies.Append(_authService.CookieKeyAccess, tokenPair.Access, _authService.CookieOptions);
            Response.Cookies.Append(_authService.CookieKeyRefresh, tokenPair.Refresh, _authService.CookieOptions);
            await _context.SaveChangesAsync();
            return Results.Ok();
        }

        [Authorize]
        [HttpGet("user")]
        public async Task<IResult> GetUser()
        {
            int userId = User.GetUID();
            User? user = await _context.Users
                .Include(x => x.UserInfo)
                .FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null) return Results.BadRequest();
            UserContextDto dto = _mapper.Map<UserContextDto>(user);
            return Results.Json(dto);
        }

        [HttpGet("logout")]
        public IResult Logout()
        {
            Response.Cookies.Delete(_authService.CookieKeyAccess);
            Response.Cookies.Delete(_authService.CookieKeyRefresh);
            return Results.Ok();
        }

        [HttpGet("availableLogin")]
        public async Task<IResult> GetIsLoginAvailable([FromQuery] string? login)
        {
            if (login == null) return Results.BadRequest();
            bool isUser = await _context.Users.AnyAsync(x => x.Login == login.ToLower());
            return Results.Ok(!isUser);
        }

    }
}
