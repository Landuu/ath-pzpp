using Microsoft.AspNetCore.Authentication.JwtBearer;
using PZPP.Backend.Database;
using PZPP.Backend.Utils;
using PZPP.Backend.Utils.Settings;

var builder = WebApplication.CreateBuilder(args);

// Config
JWTSettings jwtSettings = builder.Configuration.GetSection("JWT").Get<JWTSettings>()!;
JWTHelper jwtHelper = new(jwtSettings);

builder.Services.AddAuthentication().AddJwtBearer(options =>
{
    options.TokenValidationParameters = jwtHelper.GetValidationParameters();
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            context.Token = context.Request.Cookies[jwtSettings.CookieKey];
            return Task.CompletedTask;
        }
    };
});
builder.Services.AddAuthorization();

builder.Services.AddDbContext<ApiContext>();
builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.ConfigureHttpJsonOptions(options => options.SerializerOptions.PropertyNamingPolicy = null);
// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.MapControllers();
app.UseRouting();

#pragma warning disable ASP0001
app.UseAuthorization();
app.UseAuthorization();
#pragma warning restore ASP0001

app.MapWhen(ctx => !ctx.Request.Path.StartsWithSegments("/api"), index =>
{
    index.UseRouting();
    index.UseEndpoints(endpoints =>
    {
        endpoints.MapFallbackToFile("index.html");
    });
});

app.Run();
