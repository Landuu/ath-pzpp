using PZPP.Backend.Models;
using PZPP.Backend.Utils.JWT;

namespace PZPP.Backend.Services.Auth
{
    public interface IAuthService
    {
        CookieOptions CookieOptions { get; }
        JWTSettings JWTSettings { get; set; }
        string GenerateAccessToken(User user);
        string GenerateRefreshToken(User user);
        TokenPair GenerateTokens(User user);
        int GetUserIdFromToken(string refreshToken);
        bool ValidatePassword(User user, string password);
        Task<bool> ValidateRefreshToken(string refreshToken);
    }
}