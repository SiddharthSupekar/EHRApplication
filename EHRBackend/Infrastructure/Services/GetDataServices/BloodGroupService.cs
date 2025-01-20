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
    public class BloodGroupService : IBloodGroupService
    {
        private readonly SqlConnection _connection;
        public BloodGroupService(IConfiguration configuration)
        {
            _connection = new SqlConnection(configuration.GetConnectionString("EHRConnectionString"));
        }
        public async Task<List<BloodGroup>> getBloodGroups()
        {
            var query = "SELECT * FROM BloodGroups";

            var bloodGroups = (List<BloodGroup>)await _connection.QueryAsync<BloodGroup>(query);

            return bloodGroups;
        }
    }
}
