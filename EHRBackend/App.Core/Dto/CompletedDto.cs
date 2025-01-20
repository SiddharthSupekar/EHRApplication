using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Dto
{
    public class CompletedDto
    {
        public int appointmentId { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public DateTime appointmentDate { get; set; }
        public TimeOnly appointmentTime { get; set; }
        public string appointmentStatus { get; set; }
        public string? specializationName { get; set; }
        public string chiefComplaint { get; set; }
        public string? profileImage { get; set; }
    }
}
