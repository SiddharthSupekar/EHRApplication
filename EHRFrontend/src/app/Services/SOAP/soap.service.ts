import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoapService {

  private url = 'https://localhost:7187/api/SOAP'

  constructor(private https : HttpClient) { }

  getSoap(appointmentId : number):Observable<any>{
    return this.https.get<any>(`${this.url}/get-soap?appointmentId=${appointmentId}`)
  }
  addSoap(data:any):Observable<any>{
    return this.https.post<any>(`${this.url}/add-soap`,data)
  }
}
