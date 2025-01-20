using Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Dto
{
    public class RegisterDto
    {
        public string firstName { get; set; }//
        public string lastName { get; set; }//
        public DateTime dob { get; set; }//
        public string mobile { get; set; }//
        public string? email { get; set; }//
        public int genderId { get; set; }//
        public int roleId { get; set; }//
        public int bloodGroupId { get; set; }//
        public string address { get; set; }//
        public string pincode { get; set; }//
        public int stateId { get; set; }//
        public int countryId {  get; set; }//
        public string city { get; set; }//
        public int? qualificationId { get; set; }
        public int? specializationId { get; set; }
        public string? registrationNumber { get; set; }
        public float? visitingCharge { get; set; }
    }
}
