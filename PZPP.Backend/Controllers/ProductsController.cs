using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PZPP.Backend.Database;

namespace PZPP.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApiContext _context;

        public ProductsController(ApiContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IResult> GetProducts()
        {
            var products = await _context.Products.ToListAsync();
            return Results.Json(products);
        }

        [HttpGet("{productId}")]
        public async Task<IResult> GetProduct([FromRoute] int productId)
        {
            var product = await _context.Products.FindAsync(productId);
            if(product == null)
               return Results.BadRequest("Product not found");
            return Results.Json(product);
        }
    }
}
