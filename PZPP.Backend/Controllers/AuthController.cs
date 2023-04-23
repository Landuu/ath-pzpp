using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using PZPP.Backend.Database;
using PZPP.Backend.Dto.Auth;
using PZPP.Backend.Models;
using PZPP.Backend.Services.Auth;
using PZPP.Backend.Utils;
using PZPP.Backend.Utils.Results;
using PZPP.Backend.Utils.Settings;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace PZPP.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApiContext _context;
        private readonly IMapper _mapper;
        private readonly JWTSettings _jwtSettings;
        private readonly JWTHelper _jwtHelper;
        private readonly IAuthService _authService;

        public AuthController(ApiContext context, IOptions<JWTSettings> jwtSettings, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;

            _jwtSettings = jwtSettings.Value;
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
            Response.Cookies.Append(_jwtSettings.CookieKey, tokenPair.Access, _authService.CookieOptions);
            Response.Cookies.Append(_jwtSettings.RefreshCookieKey, tokenPair.Refresh, _authService.CookieOptions);
            await _context.SaveChangesAsync();
            return Results.Ok();
        }


        [HttpGet("refresh")]
        public async Task<IResult> GetRefresh()
        {
            string? refreshToken = Request.Cookies[_jwtSettings.RefreshCookieKey];
            if (refreshToken == null) return Results.Unauthorized();

            // Validate provided token
            bool isRefreshTokenValid = await _authService.ValidateRefreshToken(refreshToken);
            if (!isRefreshTokenValid)
                return Results.Extensions.UnauthorizedDeleteCookie(_jwtSettings.RefreshCookieKey, _jwtSettings.CookieKey);

            // Extract info from token
            int userId = _authService.GetUserIdFromToken(refreshToken);
            User? user = _context.Users.FirstOrDefault(x => x.Id == userId);

            // Forbid if no user or token changed
            if (user == null || user.RefreshToken == null || user.RefreshToken != refreshToken)
                return Results.Extensions.UnauthorizedDeleteCookie(_jwtSettings.RefreshCookieKey, _jwtSettings.CookieKey);

            string token = _authService.GenerateRefreshToken(user);
            Response.Cookies.Append(_jwtSettings.CookieKey, token, _authService.CookieOptions);
            return Results.Ok();
        }

        [HttpPost("register")]
        public async Task<IResult> PostRegister([FromBody] RegisterDto dto)
        {
            dto.Login = dto.Login.ToLower();
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

            var claims = CreateClaims(user);
            var refreshClaims = CreateRefreshClaims(user);
            string token = GenerateToken(claims, DateTime.Now.AddDays(_jwtSettings.TokenExpireDays));
            string refreshToken = GenerateToken(refreshClaims, DateTime.Now.AddDays(_jwtSettings.RefreshExpireDays));
            user.RefreshToken = refreshToken;

            await _context.SaveChangesAsync();
            Response.Cookies.Append(_jwtSettings.CookieKey, token, _authService.CookieOptions);
            Response.Cookies.Append(_jwtSettings.RefreshCookieKey, refreshToken, _authService.CookieOptions);
            return Results.Ok();
        }

        [Authorize]
        [HttpGet("user")]
        public async Task<IResult> GetUser()
        {
            string? uid = User.FindFirstValue(ClaimKeys.UID);
            int userId = Convert.ToInt32(uid);
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
            Response.Cookies.Delete(_jwtSettings.CookieKey);
            Response.Cookies.Delete(_jwtSettings.RefreshCookieKey);
            return Results.Ok();
        }

        [HttpGet("availableLogin")]
        public async Task<IResult> GetIsLoginAvailable([FromQuery] string? login)
        {
            if (login == null) return Results.BadRequest();
            bool isUser = await _context.Users.AnyAsync(x => x.Login == login.ToLower());
            return Results.Ok(!isUser);
        }



        // Private
        private static Claim[] CreateClaims(User user)
        {
            return new Claim[]
            {
                new(ClaimKeys.Login, user.Login.ToLower()),
                new(ClaimKeys.UID, user.Id.ToString()),
                new(ClaimTypes.Role, "User")
            };
        }

        private static Claim[] CreateRefreshClaims(User user)
        {
            return new Claim[]
            {
                new(ClaimKeys.UID, user.Id.ToString())
            };
        }

        private string GenerateToken(Claim[] claims, DateTime expire)
        {
            var tokenDescriptor = _jwtHelper.GetTokenDescriptor(claims, expire);
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
