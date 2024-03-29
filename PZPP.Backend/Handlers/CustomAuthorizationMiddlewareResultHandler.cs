﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using PZPP.Backend.Services.Auth;

namespace PZPP.Backend.Handlers
{
    public class CustomAuthorizationMiddlewareResultHandler : IAuthorizationMiddlewareResultHandler
    {
        private readonly AuthorizationMiddlewareResultHandler _defeaultHandler = new();
        private readonly IAuthService _authService;

        public CustomAuthorizationMiddlewareResultHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task HandleAsync(RequestDelegate next, HttpContext context, AuthorizationPolicy policy, PolicyAuthorizationResult authorizeResult)
        {
            if (!authorizeResult.Challenged || !policy.Requirements.OfType<UserContextRequirement>().Any())
            {
                // Fallback to the default implementation.
                await _defeaultHandler.HandleAsync(next, context, policy, authorizeResult);
                return;
            }

            string? refreshToken = context.Request.Cookies[_authService.JWTSettings.CookieKeyRefresh];
            if (refreshToken is not null && await _authService.ValidateToken(refreshToken))
            {
                // If refresh valid, return 401 and let the frontend handle the refresh
                context.Response.StatusCode = 401;
                return;
            }

            // No cookies or refresh is invalid - delete cookies if exist and return 204 No Content
            _authService.DeleteTokenCookies(context.Response);
            context.Response.StatusCode = 204;
            return;
        }
    }

    public class UserContextRequirement : IAuthorizationRequirement { }

    public class UserContextRequirementHandler : AuthorizationHandler<UserContextRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, UserContextRequirement requirement)
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
    }
}
