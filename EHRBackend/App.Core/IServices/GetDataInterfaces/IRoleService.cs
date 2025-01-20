using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace App.Core.IServices.GetDataInterfaces
{
    public interface IRoleService
    {
        public Task<Roles> getRoles();
    }
}
