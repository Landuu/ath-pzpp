using Microsoft.AspNetCore.Mvc;

namespace PZPP.Backend.Controllers
{
    [ApiController]
    [Route("/api")]
    public class HomeController : ControllerBase
    {
        public HomeController()
        {

        }

        [HttpGet]
        public IResult Get()
        {
            return Results.Ok("git");
        }
    }
}