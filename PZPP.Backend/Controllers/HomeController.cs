using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PZPP.Backend.Utils.JWT;
using System.IdentityModel.Tokens.Jwt;

namespace PZPP.Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("/api")]
    public class HomeController : ControllerBase
    {
        private readonly JWTSettings settings;

        public HomeController(IConfiguration configuration)
        {
            settings = configuration.GetSection("JWT").Get<JWTSettings>()!;
        }

        [HttpGet]
        public IResult Get()
        {
            return Results.Ok("git");
        }

        [HttpGet("authorized")]
        public async Task<IResult> GetAuthorized()
        {
            var th = new JwtSecurityTokenHandler();

            var helper = new JWTHelper(settings);
            var ar = await th.ValidateTokenAsync(Request.Cookies["token"], helper.GetValidationParameters());

            var u = User.Identity;
            return Results.Text("authorized");
        }

        [HttpPost("post")]
        public async Task<IResult> PostTest([FromForm] string test)
        {
            return Results.Ok();
        }
    }
}