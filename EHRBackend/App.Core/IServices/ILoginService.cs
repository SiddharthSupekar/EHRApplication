using App.Core.Dto;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.IServices
{
    public interface ILoginService
    {
        public Task addOtp(Otp otp);
        public Task<bool> verifyOtp(OtpVerifyDto dto);
        public Task<bool> forgotPassword(string email);
        public Task<string> getUserRoleName(int roleId);
    }
}
