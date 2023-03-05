using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PZPP.Backend.Database;
using PZPP.Backend.Models;
using PZPP.Backend.Utils.Settings;
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
        private readonly CookieOptions _cookieOptions;

        public AuthController(ApiContext context, IConfiguration configuration)
        {
            _context = context;

            var jwtSettings = configuration.GetSection("JWT").Get<JWTSettings>();
            if (jwtSettings == null) throw new ArgumentNullException(nameof(jwtSettings));
            _jwtSettings = jwtSettings;

            _cookieOptions = new()
            {
                HttpOnly = true,
            };
        }

        [HttpGet]
        public IResult GetToken()
        {
            User? user = _context.Users.FirstOrDefault();
            if (user == null) return Results.BadRequest();
            string token = GenerateToken(user);
            Response.Cookies.Append(_jwtSettings.CookieKey, token, _cookieOptions);
            return Results.Ok();
        }

        private string GenerateToken(User user)
        {
            var claims = new Claim[]
            {
                new("login", user.Login),
                new("uid", user.Id.ToString()),
                new(ClaimTypes.Role, "User")
            };

            var signKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_jwtSettings.Secret));
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                SigningCredentials = new(signKey, SecurityAlgorithms.HmacSha256)
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
