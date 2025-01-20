
using App.Core.IServices;
using App.Core.IServices.GetDataInterfaces;
using Infrastructure;
using Infrastructure.Services;
using Infrastructure.Services.GetDataServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace EHRBackend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);



            // Add services to the container.

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("EHRConnectionString")));

            builder.Services.AddControllers();

            builder.Services.AddScoped<IRegisterService, RegisterService>();
            builder.Services.AddScoped<ILoginService, LoginService>();  
            builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddScoped<ICountryStateService, CountryStateService>();
            builder.Services.AddScoped<IBloodGroupService, BloodGroupService>();
            builder.Services.AddScoped<IGenderService, GenderService>();
            builder.Services.AddScoped<IQualificationService, QualificationService>();
            builder.Services.AddScoped<ISpecializationService, SpecializationService>();    
            builder.Services.AddScoped<IAppointmentService, AppointmentService>();
            builder.Services.AddScoped<IStripeService, StripeService>();
            builder.Services.AddScoped<ISOAPService, SOAPService>();

            var MyAllowSpecificOrigin = "_myAllowsSpecificOrigin";

            builder.Services.AddCors(options => {
                options.AddPolicy(name: MyAllowSpecificOrigin,
                       policy => {
                           policy.WithOrigins("http://localhost:4200", "http://localhost:60743/", "http://localhost:62991/")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                       });
            });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(
               options =>
               {
                   options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo()
                   {
                       Title = "Auth Demo",
                       Version = "v1"
                   });

                   options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme()
                   {
                       In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                       Description = "Please enter a token",
                       Name = "Authorization",
                       Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                       BearerFormat = "JWT",
                       Scheme = "bearer"
                   });

                   options.AddSecurityRequirement(new OpenApiSecurityRequirement()
               {
                    {
                        new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    []
                    }
               });

               }
           );

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateAudience = true,
                    ValidateIssuer = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                };
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors(MyAllowSpecificOrigin);

            app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseAuthentication();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
