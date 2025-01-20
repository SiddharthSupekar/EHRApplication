﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Gender
    {
        [Key]
        public int genderId { get; set; }
        public string genderName { get; set; }
    }
}
