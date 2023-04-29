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
        private readonly JWTSettings _jwtSettings;
        private readonly JWTHelper _jwtHelper;
        private readonly JwtSecurityTokenHandler _tokenHandler = new();

        public string CookieKeyAccess { get; private set; }
        public string CookieKeyRefresh { get; private set; }
        public CookieOptions CookieOptions { get; private set; } = new()
        {
            HttpOnly = true
        };

        public AuthService(IOptions<JWTSettings> jwtSettings)
        {
            _jwtSettings = jwtSettings.Value;
            _jwtHelper = new JWTHelper(jwtSettings.Value);

            CookieKeyAccess = _jwtSettings.CookieKeyAccess;
            CookieKeyRefresh = _jwtSettings.CookieKeyRefresh;
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
            return GenerateToken(claims, DateTime.Now.AddDays(_jwtSettings.TokenExpireDays));
        }

        public string GenerateRefreshToken(User user)
        {
            var claims = new Claim[]
            {
                new(ClaimKeys.UID, user.Id.ToString())
            };
            return GenerateToken(claims, DateTime.Now.AddDays(_jwtSettings.RefreshExpireDays));
        }

        public async Task<bool> ValidateRefreshToken(string refreshToken)
        {
            var validationResult = await _tokenHandler.ValidateTokenAsync(refreshToken, _jwtHelper.GetValidationParameters());
            return validationResult.IsValid;
        }

        public int GetUserIdFromToken(string refreshToken)
        {
            var tokenObject = _tokenHandler.ReadJwtToken(refreshToken);
            int uid = Convert.ToInt32(tokenObject.Claims.FirstOrDefault(x => x.Type == ClaimKeys.UID)?.Value);
            return uid;
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
