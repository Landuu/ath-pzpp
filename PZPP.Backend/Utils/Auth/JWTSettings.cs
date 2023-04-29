namespace PZPP.Backend.Utils.JWT
{
    public class JWTSettings
    {
        public string Secret { get; set; }

        public string Issuer { get; set; }

        public string Audience { get; set; }

        public string CookieKeyAccess { get; set; }

        public string CookieKeyRefresh { get; set; }

        public int TokenExpireMinutes { get; set; }

        public int RefreshExpireDays { get; set; }
    }
}
