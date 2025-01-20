using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class BloodGroup
    {
        [Key]
        public int bloodGroupId {  get; set; }
        public string bloodGroupName {  get; set; }
    }
}
