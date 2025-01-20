import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountrystateService {

  constructor(private https : HttpClient) { }

  private countrystateUrl = "https://localhost:7187/api/CountryState";

  getCountries():Observable<any>{
    return this.https.get<any>(`${this.countrystateUrl}/countries`)
  }
  getStateByCountryId(countryId:number|string):Observable<any>{
    return this.https.get<any>(`${this.countrystateUrl}/country/states?countryId=${countryId}`)
  }
}
