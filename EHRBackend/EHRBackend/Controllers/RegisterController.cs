
using App.Core.Dto;
using App.Core.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EHRBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly IRegisterService _registerService;
        public RegisterController(IRegisterService registerService)
        {
            _registerService = registerService;
        }



        [HttpPost]
        public async Task<IActionResult> Post([FromForm] RegisterDto registerDto, IFormFile? profileImage)
        {
            if (registerDto != null)
            {

                if (await _registerService.getUserByEmail(registerDto.email) == null)
                {
                    await _registerService.createUser(registerDto, profileImage);
                    return Ok(registerDto);
                }
                return Conflict("Already Exists");
            }
            return BadRequest("Null object passed");
        }

        [HttpPut("update")]
        public async Task<IActionResult> put(string username, [FromForm] RegisterDto registerDto, IFormFile? profileImage)
        {
            if (registerDto != null)
            {
                await _registerService.updateProfile(username, registerDto, profileImage);
                return Ok();
            }
            return BadRequest();
        }

        [HttpGet("email")]
        public async Task<IActionResult> getByEmail(string email)
        {
            if(email != null)
            {
                var user = await _registerService.getUserByEmail(email);
                if(user!= null)
                {
                    return Ok(user);
                }
                return NotFound("User doesnot exist");
            }
            return BadRequest();
        }

        [HttpPut("changePassword")]
        public async Task<IActionResult> changePassword(ChangePasswordDto dto)
        {
            if (dto.username != null && dto.oldPassword != null && dto.newPassword != null)
            {
                if (await _registerService.changePassword(dto.username, dto.oldPassword, dto.newPassword))
                {
                    return Ok();
                }
                return Unauthorized("Old password is not correct");
            }
            return BadRequest("Missing username or password");
        }

    }
}
