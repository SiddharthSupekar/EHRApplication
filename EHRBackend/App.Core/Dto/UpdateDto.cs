using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Dto
{
    public class UpdateDto
    {
        public int appointmentId { get; set; }
        public DateTime appointmentDate { get; set; }
        public TimeOnly appointmentTime { get; set; }
        public string? chiefComplaint { get; set; }
    }
}
