using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using RotaFlex.Datas;
using RotaFlex.Services;

internal class Program
{
    private static void Main(string[] args)
    {
        Env.Load();

        var builder = WebApplication.CreateBuilder(args);

        var connStr = Environment.GetEnvironmentVariable("RailwayConnectString");

        if (string.IsNullOrEmpty(connStr))
        {
            throw new Exception("A string de conexão não foi encontrada no arquivo .env.");
        }

        // Add services to the container.
        builder.Services.AddControllersWithViews();
        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseMySql(
                connStr,
                new MySqlServerVersion(new Version(8, 0, 36)),
                mySqlOptions => mySqlOptions.EnableRetryOnFailure()
            )
        );
        builder.Services.AddScoped<SeedingService>();
        builder.Services.AddHttpClient<GeoLocalizacaoService>();

        // Configuração do CORS
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowLocalhost", policy =>
            {
                policy.WithOrigins("http://localhost:4200")  // Frontend Angular
                      .AllowAnyMethod()                   // Permitir qualquer método HTTP
                      .AllowAnyHeader();                  // Permitir qualquer cabeçalho
            });
        });

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler("/Home/Error");
            app.UseHsts();
        }

        // Usando o CORS
        app.UseCors("AllowLocalhost");

        // População de dados iniciais (se necessário)
        using (var scope = app.Services.CreateScope())
        {
            var seedingService = scope.ServiceProvider.GetRequiredService<SeedingService>();
            seedingService.Seed();
        }

        app.UseHttpsRedirection();
        app.UseSwagger();
        app.UseSwaggerUI();

        app.UseStaticFiles();

        app.UseRouting();

        app.UseAuthorization();

        // Definição de rota padrão
        app.MapControllerRoute(
            name: "default",
            pattern: "{controller=Login}/{action=Index}");

        app.Run();
    }
}
