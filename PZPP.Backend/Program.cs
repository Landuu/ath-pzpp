using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using PZPP.Backend.Database;
using PZPP.Backend.Utils.Settings;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Config
JWTSettings jwtSettings = builder.Configuration.GetSection("JWT").Get<JWTSettings>()!;


builder.Services.AddAuthentication().AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings.Secret)),
    };

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
