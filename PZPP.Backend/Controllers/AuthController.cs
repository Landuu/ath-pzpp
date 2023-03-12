using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PZPP.Backend.Database;
using PZPP.Backend.Dto.Auth;
using PZPP.Backend.Models;
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
        private readonly CookieOptions _cookieOptions;

        public AuthController(ApiContext context, IConfiguration configuration, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _cookieOptions = new() { HttpOnly = true };

            var jwtSettings = configuration.GetSection("JWT").Get<JWTSettings>();
            if (jwtSettings == null) throw new ArgumentNullException(nameof(jwtSettings));
            _jwtSettings = jwtSettings;
            _jwtHelper = new(jwtSettings);
        }

        [HttpPost]
        public async Task<IResult> GetToken([FromBody] LoginDto dto)
        {
            dto.Login = dto.Login.ToLower();
            User? user = _context.Users.Include(x => x.UserToken).FirstOrDefault(x => x.Login == dto.Login);
            if (user == null) return Results.BadRequest();

            //TODO: Add password hashing
            if (user.PasswordHash != dto.Password) return Results.BadRequest();

            var claims = CreateClaims(user);
            var refreshClaims = CreateRefreshClaims(user);
            string token = GenerateToken(claims, DateTime.Now.AddDays(_jwtSettings.TokenExpireDays));
            string refreshToken = GenerateToken(refreshClaims, DateTime.Now.AddDays(_jwtSettings.RefreshExpireDays));

            user.UserToken = new() { RefreshToken = refreshToken };
            await _context.SaveChangesAsync();

            Response.Cookies.Append(_jwtSettings.CookieKey, token, _cookieOptions);
            Response.Cookies.Append(_jwtSettings.RefreshCookieKey, refreshToken, _cookieOptions);
            return Results.Ok();
        }


        [HttpGet("refresh")]
        public async Task<IResult> GetRefresh()
        {
            string? refreshToken = Request.Cookies[_jwtSettings.RefreshCookieKey];
            if (refreshToken == null) return Results.Unauthorized();
            var tokenHandler = new JwtSecurityTokenHandler();

            // Validate provided token
            TokenValidationResult validationResult = await tokenHandler.ValidateTokenAsync(refreshToken, _jwtHelper.GetValidationParameters());
            if (!validationResult.IsValid)
                return Results.Extensions.UnauthorizedDeleteCookie(_jwtSettings.RefreshCookieKey, _jwtSettings.CookieKey);

            // Extract info from token
            var tokenObject = tokenHandler.ReadJwtToken(refreshToken);
            int uid = Convert.ToInt32(tokenObject.Claims.FirstOrDefault(x => x.Type == ClaimKeys.UID)?.Value);
            User? user = _context.Users.Include(x => x.UserToken).FirstOrDefault(x => x.Id == uid);

            // Forbid if no user or token changed
            if (user == null || user.UserToken == null || user.UserToken.RefreshToken != refreshToken)
                return Results.Extensions.UnauthorizedDeleteCookie(_jwtSettings.RefreshCookieKey, _jwtSettings.CookieKey);

            var claims = CreateClaims(user);
            string token = GenerateToken(claims, DateTime.Now.AddDays(_jwtSettings.TokenExpireDays));
            Response.Cookies.Append(_jwtSettings.CookieKey, token, _cookieOptions);
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
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Login = dto.Login,
                PasswordHash = dto.Password,
                RegisterDate = now,
                LastLogin = now
            };
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            var claims = CreateClaims(user);
            var refreshClaims = CreateRefreshClaims(user);
            string token = GenerateToken(claims, DateTime.Now.AddDays(_jwtSettings.TokenExpireDays));
            string refreshToken = GenerateToken(refreshClaims, DateTime.Now.AddDays(_jwtSettings.RefreshExpireDays));
            user.UserToken = new() { RefreshToken = refreshToken };

            await _context.SaveChangesAsync();
            Response.Cookies.Append(_jwtSettings.CookieKey, token, _cookieOptions);
            Response.Cookies.Append(_jwtSettings.RefreshCookieKey, refreshToken, _cookieOptions);
            return Results.Ok();
        }

        [Authorize]
        [HttpGet("user")]
        public async Task<IResult> GetUser()
        {
            string? uid = User.FindFirstValue(ClaimKeys.UID);
            User? user = await _context.Users.FindAsync(Convert.ToInt32(uid));
            UserContextDto dto = _mapper.Map<UserContextDto>(user);
            if (user == null) return Results.BadRequest();
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
