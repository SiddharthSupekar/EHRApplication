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
    public class GenderService : IGenderService
    {
        private readonly SqlConnection _connection;
        public GenderService(IConfiguration configuration)
        {
            _connection = new SqlConnection(configuration.GetConnectionString("EHRConnectionString"));
        }
        public async Task<List<Gender>> getGenders()
        {
            var query = "SELECT * FROM Genders";

            var genders = (List<Gender>)await _connection.QueryAsync<Gender>(query);

            return genders;
        }
    }
}
