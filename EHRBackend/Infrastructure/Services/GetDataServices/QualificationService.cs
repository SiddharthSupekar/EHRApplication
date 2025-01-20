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
    public class QualificationService : IQualificationService
    {
        private readonly SqlConnection _connection;
        public QualificationService(IConfiguration configuration)
        {
            _connection = new SqlConnection(configuration.GetConnectionString("EHRConnectionString"));
        }
        public async Task<List<Qualification>> getQualifications()
        {
            var query = "SELECT * FROM Qualifications";

            var qualifications = (List<Qualification>) await _connection.QueryAsync<Qualification>(query);

            return qualifications;
        }
    }
}
