using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.IServices
{
    public interface ISOAPService
    {
        public Task<bool> addSoapNotes(SOAPNotes sOAPNotes);
        public Task<SOAPNotes> getSoapNotes(int appointmentId);


    }
}
