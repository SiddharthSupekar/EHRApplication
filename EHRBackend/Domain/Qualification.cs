using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Qualification
    {
        [Key]
        public int qualificationId {  get; set; }
        public string qualificationName {  get; set; }
    }
}
