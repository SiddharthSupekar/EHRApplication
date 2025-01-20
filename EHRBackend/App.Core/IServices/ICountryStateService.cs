using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.IServices
{
    public interface ICountryStateService
    {
        public Task<List<Country>> getAllCountries();
        public Task<List<State>> getAllStates();
        public Task<List<State>> getStateByCountryId(int countryId);

    }
}
