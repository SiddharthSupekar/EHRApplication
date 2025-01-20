using Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Dto
{
    public class AppointmentDto
    {
        public int providerId { get; set; }
        public int patientId { get; set; }
        public DateTime appointmentDate { get; set; }
        public TimeOnly appointmentTime { get; set; }
        public string chiefComplaint { get; set; }
        public string appointmentStatus { get; set; }
        public float fee { get; set; }
    }
}
