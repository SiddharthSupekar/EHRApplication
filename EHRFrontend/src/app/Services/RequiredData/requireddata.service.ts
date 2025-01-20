import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequireddataService {

  constructor(private https : HttpClient) { }

  private dataUrl = "https://localhost:7187/api/Data"

  getSpecialization():Observable<any>{
    return this.https.get<any>(`${this.dataUrl}/specializations`)
  }
  getQualification():Observable<any>{
    return this.https.get<any>(`${this.dataUrl}/qualifications`)
  }
  getGender():Observable<any>{
    return this.https.get<any>(`${this.dataUrl}/genders`)
  }
  getBloodGroup():Observable<any>{
    return this.https.get<any>(`${this.dataUrl}/bloodGroups`)
  }
  

}
