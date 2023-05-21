using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PZPP.Backend.Services.DatabaseSeed;

namespace PZPP.Backend.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("/api")]
    public class HomeController : ControllerBase
    {
        private readonly IDatabaseSeedService _databaseSeedService;

        public HomeController(IDatabaseSeedService databaseSeedService) 
        { 
            _databaseSeedService = databaseSeedService;
        }

        [HttpGet]
        public IResult Get()
        {
            return Results.Ok("git");
        }

        [HttpGet("database")]
        public async Task<IResult> TestDatabase()
        {
            await _databaseSeedService.GenerateData();

            return Results.Ok("Ok");
        }
    }
}