using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;

namespace PZPP.Backend.Handlers
{
    public class CustomAuthorizationMiddlewareResultHandler : IAuthorizationMiddlewareResultHandler
    {
        private readonly AuthorizationMiddlewareResultHandler _defeaultHandler = new();

        public async Task HandleAsync(RequestDelegate next, HttpContext context, AuthorizationPolicy policy, PolicyAuthorizationResult authorizeResult)
        {
            if (authorizeResult.Challenged && policy.Requirements.OfType<UserContextRequirement>().Any())
            {
                context.Response.StatusCode = 204;
                return;
            }

            // Fall back to the default implementation.
            await _defeaultHandler.HandleAsync(next, context, policy, authorizeResult);
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
