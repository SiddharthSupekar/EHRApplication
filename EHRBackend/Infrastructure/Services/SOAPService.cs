using App.Core.IServices;
using Domain;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class SOAPService : ISOAPService
    {
        private readonly AppDbContext _appDbContext;
        private readonly SqlConnection _connection;
        private readonly IConfiguration _configuration;

        public SOAPService(AppDbContext appDbContext, IConfiguration configuration)
        {
            _appDbContext = appDbContext;
            _connection = new SqlConnection(configuration.GetConnectionString("EHRConnectionString"));
        }

        public async Task<bool> addSoapNotes(SOAPNotes sOAPNotes)
        {
            _appDbContext.SOAPNotes.AddAsync(sOAPNotes);
            _appDbContext.SaveChangesAsync();
            return true;
        }
        public async Task<SOAPNotes> getSoapNotes(int appointmentId)
        {
            var notes = await _appDbContext.SOAPNotes.FirstOrDefaultAsync(s => s.appointmentId == appointmentId);
            return notes;
        }
    }
}
