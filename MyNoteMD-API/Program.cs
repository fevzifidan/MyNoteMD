using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using MyNoteMD_API;
using MyNoteMD_API.Data;
using MyNoteMD_API.Handlers;
using MyNoteMD_API.Models;
using MyNoteMD_API.Services;
using Serilog;
using Serilog.Events;
using StackExchange.Redis;
using System.Text;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File(
        path: "Logs/mynotemd-log-.txt",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}")
    .CreateLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    // 1. PostgreSQL and Reddis Connections
    builder.Services.AddDbContext<AppDbContext>(options =>
    {
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
    });

    var redisConnectionString = builder.Configuration.GetConnectionString("RedisConnection");
    builder.Services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(redisConnectionString!));

    // 2. Identity Settings

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("MyNoteMDReactAppPolicy", policy =>
        {
            policy.WithOrigins("http://localhost:9595", "http://localhost:5173")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        });
    });

    builder.Services.AddIdentity<AppUser, IdentityRole<Guid>>(options =>
    {
        // Password Rules
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireNonAlphanumeric = true;
        options.Password.RequiredLength = 8;

        // User Rules
        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

    builder.Services.AddScoped<ISessionService, SessionService>();

    builder.Services.AddAuthentication("OpaqueCookieAuth")
    .AddScheme<AuthenticationSchemeOptions, OpaqueTokenAuthHandler>("OpaqueCookieAuth", options => { });

    builder.Services.AddAuthorization(options =>
    {
        options.DefaultPolicy = new AuthorizationPolicyBuilder("OpaqueCookieAuth")
            .RequireAuthenticatedUser()
            .Build();
    });

    builder.Services.AddHttpContextAccessor();
    builder.Services.AddScoped<IAuditService, AuditService>();

    // Add services to the container.

    builder.Services.AddAntiforgery(options =>
    {
        options.HeaderName = "X-Csrf-Token";
        //options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        //options.Cookie.SameSite = SameSiteMode.Lax;
    });

    builder.Services.AddScoped<CsrfValidationFilter>();

    builder.Services.AddControllers(options =>
    {
        options.Filters.AddService<CsrfValidationFilter>();
    });

    // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "MyNoteMD API",
            Version = "v1",
            Description = "A secure Markdown Note management system based on Opaque Token and HttpOnly Cookie."
        });

        options.AddSecurityDefinition("cookieAuth", new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.ApiKey,
            In = ParameterLocation.Cookie,
            Name = "MyNoteMD_Session",
        });

        options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("cookieAuth", document)] = []
        });
    });

    builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
    builder.Services.AddProblemDetails();

    var app = builder.Build();

    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.Migrate();
    }

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }
    else
    {
        app.UseHsts();
    }

    app.Use(async (context, next) =>
    {
        context.Response.Headers["X-Frame-Options"] = "SAMEORIGIN";
        context.Response.Headers["X-Content-Type-Options"] = "nosniff";
        context.Response.Headers["Content-Security-Policy"] = "frame-ancestors 'self';";
        await next();
    });

    app.UseExceptionHandler();

    app.UseHttpsRedirection();

    app.UseRouting();

    app.UseCors("MyNoteMDReactAppPolicy");

    app.UseAuthentication();

    app.UseAuthorization();

    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "The app crashed unexpectedly!");
}
finally
{
    Log.CloseAndFlush();
}
