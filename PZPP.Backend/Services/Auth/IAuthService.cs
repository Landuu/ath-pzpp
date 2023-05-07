using PZPP.Backend.Models;
using PZPP.Backend.Utils.JWT;

namespace PZPP.Backend.Services.Auth
{
    public interface IAuthService
    {
        CookieOptions CookieOptions { get; }
        JWTSettings JWTSettings { get; set; }

        void AddAccessTokenCookie(HttpResponse response, string token);
        void AddRefreshTokenCookie(HttpResponse response, string refreshToken);
        void AddTokenCookies(HttpResponse response, TokenPair tokenPair);
        void DeleteTokenCookies(HttpResponse response);
        string GenerateAccessToken(User user);
        string GenerateRefreshToken(User user);
        TokenPair GenerateTokens(User user);
        IResult GetDeleteCookiesResponse(HttpResponse response);
        DateTime GetTokenExpireDateUTC(string token);
        TokenPairNullable GetTokensFromCookies(HttpRequest request);
        int GetUserIdFromToken(string refreshToken);
        bool ValidatePassword(User user, string password);
        Task<bool> ValidateToken(string refreshToken);
    }
}