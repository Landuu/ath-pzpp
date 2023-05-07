using Microsoft.Extensions.Options;
using PZPP.Backend.Models;
using PZPP.Backend.Utils.Auth;
using PZPP.Backend.Utils.JWT;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace PZPP.Backend.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly JWTHelper _jwtHelper;
        private readonly JwtSecurityTokenHandler _tokenHandler = new();

        public JWTSettings JWTSettings { get; set; }
        public CookieOptions CookieOptions { get; private set; } = new()
        {
            HttpOnly = true
        };

        public AuthService(IOptions<JWTSettings> jwtSettings)
        {
            JWTSettings = jwtSettings.Value;
            _jwtHelper = new JWTHelper(jwtSettings.Value);

        }


        public bool ValidatePassword(User user, string password)
        {
            password = password.Trim();
            return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
        }

        public TokenPair GenerateTokens(User user)
        {
            return new TokenPair()
            {
                Access = GenerateAccessToken(user),
                Refresh = GenerateRefreshToken(user)
            };
        }

        public string GenerateAccessToken(User user)
        {
            var claims = new Claim[]
            {
                new(ClaimKeys.Login, user.Login.ToLower()),
                new(ClaimKeys.UID, user.Id.ToString()),
                new(ClaimTypes.Role, "User")
            };
            return GenerateToken(claims, DateTime.Now.AddMinutes(JWTSettings.TokenExpireMinutes));
        }

        public string GenerateRefreshToken(User user)
        {
            var claims = new Claim[]
            {
                new(ClaimKeys.UID, user.Id.ToString())
            };
            return GenerateToken(claims, DateTime.Now.AddMinutes(JWTSettings.RefreshExpireDays));
        }

        public async Task<bool> ValidateToken(string token)
        {
            var validationResult = await _tokenHandler.ValidateTokenAsync(token, _jwtHelper.GetValidationParameters());
            return validationResult.IsValid;
        }

        public int GetUserIdFromToken(string token)
        {
            var tokenObject = _tokenHandler.ReadJwtToken(token);
            int uid = Convert.ToInt32(tokenObject.Claims.FirstOrDefault(x => x.Type == ClaimKeys.UID)?.Value);
            return uid;
        }

        public IResult GetDeleteCookiesResponse(HttpResponse response)
        {
            DeleteTokenCookies(response);
            return Results.Unauthorized();
        }

        public void DeleteTokenCookies(HttpResponse response)
        {
            response.Cookies.Delete(JWTSettings.CookieKeyAccess);
            response.Cookies.Delete(JWTSettings.CookieKeyRefresh);
        }

        public void AddTokenCookies(HttpResponse response, TokenPair tokenPair)
        {
            AddAccessTokenCookie(response, tokenPair.Access);
            AddRefreshTokenCookie(response, tokenPair.Refresh);
        }

        public TokenPairNullable GetTokensFromCookies(HttpRequest request)
        {
            return new()
            {
                Acces = request.Cookies[JWTSettings.CookieKeyAccess],
                Refresh = request.Cookies[JWTSettings.CookieKeyRefresh]
            };
        }

        public void AddAccessTokenCookie(HttpResponse response, string token)
        {
            response.Cookies.Append(JWTSettings.CookieKeyAccess, token, CookieOptions);
        }

        public void AddRefreshTokenCookie(HttpResponse response, string refreshToken)
        {
            response.Cookies.Append(JWTSettings.CookieKeyRefresh, refreshToken, CookieOptions);
        }

        public DateTime GetTokenExpireDateUTC(string token)
        {
            var tokenObject = _tokenHandler.ReadJwtToken(token);
            return tokenObject.ValidTo;
        }


        // Private
        private string GenerateToken(Claim[] claims, DateTime expire)
        {
            var tokenDescriptor = _jwtHelper.GetTokenDescriptor(claims, expire);
            var token = _tokenHandler.CreateToken(tokenDescriptor);
            return _tokenHandler.WriteToken(token);
        }
    }
}
