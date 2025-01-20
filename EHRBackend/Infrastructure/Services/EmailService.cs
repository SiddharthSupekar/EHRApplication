using App.Core.IServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;
        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        //public async Task SendEmail(string subject, string toEmail, string userName, string message)
        //{
        //    var apiKey = "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";
        //    var client = new SendGridClient(apiKey);
        //    var from = new EmailAddress("davisiduardo@gmail.com", "LoginWebsite");
        //    var to = new EmailAddress(toEmail, userName);
        //    var plainTextContent = message;
        //    var htmlContent = "";
        //    var otp = GenerateOtp();
        //    OtpStore[toEmail] = otp;


        //    var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
        //    var response = await client.SendEmailAsync(msg);
        //}
        public void SendEmail(string to, string subject, string body)
        {
            if (to == null || !to.Any())
            {
                throw new ArgumentNullException(nameof(to), "Recipient email address cannot be null or empty.");
            }

            var smtpHost = _configuration["Smtp:Host"];
            var smtpPort = _configuration["Smtp:Port"];
            var smtpEmail = _configuration["Smtp:Email"];
            var smtpPassword = _configuration["Smtp:Password"];
            var smtpEnableSsl = _configuration["Smtp:EnableSsl"];
            var smtpFrom = _configuration["Smtp:From"];
            var smtpSenderName = _configuration["Smtp:SenderName"];

            if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpPort) || string.IsNullOrEmpty(smtpEmail) ||
                string.IsNullOrEmpty(smtpPassword) || string.IsNullOrEmpty(smtpEnableSsl) || string.IsNullOrEmpty(smtpFrom))
            {
                _logger.LogError("SMTP configuration is missing or invalid.");
                throw new InvalidOperationException("SMTP configuration is missing or invalid.");
            }

            var smtpClient = new SmtpClient(smtpHost)
            {
                Port = int.Parse(smtpPort),
                Credentials = new NetworkCredential(smtpEmail, smtpPassword),
                EnableSsl = bool.Parse(smtpEnableSsl),
            };
            var mailMessage = new MailMessage
            {
                From = new MailAddress( smtpFrom, smtpSenderName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };

            if (!string.IsNullOrEmpty(to))
            {
                mailMessage.To.Add(to);
            }


            try
            {
                smtpClient.Send(mailMessage);
                _logger.LogInformation("Email sent successfully to {Recipient} recepients", to);
            }
            catch (SmtpException smtpEx)
            {
                _logger.LogError(smtpEx, "SMTP error sending email to  {Message}", smtpEx.Message);
                throw new InvalidOperationException($"SMTP error sending email:", smtpEx);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error sending email: {Message}", ex.Message);
                throw new InvalidOperationException($"Unexpected error sending email : {ex.Message}", ex);
            }
        }

        public string GenerateOtp()
        {
            Random random = new Random();
            return random.Next(100000, 999999).ToString();
        }
    }
}
