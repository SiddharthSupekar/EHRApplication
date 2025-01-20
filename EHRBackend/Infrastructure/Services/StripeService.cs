using App.Core.IServices;
using Microsoft.Extensions.Configuration;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class StripeService:IStripeService
    {
        private readonly string _secretKey;

        public StripeService(IConfiguration configuration)
        {
            _secretKey = configuration["Stripe:SecretKey"];
            StripeConfiguration.ApiKey = _secretKey;
        }

        public async Task<string> CreatePaymentIntent(decimal amount)
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(amount * 100),
                Currency = "usd",
                PaymentMethodTypes = new List<string> { "card" },
            };

            var service = new PaymentIntentService();
            var paymentIntent = await service.CreateAsync(options);

            return paymentIntent.ClientSecret;
        }
    }

    // Infrastructure/Interfaces/IStripeService.cs
   
}
