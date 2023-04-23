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
        public HomeController() { }

        [HttpGet]
        public IResult Get()
        {
            return Results.Ok("git");
        }
    }
}