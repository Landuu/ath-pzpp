using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PZPP.Backend.Models;
using PZPP.Backend.Utils;
using PZPP.Backend.Utils.Settings;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace PZPP.Backend.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly JWTSettings _jwtSettings;
        private readonly JWTHelper _jwtHelper;
        
        public CookieOptions CookieOptions { get; private set; } = new() { 
            HttpOnly = true
        };

        public AuthService(IOptions<JWTSettings> jwtSettings)
        {
            _jwtSettings = jwtSettings.Value;
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
            var claims = CreateClaims(user);
            return GenerateToken(claims, DateTime.Now.AddDays(_jwtSettings.TokenExpireDays));
        }

        public string GenerateRefreshToken(User user)
        {
            var refreshClaims = CreateRefreshClaims(user);
            return GenerateToken(refreshClaims, DateTime.Now.AddDays(_jwtSettings.RefreshExpireDays));
        }

        public async Task<bool> ValidateRefreshToken(string refreshToken)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationResult = await tokenHandler.ValidateTokenAsync(refreshToken, _jwtHelper.GetValidationParameters());
            return validationResult.IsValid;
        }

        public int GetUserIdFromToken(string refreshToken)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenObject = tokenHandler.ReadJwtToken(refreshToken);
            int uid = Convert.ToInt32(tokenObject.Claims.FirstOrDefault(x => x.Type == ClaimKeys.UID)?.Value);
            return uid;
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
