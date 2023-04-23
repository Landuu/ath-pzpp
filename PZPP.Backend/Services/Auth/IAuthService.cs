using PZPP.Backend.Models;

namespace PZPP.Backend.Services.Auth
{
    public interface IAuthService
    {
        CookieOptions CookieOptions { get; }

        string GenerateAccessToken(User user);
        string GenerateRefreshToken(User user);
        TokenPair GenerateTokens(User user);
        int GetUserIdFromToken(string refreshToken);
        bool ValidatePassword(User user, string password);
        Task<bool> ValidateRefreshToken(string refreshToken);
    }
}