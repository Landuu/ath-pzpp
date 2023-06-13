using DevExtreme.AspNet.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PZPP.Backend.Database;
using PZPP.Backend.Utils.Devextreme;

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
        public async Task<IResult> GetProducts(DataSourceLoadOptions loadOptions)
        {
            var products = await _context.Products.ToListAsync();
            var loadResult = DataSourceLoader.Load(products, loadOptions);
            return Results.Json(loadResult);
        }

        [HttpGet("{productId}")]
        public async Task<IResult> GetProduct([FromRoute] int productId)
        {
            var product = await _context.Products.FindAsync(productId);
            if(product == null)
               return Results.BadRequest("Product not found");
            return Results.Json(product);
        }

        [HttpGet("categories")]
        public async Task<IResult> GetCategories()
        {
            var categories = await _context.ProductCategories.ToListAsync();
            return Results.Json(categories);
        }
    }
}
