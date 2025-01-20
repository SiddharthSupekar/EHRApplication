import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../Services/Appointment/appointment.service';
import { CommonModule, formatDate } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import { SoapService } from '../../Services/SOAP/soap.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-provider-dashboard',
  standalone:true,
  imports: [RouterLink,CommonModule, ReactiveFormsModule],
  templateUrl: './provider-dashboard.component.html',
  styleUrl: './provider-dashboard.component.css'
})
export class ProviderDashboardComponent {

  constructor(private appointmentService : AppointmentService, private soapService : SoapService, private toastr : ToastrService){}

  appointmentData:any
  cancelData:any;
  dataToShow:any;
  showModal:boolean = true
  status : string = ''
  todayDate:any = formatDate(new Date(), "yyyy-MM-dd", "en")


  updateForm: FormGroup = new FormGroup({
    subjective: new FormControl('', Validators.required),
    objective: new FormControl('', Validators.required),
    assessment: new FormControl('', Validators.required),
    plan: new FormControl('', Validators.required)
  });
  
  
  ngOnInit():void{
    this.getAppointmentsForProvider();
  }

  showSOAPNotes: boolean = false;

onStatusChange() {
  this.updateForm.get('appointmentStatus')?.setValue('Completed');
  this.showSOAPNotes = true;
}


  getAppointmentsForProvider(){
    debugger
    const userId = parseInt(sessionStorage.getItem("userId") || '0',10);
    this.appointmentService.getAllAppointmentsForProvider(userId).subscribe({
      next:(value:any)=>{
        debugger
        this.appointmentData = value;
        console.log(this.appointmentData.length);
        
      },
      error:(error:any)=>{
        console.log(error);
        
      }
    })
  }

  

  onUpdate(appointment: any) {
    this.openAppointmentModal();
    this.dataToShow = appointment;
  
    // this.updateForm.patchValue({
    //   appointmentStatus: appointment.appointmentStatus,
    //   subjective: appointment.subjective || '',
    //   objective: appointment.objective || '',
    //   assessment: appointment.assessment || '',
    //   plan: appointment.plan || ''
    // });
   // Trigger SOAP notes visibility
  }
  

  saveChanges() {
    debugger
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }
    debugger
    const status = this.updateForm.get('appointmentStatus')?.value;
  
    const dataToSend: any = {
      appointmentId: this.dataToShow.appointmentId,
      status: status
    };
  
    // Add SOAP notes if status is "Completed"
    if (status === 'Completed') {
      dataToSend.subjective = this.updateForm.get('subjective')?.value;
      dataToSend.objective = this.updateForm.get('objective')?.value;
      dataToSend.assessment = this.updateForm.get('assessment')?.value;
      dataToSend.plan = this.updateForm.get('plan')?.value;
    }
  
    this.appointmentService.updateAppointment(this.appointmentData.appointmentId, dataToSend).subscribe({//check this one out because in here have to make changes for SOAP notes
      next: (response: any) => {
        Swal.fire({
          icon: "success",
          title: "Appointment updated successfully",
          showConfirmButton: false,
          timer: 1200
        });
        this.closeAppointmentModal();
        this.getAppointmentsForProvider(); // Refresh appointments
      },
      error: (error: any) => {
        console.error("Error updating appointment:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to update appointment",
          text: error.message || "Something went wrong!",
        });
      }
    });
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

  onComplete(appointmentId:number){
    if(this.updateForm.invalid){
      this.updateForm.markAllAsTouched()
    }
    else{
      const soapData = {...this.updateForm.value}
      soapData.appointmentId = appointmentId
      this.soapService.addSoap(soapData).subscribe({
        next:(value:any)=>{
          this.toastr.success("SOAP notes added")
          this.appointmentService.updateStatus(appointmentId, "Completed").subscribe({
            next:(value:any)=>{
              Swal.fire({
                icon:"success",
                title:"Saved",
                timer:2000
              })
              this.closeAppointmentModal();
              this.getAppointmentsForProvider();
            },
            error:(error:any)=>{
              this.toastr.error("could not update")
            }
          })
        },
        error:(error:any)=>{
          this.toastr.error("Could not add soap notes");
        }
      })
    }
    
  }

  cancelAppointment(appointment:any){
    debugger
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
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        debugger
        this.appointmentService.updateStatus(appointment.appointmentId, "Cancelled").subscribe({
          next:(value:any)=>{
            Swal.fire({
              icon: "success",
              title: "Appointment Cancelled successfully",
              showConfirmButton: false,
              timer: 1200
            });
            this.getAppointmentsForProvider();
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
