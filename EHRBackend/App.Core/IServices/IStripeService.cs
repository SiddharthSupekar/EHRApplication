using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.IServices
{
    public interface IStripeService
    {
        Task<string> CreatePaymentIntent(decimal amount);
    }
}
