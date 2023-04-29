using System.Security.Claims;

namespace PZPP.Backend.Utils.Auth
{
    public static class UserExtensions
    {
        public static int GetUID(this ClaimsPrincipal principal)
        {
            string? uid = principal.FindFirstValue(ClaimKeys.UID);
            return Convert.ToInt32(uid);
        }

        public static string? GetLogin(this ClaimsPrincipal principal)
        {
            return principal.FindFirstValue(ClaimKeys.Login);
        }
    }
}
