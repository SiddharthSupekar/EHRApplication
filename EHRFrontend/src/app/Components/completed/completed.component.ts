import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from '../../Services/Appointment/appointment.service';
import { SoapService } from '../../Services/SOAP/soap.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap'

@Component({
  selector: 'app-completed',
  standalone:true,
  imports: [DatePipe,ReactiveFormsModule,CommonModule],
  templateUrl: './completed.component.html',
  styleUrl: './completed.component.css'
})
export class CompletedComponent {

  showModal:boolean = true
  appointments:any;
  dataToShow:any;
  currentAptId:number = 0;
  roleName:string ='';
  soapData:any;

  constructor(private appointmentService : AppointmentService, private soapService : SoapService, private toastr : ToastrService){}

  ngOnInit():void{
    this.roleName = sessionStorage.getItem("roleName")||''
    if(this.roleName === 'Patient'){
      this.getCompletedForPatient();
    }
    if(this.roleName === 'Practitioner'){
      this.getCompletedForProvider();
    }
  }

  getCompletedForProvider(){
    const userId = parseInt(sessionStorage.getItem("userId") || '0');
    this.appointmentService.getAllAppointmentsForProviderCompleted(userId).subscribe({
      next:(value:any)=>{
        this.appointments = value
      }
    })

  }
  getCompletedForPatient(){
    const userId = parseInt(sessionStorage.getItem("userId") || '0');
    this.appointmentService.getAllAppointmentForPatientCompleted(userId).subscribe({
      next:(value:any)=>{
        this.appointments = value
      }
    })

  }

  onUpdate(appointment:any){
    debugger
    this.dataToShow = appointment
    this.currentAptId = appointment.appointmentId
    this.getSoaps(this.currentAptId);
    this.openAppointmentModal();
    

    
  }
  getSoaps(appointmentId:number):void{
    this.soapService.getSoap(appointmentId).subscribe({
      next:(value:any)=>{
        this.soapData = value
      }
    })
  }
  closeAppointmentModal() {
    const otpModalElement = document.getElementById('appointmentModal');
    if (otpModalElement) {
      const appointmentModalInstance = bootstrap.Modal.getInstance(otpModalElement);
      appointmentModalInstance?.hide();
    }
    console.log(this.showModal);
    
  }
  
  openAppointmentModal() {
    const modalElement = document.getElementById('appointmentModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
    console.log(this.showModal);
    
  }

}
