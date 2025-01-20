using App.Core.IServices.GetDataInterfaces;
using Dapper;
using Domain;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services.GetDataServices
{
    public class RolesService 
    {
        private readonly SqlConnection _connection;
        private readonly IConfiguration _configuration;

        public RolesService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        //public Task<Roles> getRoles()
        //{
        //    var query = "SELECT * FROM Roles";

        //    var role = (List<Roles>)await _connection.QueryAsync<Roles>(query);

        //    return role;
        //}
    }
}
