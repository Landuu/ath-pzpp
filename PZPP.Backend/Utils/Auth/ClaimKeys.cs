using System.Security.Claims;

namespace PZPP.Backend.Utils.Auth
{
    public static class ClaimKeys
    {
        public const string UID = "uid";
        public const string Login = "login";
        public const string Roles = ClaimTypes.Role;
    }
}
