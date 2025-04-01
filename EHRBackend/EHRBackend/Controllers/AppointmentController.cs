using App.Core.Dto;
using App.Core.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EHRBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;


        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        //[HttpGet("all-appointments-of-user")]
        //public async Task<IActionResult> getAppointments(int patientId)
        //{
        //    var apts = await _appointmentService.getAllAppointmentsOfUser(patientId);
        //    return Ok(apts);
        //}

        [HttpGet("all-providers")]
        public async Task<IActionResult> getAllProviders()
        {
            var providers = await _appointmentService.getAllProviders();
            return Ok(providers);
        }
        [HttpGet("all-patients")]
        public async Task<IActionResult> getAllPatients()
        {
            var patients = await _appointmentService.getAllPatients();
            return Ok(patients);
        }

        [HttpPost("add-appointment")]
        public async Task<IActionResult> createAppointment(AppointmentDto aptDto)
        {
            if (aptDto != null)
            {
                TimeOnly targetTime = TimeOnly.FromDateTime(DateTime.UtcNow.AddHours(1));
                if (aptDto.appointmentDate > DateTime.UtcNow.Date || aptDto.appointmentDate == DateTime.UtcNow.Date && aptDto.appointmentTime <= targetTime)
                {
                    var result = await _appointmentService.createAppointment(aptDto);
                    if (result)
                    {
                        return Ok(result);
                    }
                    return Conflict("Appointment could not be created due to conflicting data.");
                }
                return BadRequest("Appointment date and time are not valid.");
            }
            return BadRequest("Invalid appointment data.");
        }


        [HttpPut("update-appointment")]
        public async Task<IActionResult> updateAppointment(int appointmentId, UpdateDto updateDto)
        {
            if(appointmentId != null && updateDto != null)
            {
                var appt = _appointmentService.getAppointment(appointmentId);
                if(appt != null)
                {
                    var result = await _appointmentService.updateAppointment(appointmentId, updateDto);
                    if (result)
                    {
                        return Ok();
                    }
                    return BadRequest();
                }
                return NotFound();

            }
            return BadRequest();
        }

        [HttpPut("update-status")]
        public async Task<IActionResult> updateStatus(int appointmentId, string status)
        {
            if (appointmentId != null && status!=null)
            {
                var appt = _appointmentService.getAppointment(appointmentId);
                if (appt != null)
                {
                    var result = await _appointmentService.updateStatus(appointmentId, status);
                    if (result)
                    {

                        return Ok(result);
                    }
                    return BadRequest();
                }
                return NotFound();

            }
            return BadRequest();
        }

        [HttpGet("patients-practitioner-list")]
        public async Task<IActionResult> getProvidersForPatient(int patientId)
        {
            if(patientId != null)
            {
                var apts = await _appointmentService.getProvidersForPatient(patientId);
                if(apts != null)
                {
                    return Ok(apts);
                }
                return NotFound("Patient id doesnot exist");
            }
            return BadRequest();
        }
        [HttpGet("provider-patients-list")]
        public async Task<IActionResult> getPatientsForProvider(int providerId)
        {
            if (providerId != null)
            {
                var apts = await _appointmentService.getPatientsForProvider(providerId);
                if (apts != null)
                {
                    return Ok(apts);
                }
                return NotFound("Provider id doesnot exist");
            }
            return BadRequest();
        }

        [HttpGet("patients-practitioner-list-completed")]
        public async Task<IActionResult> getProvidersForPatientCompleted(int patientId)
        {
            if (patientId != null)
            {
                var apts = await _appointmentService.getProvidersForPatientCompleted(patientId);
                if (apts != null)
                {
                    return Ok(apts);
                }
                return NotFound("Patient id doesnot exist");
            }
            return BadRequest();
        }
        [HttpGet("provider-patients-list-completed")]
        public async Task<IActionResult> getPatientsForProviderCompleted(int providerId)
        {
            if (providerId != null)
            {
                var apts = await _appointmentService.getPatientsForProviderCompleted(providerId);
                if (apts != null)
                {
                    return Ok(apts);
                }
                return NotFound("Provider id doesnot exist");
            }
            return BadRequest();
        }
    }
}
