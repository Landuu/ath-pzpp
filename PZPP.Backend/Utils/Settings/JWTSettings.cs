﻿namespace PZPP.Backend.Utils.Settings
{
    public class JWTSettings
    {
        public string Secret { get; set; }

        public string Issuer { get; set; }

        public string Audience { get; set; }

        public string CookieKey { get; set; }
    }
}
