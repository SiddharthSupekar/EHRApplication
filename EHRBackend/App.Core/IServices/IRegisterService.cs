using App.Core.Dto;
using Domain;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.IServices
{
    public interface IRegisterService
    {
        public Task<User> getUserByEmail(string email);
        public Task<User> getUserByUsername(string userName);
        //public Task<Roles> getRole
        public Task<bool> createUser(RegisterDto registerDto, IFormFile? profileImage);

        public Task<bool> changePassword(string username, string oldPassword, string newPassword);
        public Task updateProfile(string username, RegisterDto registerDto, IFormFile? profileImageFile);
        public Task<string> generatePassword();
    }
}
