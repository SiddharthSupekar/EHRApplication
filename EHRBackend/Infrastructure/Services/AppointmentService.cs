using App.Core.Dto;
using App.Core.IServices;
using Dapper;
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
    public class AppointmentService : IAppointmentService
    {
        private readonly AppDbContext _appDbContext;
        private readonly SqlConnection _connection;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AppointmentService( IConfiguration configuration, AppDbContext appDbContext, IEmailService emailService)
        {
            _connection = new SqlConnection(configuration.GetConnectionString("EHRConnectionString"));
            _appDbContext = appDbContext;
            _emailService = emailService;
        }

        public async Task<List<Appointment>> getAllAppointmentsOfUser(int patientId)
        {
            var query = "SELECT * FROM APPOINTMENTS WHERE USERID = @userId";
            var appt = await _connection.QueryFirstOrDefaultAsync<List<Appointment>>(query, new {userId = patientId});
            return appt;
        }

        public async Task<bool> createAppointment( AppointmentDto aptDto)
        {
            var apt = new Appointment
            {
                patientId = aptDto.patientId,
                providerId = aptDto.providerId,
                appointmentDate = aptDto.appointmentDate,
                appointmentTime = aptDto.appointmentTime,
                chiefComplaint = aptDto.chiefComplaint,
                appointmentStatus = aptDto.appointmentStatus,
                fee = aptDto.fee
            };

            await _appDbContext.Appointments.AddAsync(apt);
            _appDbContext.SaveChanges();

            var provider = await _appDbContext.Users.FirstOrDefaultAsync(u=> u.userId == apt.providerId);
            var patient = await _appDbContext.Users.FirstOrDefaultAsync(u=> u.userId == apt.patientId);


            string emailSubject = "Appointment Saved";
            string patientMessage = $"Hi {patient.firstName},<br><br>Your appointment has been successfully set with Dr. {provider.firstName} {provider.lastName} on {aptDto.appointmentDate.ToShortDateString} at ${aptDto.appointmentTime}";
            string providerMessage = $"Hi Dr.{provider.firstName} {provider.lastName},<br><br> You have a new appointment scheduled with {patient.firstName} {patient.lastName} on {aptDto.appointmentDate.ToShortDateString} at ${aptDto.appointmentTime} ";

            _emailService.SendEmail(patient.email, emailSubject, patientMessage);
            _emailService.SendEmail(provider.email, emailSubject, providerMessage);

            return true;


        }

        public async Task<List<User>> getAllProviders()
        {
            var query = "SELECT * FROM USERS WHERE ROLEID = 1";
            var providers = (List<User>)  await _connection.QueryAsync<User>(query);
            return providers ;
        }

        public async Task<List<User>> getAllPatients()
        {
            var query = "SELECT * FROM USERS WHERE ROLEID = 2";
            var patients = (List<User>)await _connection.QueryAsync<User>(query);
            return patients ;
        }

        //public async Task<User> searchUser()
        //{

        //}
        public async Task<List<ListOfAppointmentDto>> getProvidersForPatient(int patientId)
        {
            if(await _appDbContext.Users.FirstOrDefaultAsync(a=>a.userId == patientId) == null)
            {
                return null;
            }
            //var query = "select APT.AppointmentId,U.firstName, U.lastName, APT.appointmentDate, APT.AppointmentTime,APT.appointmentStatus, APT.fee FROM Appointments APT LEFT JOIN Users U ON APT.providerId = U.USERID WHERE APT.patientId = @patientId";
            //var providers = (List<ListOfAppointmentDto>) await _connection.QueryAsync<ListOfAppointmentDto>(query, new { patientId = patientId });
            var apts = new List<ListOfAppointmentDto>();
            var scheduledApts =await  _appDbContext.Appointments.Where(a => a.patientId == patientId && a.appointmentStatus == "Scheduled")
                                                                .OrderBy(a=> a.appointmentDate)
                                                                .ThenBy(a=> a.appointmentTime)
                                                                .ToListAsync();
            foreach(var apt in scheduledApts)
            {
                var userData = await _appDbContext.Users.Where(u => u.userId == apt.providerId).FirstOrDefaultAsync();
                var specialization = await _appDbContext.Specializations.FirstOrDefaultAsync(s => s.specializationId == userData.specializationId);
                //var providerName = userData.firstName + ' ' + userData.lastName;
                apts.Add(new ListOfAppointmentDto
                {
                    appointmentId = apt.appointmentId,
                    appointmentDate = apt.appointmentDate,
                    appointmentTime = apt.appointmentTime,
                    firstName = userData.firstName,
                    lastName = userData.lastName,
                    appointmentStatus = apt.appointmentStatus,
                    chiefComplaint = apt.chiefComplaint,
                    specializationName = specialization.specializationName,
                    providerId = userData.userId,
                    fee = apt.fee,
                    profileImage = userData.profileImage
                   

                });
            }

            return apts;
        }
         
public async Task<List<ListOfAppointmentDto>> getPatientsForProvider(int providerId)
        {
            if (await _appDbContext.Users.FirstOrDefaultAsync(a => a.userId == providerId) == null)
            {
                return null;
            }
            //var query = "select APT.AppointmentId,U.firstName, U.lastName, APT.appointmentDate, APT.AppointmentTime,APT.appointmentStatus, APT.fee FROM Appointments APT LEFT JOIN Users U ON APT.providerId = U.USERID WHERE APT.patientId = @patientId";
            //var providers = (List<ListOfAppointmentDto>) await _connection.QueryAsync<ListOfAppointmentDto>(query, new { patientId = patientId });
            var apts = new List<ListOfAppointmentDto>();
            var scheduledApts = await _appDbContext.Appointments.Where(a => a.providerId == providerId && a.appointmentStatus == "Scheduled")
                                                                .OrderBy(a => a.appointmentDate)
                                                                .ThenBy(a => a.appointmentTime)
                                                                .ToListAsync();

            foreach (var apt in scheduledApts)
            {
                var userData = await _appDbContext.Users.Where(u => u.userId == apt.patientId).FirstOrDefaultAsync();
                
                //var providerName = userData.firstName + ' ' + userData.lastName;
                apts.Add(new ListOfAppointmentDto
                {
                    appointmentId = apt.appointmentId,
                    appointmentDate = apt.appointmentDate,
                    appointmentTime = apt.appointmentTime,
                    firstName = userData.firstName,
                    lastName = userData.lastName,
                    patientId = userData.userId,
                    appointmentStatus = apt.appointmentStatus,
                    chiefComplaint = apt.chiefComplaint,
                    fee = apt.fee,
                    profileImage = userData.profileImage

                });
            }

            return apts;
        }

        public async Task<List<CompletedDto>> getProvidersForPatientCompleted(int patientId)
        {
            if(await _appDbContext.Users.FirstOrDefaultAsync(a=>a.userId == patientId) == null)
            {
                return null;
            }
            //var query = "select APT.AppointmentId,U.firstName, U.lastName, APT.appointmentDate, APT.AppointmentTime,APT.appointmentStatus, APT.fee FROM Appointments APT LEFT JOIN Users U ON APT.providerId = U.USERID WHERE APT.patientId = @patientId";
            //var providers = (List<ListOfAppointmentDto>) await _connection.QueryAsync<ListOfAppointmentDto>(query, new { patientId = patientId });
            var apts = new List<CompletedDto>();
            var scheduledApts =await  _appDbContext.Appointments.Where(a => a.patientId == patientId && a.appointmentStatus == "Completed" || a.appointmentStatus == "Cancelled")
                                                                .OrderBy(a=> a.appointmentDate)
                                                                .ThenBy(a=> a.appointmentTime)
                                                                .ToListAsync();
            foreach(var apt in scheduledApts)
            {
                var userData = await _appDbContext.Users.Where(u => u.userId == apt.providerId).FirstOrDefaultAsync();
                var soapNotes = await _appDbContext.SOAPNotes.Where(s => s.appointmentId == apt.appointmentId).FirstOrDefaultAsync();
                var specialization = await _appDbContext.Specializations.Where(s => s.specializationId == userData.specializationId).FirstOrDefaultAsync();
                var specializationName = specialization.specializationName;
                //var providerName = userData.firstName + ' ' + userData.lastName;
                apts.Add(new CompletedDto
                {
                    appointmentId = apt.appointmentId,
                    appointmentDate = apt.appointmentDate,
                    appointmentTime = apt.appointmentTime,
                    firstName = userData.firstName,
                    lastName = userData.lastName,
                    appointmentStatus = apt.appointmentStatus,
                    chiefComplaint = apt.chiefComplaint,
                    profileImage = userData.profileImage,
                    specializationName = specializationName,



                });
            }

            return apts;
        }
        public async Task<List<CompletedDto>> getPatientsForProviderCompleted(int providerId)
        {
            if (await _appDbContext.Users.FirstOrDefaultAsync(a => a.userId == providerId) == null)
            {
                return null;
            }
            //var query = "select APT.AppointmentId,U.firstName, U.lastName, APT.appointmentDate, APT.AppointmentTime,APT.appointmentStatus, APT.fee FROM Appointments APT LEFT JOIN Users U ON APT.providerId = U.USERID WHERE APT.patientId = @patientId";
            //var providers = (List<ListOfAppointmentDto>) await _connection.QueryAsync<ListOfAppointmentDto>(query, new { patientId = patientId });
            var apts = new List<CompletedDto>();
            var scheduledApts = await _appDbContext.Appointments.Where(a => a.providerId == providerId && (a.appointmentStatus == "Completed" || a.appointmentStatus == "Cancelled" ))
                                                                .OrderBy(a => a.appointmentDate)
                                                                .ThenBy(a => a.appointmentTime)
                                                                .ToListAsync();

            foreach (var apt in scheduledApts)
            {
                var userData = await _appDbContext.Users.Where(u => u.userId == apt.patientId).FirstOrDefaultAsync();
                var soapNotes =  _appDbContext.SOAPNotes.Where(s=> s.appointmentId == apt.appointmentId).FirstOrDefault();

                //var providerName = userData.firstName + ' ' + userData.lastName;
                apts.Add(new CompletedDto
                {
                    appointmentId = apt.appointmentId,
                    appointmentDate = apt.appointmentDate,
                    appointmentTime = apt.appointmentTime,
                    firstName = userData.firstName,
                    lastName = userData.lastName,
                    appointmentStatus = apt.appointmentStatus,
                    chiefComplaint = apt.chiefComplaint,
                    profileImage = userData.profileImage,
                   

                });
            }

            return apts;
        }



        public Appointment getAppointment(int appointmentId)
        {
            var appoitnment =  _appDbContext.Appointments.FirstOrDefault(a => a.appointmentId == appointmentId);
            return appoitnment;
        }

        public async Task<bool> updateAppointment(int appointmentId, UpdateDto updateDto)
        {
            var appointment = await _appDbContext.Appointments.FirstOrDefaultAsync(a => a.appointmentId == appointmentId);
            appointment.appointmentDate = updateDto.appointmentDate;
            appointment.appointmentTime = updateDto.appointmentTime;
            appointment.chiefComplaint = updateDto.chiefComplaint;

            _appDbContext.Appointments.Update(appointment);
            await _appDbContext.SaveChangesAsync();
            var appointmentData = await _appDbContext.Appointments.FirstOrDefaultAsync(a => a.appointmentId == appointmentId);

            var providerId = appointmentData.providerId;
            var patientId = appointmentData.patientId;

            var provider = await _appDbContext.Users.FirstOrDefaultAsync(u => u.userId ==providerId);
            var patient = await _appDbContext.Users.FirstOrDefaultAsync(u => u.userId == patientId);


            string emailSubject = "Appointment Update";
            string patientMessage = $"Hi {patient.firstName},<br><br>Your appointment has been successfully updatded and set with Dr. {provider.firstName} {provider.lastName} on {updateDto.appointmentDate.ToShortDateString} at ${updateDto.appointmentTime}";
            string providerMessage = $"Hi Dr.{provider.firstName} {provider.lastName},<br><br> Your appointment scheduled with {patient.firstName} {patient.lastName} has been scheduled on {updateDto.appointmentDate.ToShortDateString} at ${updateDto.appointmentTime} ";

            _emailService.SendEmail(patient.email, emailSubject, patientMessage);
            _emailService.SendEmail(provider.email, emailSubject, providerMessage);



            return true;
        }

        public async Task<bool> updateStatus(int appointmentId, string status)
        {
            var appointment = await _appDbContext.Appointments.FirstOrDefaultAsync(a => a.appointmentId == appointmentId);
            appointment.appointmentStatus = status;


            _appDbContext.Appointments.Update(appointment);
            await _appDbContext.SaveChangesAsync();

            var appointmentData = await _appDbContext.Appointments.FirstOrDefaultAsync(a => a.appointmentId == appointmentId);

            var providerId = appointmentData.providerId;
            var patientId = appointmentData.patientId;

            var provider = await _appDbContext.Users.FirstOrDefaultAsync(u => u.userId == providerId);
            var patient = await _appDbContext.Users.FirstOrDefaultAsync(u => u.userId == patientId);


            string emailSubject = "Appointment Update";
            string patientMessage = $"Hi {patient.firstName},<br><br>Your appointment has been successfully {status} with Dr. {provider.firstName} {provider.lastName}";
            string providerMessage = $"Hi Dr.{provider.firstName} {provider.lastName},<br><br> Your appointment  with {patient.firstName} {patient.lastName} has been {status} ";

            _emailService.SendEmail(patient.email, emailSubject, patientMessage);
            _emailService.SendEmail(provider.email, emailSubject, providerMessage);

            return true;

        }

    }
}