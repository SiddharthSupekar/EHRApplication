using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class User
    {
        [Key]
        public int userId {  get; set; }
        public string firstName {  get; set; }
        public string lastName { get; set; }
        public DateTime dob {  get; set; }
        public string? username {  get; set; }
        public string? password { get; set; }
        public string mobile {  get; set; }
        public string? email { get; set; }
        [ForeignKey("Gender")]
        public int genderId {  get; set; }
        public Gender Gender { get; set; }
        [ForeignKey("Roles")]
        public int roleId {  get; set; }                                           
        public Roles Roles { get; set; }
        [ForeignKey("BloodGroup")]
        public int bloodGroupId {  get; set; }
        public BloodGroup BloodGroup { get; set; }
        public string? address {  get; set; }
        public string pincode {  get; set; }
        public string city {  get; set; }
        [ForeignKey("Country")]
        public int countryId { get; set; }
        public Country Country { get; set; }
        [ForeignKey("State")]
        public int stateId {  get; set; }
        public State State { get; set; }
        public string profileImage {  get; set; }
        [ForeignKey("Qualification")]
        public int? qualificationId {  get; set; }
        public Qualification Qualification { get; set; }

        [ForeignKey("Specialization")]
        public int? specializationId {  get; set; }
        public Specialization Specialization { get; set; }
        public string? registrationNumber {  get; set; }
        public float? visitingCharge {  get; set; }

    }
}
