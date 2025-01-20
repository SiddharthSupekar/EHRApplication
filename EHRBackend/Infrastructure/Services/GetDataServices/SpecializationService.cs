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
    public class SpecializationService : ISpecializationService
    {
        private readonly AppDbContext _appDbContext;
        private readonly SqlConnection _connection;
        private readonly IConfiguration _configuration;

        public SpecializationService(AppDbContext appDbContext, IConfiguration configuration)
        {
            _appDbContext = appDbContext;
            _connection = new SqlConnection(configuration.GetConnectionString("EHRConnectionString"));
        }

        public async Task<List<Specialization>> getSpecializations()
        {
            var query = "SELECT * FROM Specializations";

            var specializations = (List<Specialization>) await _connection.QueryAsync<Specialization>(query);

            return specializations;
        }
    }
}
