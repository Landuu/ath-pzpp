using PZPP.Backend.Database;
using PZPP.Backend.Models;
using PZPP.Backend.Services.Auth;

namespace PZPP.Backend.Handlers
{
    public class RefreshTokenMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IAuthService _authService;

        public RefreshTokenMiddleware(RequestDelegate next, IAuthService authService)
        {
            _next = next;
            _authService = authService;
        }

        public async Task InvokeAsync(HttpContext context, ApiContext dbContext)
        {
            TokenPairNullable tokenPair = _authService.GetTokensFromCookies(context.Request);
            if (tokenPair.Acces is null || tokenPair.Refresh is null)
            {
                await _next(context);
                return;
            }

            bool isAccessValid = await _authService.ValidateToken(tokenPair.Acces);
            if (!isAccessValid)
            {
                await _next(context);
                return;
            }

            // TODO: try/catch
            DateTime accessTokenExpire = _authService.GetTokenExpireDateUTC(tokenPair.Acces);
            TimeSpan timeToExpire = accessTokenExpire - DateTime.UtcNow;
            double refeshThreshold = _authService.JWTSettings.TokenExpireMinutes * 0.80;
            if (timeToExpire.TotalMinutes < refeshThreshold)
            {
                await _next(context);
                return;
            }

            // Refresh/assign accces token using refresh token
            bool isRefeshValid = await _authService.ValidateToken(tokenPair.Refresh);
            if (!isRefeshValid)
            {
                await _next(context);
                return;
            }

            // TODO: try/catch
            int userId = _authService.GetUserIdFromToken(tokenPair.Refresh);
            User? user = await dbContext.Users.FindAsync(userId);
            if (user is null || user.RefreshToken is null || user.RefreshToken != tokenPair.Refresh)
            {
                await _next(context);
                return;
            }

            string token = _authService.GenerateAccessToken(user);
            _authService.AddAccessTokenCookie(context.Response, token);
            await _next(context);
        }


    }

    public static class RequestCultureMiddlewareExtensions
    {
        public static IApplicationBuilder UseRefreshToken(
            this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RefreshTokenMiddleware>();
        }
    }
}
