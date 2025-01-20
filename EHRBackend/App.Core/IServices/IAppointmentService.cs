using App.Core.Dto;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.IServices
{
    public interface IAppointmentService
    {
        public Task<List<Appointment>> getAllAppointmentsOfUser(int patientId);
        public Appointment getAppointment(int appointmentId);
        public Task<bool> createAppointment(AppointmentDto aptDto);
        public Task<bool> updateAppointment(int appointmentId, UpdateDto updateDto);
        public Task<bool> updateStatus(int appointmentId, string status);
        public Task<List<User>> getAllProviders();
        public Task<List<User>> getAllPatients();
        public Task<List<ListOfAppointmentDto>> getProvidersForPatient(int patientId);
        public Task<List<CompletedDto>> getProvidersForPatientCompleted(int patientId);
        public Task<List<ListOfAppointmentDto>> getPatientsForProvider(int providerId);
        public Task<List<CompletedDto>> getPatientsForProviderCompleted(int providerId);
    }
}
