namespace PZPP.Backend.Utils.JWT
{
    public class JWTSettings
    {
        public string Secret { get; set; }

        public string Issuer { get; set; }

        public string Audience { get; set; }

        public string CookieKey { get; set; }

        public string RefreshCookieKey { get; set; }

        public int TokenExpireDays { get; set; }

        public int RefreshExpireDays { get; set; }
    }
}
