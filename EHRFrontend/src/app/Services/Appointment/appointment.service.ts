import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private aptUrl = 'https://localhost:7187/api/Appointment'

  constructor(private https:HttpClient) { }

  createAppointment(data : any):Observable<any>{
    return this.https.post<any>(`${this.aptUrl}/add-appointment`,data)
  }
  updateAppointment(appointmentId:number,data : any):Observable<any>{
    return this.https.put<any>(`${this.aptUrl}/update-appointment?appointmentId=${appointmentId}`, data);
  }
  updateStatus(appointmentId:any, status:string):Observable<any>{
    return this.https.put<any>(`${this.aptUrl}/update-status?appointmentId=${appointmentId}&status=${status}`, null);
  }
  getAllAppointmentForPatient(patientId:number):Observable<any>{
    return this.https.get<any>(`${this.aptUrl}/patients-practitioner-list?patientId=${patientId}`)
  }
  getAllAppointmentsForProvider(providerId:number):Observable<any>{
    return this.https.get<any>(`${this.aptUrl}/provider-patients-list?providerId=${providerId}`)
  }
  getAllProviders():Observable<any>{
    return this.https.get<any>(`${this.aptUrl}/all-providers`)
  }
  getAllPatients():Observable<any>{
    return this.https.get<any>(`${this.aptUrl}/all-patients`)
  }
  getAllAppointmentForPatientCompleted(patientId:number):Observable<any>{
    return this.https.get<any>(`${this.aptUrl}/patients-practitioner-list-completed?patientId=${patientId}`)
  }
  getAllAppointmentsForProviderCompleted(providerId:number):Observable<any>{
    return this.https.get<any>(`${this.aptUrl}/provider-patients-list-completed?providerId=${providerId}`)
  }

}
