using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace EscapeRoom
{
    public class Startup
    {
        private IWebHostEnvironment environment;

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            this.environment = env;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddMemoryCache();
            services.AddSignalR();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            if (environment.IsDevelopment())
            {
                app.MapWhen(
                context => context.Request.Path.StartsWithSegments(PathString.FromUriComponent("/dist")),
                spaApp =>
                {
                    spaApp.UseSpa(spa =>
                    {
                        spa.Options.SourcePath = "dist";
                        spa.Options.StartupTimeout = TimeSpan.FromSeconds(30);

                        spa.UseProxyToSpaDevelopmentServer("http://localhost:8083");
                    });
                });
            }
            else
            {
                app.UseStaticFiles();
            }

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();

                endpoints.MapHub<GameHub>(
                    "/hub",
                    dispatcherOptions =>
                    {
                    });

                endpoints.MapFallbackToFile("index.html");
            });
        }
    }
}
