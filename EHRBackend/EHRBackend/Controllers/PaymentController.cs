using App.Core.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EHRBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IStripeService _stripeService;

        public PaymentController(IStripeService stripeService)
        {
            _stripeService = stripeService;
        }

        [HttpPost("create-payment-intent")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] decimal amount)
        {
            var clientSecret = await _stripeService.CreatePaymentIntent(amount);
            return Ok(new { clientSecret });
        }
    }
}
