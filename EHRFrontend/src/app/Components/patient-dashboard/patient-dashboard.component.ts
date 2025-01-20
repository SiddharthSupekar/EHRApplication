import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { AppointmentService } from '../../Services/Appointment/appointment.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap'
import { LoaderService } from '../../Services/Loader/loader.service';

@Component({
  selector: 'app-patient-dashboard',
  standalone:true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent {

  constructor(private appointmentService : AppointmentService, private loaderService : LoaderService){}

  appointmentData:any
  cancelData:any;
  dataToShow:any;
  showModal:boolean = true
  currentAptId : number = 0
  todayDate:any = formatDate(new Date(), "yyyy-MM-dd", "en")


  updateForm:FormGroup = new FormGroup({
    appointmentDate: new FormControl('',Validators.required),
    appointmentTime : new FormControl('', Validators.required),
    chiefComplaint : new FormControl('', Validators.required)
    
  })

  ngOnInit():void{
    this.getAppointments();
  }

  getAppointments(){
    debugger
    const userId = parseInt(sessionStorage.getItem("userId") || '0',10);
    this.appointmentService.getAllAppointmentForPatient(userId).subscribe({
      next:(value:any)=>{
        this.appointmentData = [];
        this.appointmentData = value;
        console.log(this.appointmentData);
      },
      error:(error:any)=>{
        console.log(error);
        
      }
    })
  }

  onUpdate(appointment:any){
    debugger
    this.openAppointmentModal();
    this.dataToShow = appointment
    this.currentAptId = appointment.appointmentId
    this.updateForm.get('appointmentDate')?.setValue(formatDate(appointment.appointmentDate,"yyyy-MM-dd","en"))
    this.updateForm.get('appointmentTime')?.setValue(appointment.appointmentTime)
    this.updateForm.get('chiefComplaint')?.setValue(appointment.chiefComplaint)
    
  }
  saveChanges(){
    debugger
    if(this.updateForm.invalid){
      this.updateForm.markAllAsTouched()
    }
    if(this.updateForm.valid){

      const dataToSend = {
        appointmentId : this.currentAptId,
        appointmentDate : this.updateForm.get('appointmentDate')?.value,
        appointmentTime : this.updateForm.get('appointmentTime')?.value,
        chiefComplaint : this.updateForm.get('chiefComplaint')?.value,

      }
      this.closeAppointmentModal();

      this.appointmentService.updateAppointment(this.currentAptId, dataToSend).subscribe({
        next:(value:any)=>{
          Swal.fire({
            icon: "success",
            title: "Product deleted successfully",
            showConfirmButton: false,
            timer: 1200
          });
          this.closeAppointmentModal();
          this.getAppointments();
        }
      })
    }
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
  cancelAppointment(appointment:any){
    debugger

    this.appointmentData = this.appointmentData.filter((apt: any) => apt.appointmentId !== appointment.appointmentId);

    this.cancelData = appointment;
    this.cancelData.appointmentStatus = 'Cancelled';
    this.cancelData.patientId = parseInt(sessionStorage.getItem("userId") || '0',10)
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((result) => {
      if (result.isConfirmed) {
        debugger
        this.appointmentService.updateStatus(appointment.appointmentId, this.cancelData.appointmentStatus).subscribe({
          next:(value:any)=>{
            Swal.fire({
              icon: "success",
              title: "Appointment Cancelled successfully",
              showConfirmButton: false,
              timer: 1200
            });
            this.getAppointments();

            
          },
          error: (error: any) => {
            Swal.fire({
              icon: "error",
              title: "Something went wrong",
              text: error.message
            });
          }
        })
      }
    }) 
  }
  isFieldInvalid(fieldName: string): boolean {
    const control = this.updateForm.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}
