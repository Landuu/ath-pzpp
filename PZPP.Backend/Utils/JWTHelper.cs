using Microsoft.IdentityModel.Tokens;
using PZPP.Backend.Utils.Settings;
using System.Security.Claims;
using System.Text;

namespace PZPP.Backend.Utils
{
    public class JWTHelper
    {
        private readonly JWTSettings _jwtSettings;

        public JWTHelper(JWTSettings jwtSettings)
        {
            _jwtSettings = jwtSettings;
        }

        public TokenValidationParameters GetValidationParameters()
        {
            return new TokenValidationParameters
            {
                ValidIssuer = _jwtSettings.Issuer,
                ValidAudience = _jwtSettings.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_jwtSettings.Secret)),
            };
        }

        public SecurityTokenDescriptor GetTokenDescriptor(Claim[] claims, DateTime expire)
        {
            var signKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_jwtSettings.Secret));
            return new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expire,
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                SigningCredentials = new(signKey, SecurityAlgorithms.HmacSha256)
            };
        }
    }
}
