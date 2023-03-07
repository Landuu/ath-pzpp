using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PZPP.Backend.Database;
using PZPP.Backend.Models;
using PZPP.Backend.Utils;
using PZPP.Backend.Utils.Settings;
using PZPP.Backend.Utils.Results;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PZPP.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApiContext _context;
        private readonly JWTSettings _jwtSettings;
        private readonly JWTHelper _jwtHelper;
        private readonly CookieOptions _cookieOptions;

        public AuthController(ApiContext context, IConfiguration configuration)
        {
            _context = context;
            _cookieOptions = new() { HttpOnly = true };

            var jwtSettings = configuration.GetSection("JWT").Get<JWTSettings>();
            if (jwtSettings == null) throw new ArgumentNullException(nameof(jwtSettings));
            _jwtSettings = jwtSettings;
            _jwtHelper = new(jwtSettings);
        }

        [HttpGet]
        public async Task<IResult> GetToken()
        {
            User? user = _context.Users.Include(x => x.UserToken).FirstOrDefault();
            if (user == null) return Results.BadRequest();

            var claims = CreateClaims(user);
            var refreshClaims = CreateRefreshClaims(user);
            // string token = GenerateToken(claims, DateTime.Now.AddDays(_jwtSettings.TokenExpireDays));
            string token = GenerateToken(claims, DateTime.Now.AddSeconds(10));
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
            if(!validationResult.IsValid)
                return Results.Extensions.UnauthorizedDeleteCookie(_jwtSettings.RefreshCookieKey, _jwtSettings.CookieKey);

            // Extract info from token
            var tokenObject = tokenHandler.ReadJwtToken(refreshToken);
            int uid = Convert.ToInt32(tokenObject.Claims.FirstOrDefault(x => x.Type == ClaimKeys.UID)?.Value);
            User? user = _context.Users.Include(x => x.UserToken).FirstOrDefault(x => x.Id == uid);

            // Forbid if no user or token changed
            if (user == null || user.UserToken == null || user.UserToken.RefreshToken != refreshToken)
                return Results.Extensions.UnauthorizedDeleteCookie(_jwtSettings.RefreshCookieKey, _jwtSettings.CookieKey);

            var claims = CreateClaims(user);
            // string token = GenerateToken(claims, DateTime.Now.AddDays(_jwtSettings.TokenExpireDays));
            string token = GenerateToken(claims, DateTime.Now.AddSeconds(10));
            Response.Cookies.Append(_jwtSettings.CookieKey, token, _cookieOptions);
            return Results.Ok();
        }

        [Authorize]
        [HttpGet("user")]
        public IResult GetUser()
        {
            return Results.Text("Janek");
        }

        [HttpGet("logout")]
        public IResult Logout()
        {
            Response.Cookies.Delete(_jwtSettings.CookieKey);
            Response.Cookies.Delete(_jwtSettings.RefreshCookieKey);
            return Results.Ok();
        }



        // Private
        private static Claim[] CreateClaims(User user)
        {
            return new Claim[]
            {
                new(ClaimKeys.Login, user.Login),
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
