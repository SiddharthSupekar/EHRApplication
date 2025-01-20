using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.IServices.GetDataInterfaces
{
    public interface IBloodGroupService
    {
        public Task<List<BloodGroup>> getBloodGroups();
    }
}
