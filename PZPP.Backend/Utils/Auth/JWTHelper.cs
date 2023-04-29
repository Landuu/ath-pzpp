using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace PZPP.Backend.Utils.JWT
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
                ClockSkew = TimeSpan.Zero
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
                SigningCredentials = new(signKey, SecurityAlgorithms.HmacSha256),
            };
        }
    }
}
