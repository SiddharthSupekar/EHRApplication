using App.Core.IServices;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EHRBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SOAPController : ControllerBase
    {
        private readonly ISOAPService _SOAPService;

        public SOAPController(ISOAPService sOAPService)
        {
            _SOAPService = sOAPService;
        }

        [HttpGet("get-soap")]
        public async Task<IActionResult> getSoap(int appointmentId)
        {
            if (appointmentId != null )
            {
                var result = await _SOAPService.getSoapNotes(appointmentId);
                if (result != null)
                {
                    return Ok(result);
                }
                return NotFound();
            }
            return BadRequest();    
        }

        [HttpPost("add-soap")]
        public async Task<IActionResult> addSoap(SOAPNotes sOAPNotes)
        {
            if(sOAPNotes != null || sOAPNotes.appointmentId != 0)
            {
                var result = await _SOAPService.addSoapNotes(sOAPNotes);
                if (result)
                {
                    return Ok();
                }
                return BadRequest();
            }
            return BadRequest();    
        }
    }
}
