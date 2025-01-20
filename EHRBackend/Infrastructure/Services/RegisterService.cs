using App.Core.Dto;
using App.Core.IServices;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace Infrastructure.Services
{
    public class RegisterService : IRegisterService
    {
        private readonly AppDbContext _appDbContext;
        private readonly SqlConnection _connection;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        public RegisterService(AppDbContext appDbContext, IConfiguration configuration, IEmailService emailService)
        {
            _appDbContext = appDbContext;
            _connection = new SqlConnection(configuration.GetConnectionString("EHRConnectionString"));
            _emailService = emailService;
        }

        public async Task<User> getUserByEmail(string email)
        {
            var query = "SELECT * FROM USERS WHERE EMAIL = @email";
            var user = await _connection.QueryFirstOrDefaultAsync<User>(query, new { email = email });
            return user;
        }
        public async Task<User> getUserByUsername(string userName)
        {
            var query = "SELECT * FROM USERS WHERE username = @username";
            var user = await _connection.QueryFirstOrDefaultAsync<User>(query, new { username = userName });
            return user;
        }

        public async Task<bool> createUser(RegisterDto registerDto, IFormFile? profileImage )
        {
            var user = new User();
            user.firstName = registerDto.firstName;
            user.lastName = registerDto.lastName;   
            user.email = registerDto.email;
            user.mobile = registerDto.mobile;
            user.dob = registerDto.dob;
            user.genderId = registerDto.genderId;
            user.roleId = registerDto.roleId;
            user.bloodGroupId = registerDto.bloodGroupId;
            user.address = registerDto.address;
            user.pincode = registerDto.pincode;
            user.countryId = registerDto.countryId;
            user.stateId = registerDto.stateId;
            user.city = registerDto.city;
            user.qualificationId = registerDto.qualificationId;
            user.registrationNumber = registerDto.registrationNumber;
            user.specializationId = registerDto.specializationId;
            user.visitingCharge = registerDto.visitingCharge;

            if (profileImage != null)
            {
                if (profileImage.ContentType == "image/jpeg" || profileImage.ContentType == "image/png")
                {
                    var uploadsFolder = Path.Combine("wwwroot", "uploads", "profileImages");
                    Directory.CreateDirectory(uploadsFolder); // Ensure the directory exists

                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + profileImage.FileName;
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await profileImage.CopyToAsync(fileStream);
                    }

                    
                    user.profileImage = Path.Combine("uploads", "profileImages", uniqueFileName);
                }
                else
                {
                    throw new Exception("Invalid file format. Only JPG and PNG are supported.");
                }
            }
            else
            {
                user.profileImage = Path.Combine("uploads", "profileImages", "defaultPic.jpeg");
            }
            var username = $"EC_{registerDto.lastName.ToUpper()}{registerDto.firstName.Substring(0, 1).ToUpper()}{registerDto.dob:ddMMyy}";
            var password = await generatePassword();
            user.username = username;
            user.password = BCrypt.Net.BCrypt.HashPassword(password, 13);

            //await _appDbContext.Users.AddAsync(user);
            //await _appDbContext.SaveChangesAsync();

            string emailSubject = "Login Details";
            string message = $"Hi {registerDto.firstName},<br><br>You have been successfully registered with us!!!<br>Your login credentials are:<br>Username:" +
                $" <b>{username}</b><br>Password: <b>{password}</b><br><br>We advise you to change your password after logging in for the first time.";

            _emailService.SendEmail(registerDto.email, emailSubject, message);

            await _appDbContext.Users.AddAsync(user);
            await _appDbContext.SaveChangesAsync();

            return true;
        }
        public async Task<string> generatePassword()
        {
            int i = 8;
            const string characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            StringBuilder password = new StringBuilder();
            Random random = new Random();

            while (i > 0)
            {
                password.Append(characters[random.Next(characters.Length)]);
                i--;
            }
            return password.ToString();
        }

        public async Task updateProfile(string username, RegisterDto registerDto, IFormFile? profileImageFile)
        {
            var user = await getUserByUsername(username);



            if ((await getUserByEmail(registerDto.email) == null) || (user.email == registerDto.email))
            {
                user.firstName = registerDto.firstName;
                user.lastName = registerDto.lastName;
                user.email = registerDto.email;
                user.mobile = registerDto.mobile;
                user.dob = registerDto.dob;
                user.genderId = registerDto.genderId;
                //user.roleId = registerDto.roleId;
                user.bloodGroupId = registerDto.bloodGroupId;
                user.address = registerDto.address;
                user.pincode = registerDto.pincode;
                user.countryId = registerDto.countryId;
                user.stateId = registerDto.stateId;
                user.city = registerDto.city;
                user.qualificationId = registerDto.qualificationId;
                user.registrationNumber = registerDto.registrationNumber;
                user.specializationId = registerDto.specializationId;
                user.visitingCharge = registerDto.visitingCharge;

                if (profileImageFile != null)
                {
                    if (profileImageFile.ContentType == "image/jpeg" || profileImageFile.ContentType == "image/png")
                    {
                        if (!string.IsNullOrEmpty(user.profileImage))
                        {
                            var existingPath = Path.Combine("wwwroot", user.profileImage);
                            if (File.Exists(existingPath))
                            {
                                File.Delete(existingPath);
                            }


                        }

                        var uploadPath = Path.Combine("wwwroot", "uploads", "profileImages");
                        Directory.CreateDirectory(uploadPath);

                        var uniqueFileName = Guid.NewGuid().ToString() + "_" + profileImageFile.FileName;
                        var newFilePath = Path.Combine(uploadPath, uniqueFileName);

                        using (var fileStream = new FileStream(newFilePath, FileMode.Create))
                        {
                            await profileImageFile.CopyToAsync(fileStream);
                        }

                        user.profileImage = Path.Combine("uploads", "profileImages", uniqueFileName);
                    }

                    else
                    {
                        throw new Exception("Invalid file format. Only JPG and PNG are supported.");
                    }


                }
                _appDbContext.Users.Update(user);
                await _appDbContext.SaveChangesAsync();

            }
        }

        public async Task<bool> changePassword(string username, string oldPassword, string newPassword)
        {
            var user = await getUserByUsername(username);

            if (BCrypt.Net.BCrypt.Verify(oldPassword, user.password))
            {
                user.password = BCrypt.Net.BCrypt.HashPassword(newPassword, 13);

                _appDbContext.Users.Update(user);
                await _appDbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

    }
}
