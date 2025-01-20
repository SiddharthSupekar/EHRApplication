using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.IServices
{
    public interface IEmailService
    {
        public void SendEmail(string to, string subject, string body);
        public string GenerateOtp();
    }
}
