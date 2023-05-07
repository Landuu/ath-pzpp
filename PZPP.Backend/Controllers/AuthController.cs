using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PZPP.Backend.Database;
using PZPP.Backend.Dto.Auth;
using PZPP.Backend.Models;
using PZPP.Backend.Services.Auth;
using PZPP.Backend.Utils.Auth;

namespace PZPP.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApiContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;

        public AuthController(ApiContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }

        [HttpPost]
        public async Task<IResult> PostLogin([FromBody] LoginDto dto)
        {
            User? user = _context.Users.FirstOrDefault(x => x.Login == dto.Login);
            if (user == null) return Results.BadRequest();

            bool isPasswordValid = _authService.ValidatePassword(user, dto.Password);
            if (!isPasswordValid) return Results.BadRequest();

            var tokenPair = _authService.GenerateTokens(user);
            user.RefreshToken = tokenPair.Refresh;
            _authService.AddTokenCookies(Response, tokenPair);
            await _context.SaveChangesAsync();
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
            _authService.AddTokenCookies(Response, tokenPair);
            await _context.SaveChangesAsync();
            return Results.Ok();
        }

        [HttpGet("refresh")]
        public async Task<IResult> GetRefresh()
        {
            string? refreshToken = Request.Cookies[_authService.JWTSettings.CookieKeyRefresh];
            if (refreshToken == null) return Results.Unauthorized();

            // Validate provided token
            bool isRefreshTokenValid = await _authService.ValidateToken(refreshToken);
            if (!isRefreshTokenValid)
                return _authService.GetDeleteCookiesResponse(Response);

            int userId = _authService.GetUserIdFromToken(refreshToken);
            User? user = _context.Users.FirstOrDefault(x => x.Id == userId);
            if (user == null || user.RefreshToken == null || user.RefreshToken != refreshToken)
                return _authService.GetDeleteCookiesResponse(Response);

            string token = _authService.GenerateAccessToken(user);
            _authService.AddAccessTokenCookie(Response, token);
            return Results.Ok();
        }


        [Authorize(Policy = "UserContext")]
        [HttpGet("user")]
        public async Task<IResult> GetUserContext()
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
            _authService.DeleteTokenCookies(Response);
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
