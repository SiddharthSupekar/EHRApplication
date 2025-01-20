using App.Core.IServices.GetDataInterfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EHRBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {
        private readonly ISpecializationService _SpecializationService;
        private readonly IQualificationService  _QualificationService;
        private readonly IGenderService _GenderService;
        private readonly IBloodGroupService _BloodGroupService;

        public DataController(ISpecializationService specializationService, IQualificationService qualificationService, IGenderService genderService, IBloodGroupService bloodGroupService)
        {
            _BloodGroupService = bloodGroupService;
            _SpecializationService = specializationService;
            _QualificationService = qualificationService;
            _GenderService = genderService;
        }

        [HttpGet("bloodGroups")]
        public async Task<IActionResult> bloodGroup()
        {
            return Ok(await _BloodGroupService.getBloodGroups());
        }

        [HttpGet("specializations")]
        public async Task<IActionResult> specializations()
        {
            return Ok(await _SpecializationService.getSpecializations());
        }
        [HttpGet("genders")]
        public async Task<IActionResult> genders()
        {
            return Ok(await _GenderService.getGenders());
        }
        [HttpGet("qualifications")]
        public async Task<IActionResult> qualifications()
        {
            return Ok(await _QualificationService.getQualifications());
        }
    }
}
