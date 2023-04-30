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
            string? accessToken = context.Request.Cookies[_authService.JWTSettings.CookieKeyAccess];
            string? refreshToken = context.Request.Cookies[_authService.JWTSettings.CookieKeyRefresh];
            User? user = dbContext.Users.FirstOrDefault();

            if (accessToken is null || refreshToken is null)
            {
                await _next(context);
                return;
            }

            await _next(context);

            /*
            bool isRefreshValid = await _authService.ValidateToken(refreshToken);
            if (isRefreshValid && _authService.IsTokenExpired(accessToken) && !_authService.IsTokenExpired(refreshToken))
            {
                string token = _authService.GenerateAccessToken();
                context.Response.Cookies.Append(_authService.JwtSettings.CookieKey, token);
            }

            await _next(context);
            */
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
