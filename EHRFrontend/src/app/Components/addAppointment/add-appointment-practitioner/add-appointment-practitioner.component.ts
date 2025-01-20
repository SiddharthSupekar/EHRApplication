import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Stripe, StripeElements, loadStripe } from '@stripe/stripe-js';
import { AppointmentService } from '../../../Services/Appointment/appointment.service';
import { PaymentService } from '../../../Services/Payment/payment.service';
import { RequireddataService } from '../../../Services/RequiredData/requireddata.service';
import { ToastrService } from 'ngx-toastr';
import { Route, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-appointment-practitioner',
  standalone:true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-appointment-practitioner.component.html',
  styleUrl: './add-appointment-practitioner.component.css'
})
export class AddAppointmentPractitionerComponent {
  constructor(private requiredData : RequireddataService, 
              private appointmentService : AppointmentService,
              private paymentService: PaymentService,
              private toastr: ToastrService,
              private router : Router
            ){
              const now = new Date();
              this.today = now.toISOString().split('T')[0];
            }


  addAppointment:FormGroup = new FormGroup({
    providerId: new FormControl(parseInt(sessionStorage.getItem("userId") || '0',10)),
    patientId : new FormControl('', Validators.required),
    appointmentDate : new FormControl('',Validators.required),
    appointmentTime : new FormControl('',Validators.required),
    chiefComplaint : new FormControl('',Validators.required),
    appointmentStatus : new FormControl('Scheduled'),
    fee:new FormControl('')
  });

  specializations : any;
  providers:any;
  providersCopy:any;
  patients:any;
  patientsCopy:any;
  maxTime : any;
  fee:any;
  roleName:any;
  stripe: Stripe | null = null;  
  elements: StripeElements | null = null;
  card: any;
  todayDate:any = formatDate(new Date(), "yyyy-MM-dd", "en")
  minTime: string = '';
  today: string = '';




  ngOnInit() {
    debugger
    this.getPatients();
  }
  time(){
    const date = new Date();
    const time = date.toTimeString();
    console.log(formatDate(date.toDateString(),"yyyy-MM-dd","en"));  
    const dateNow = formatDate(date.toDateString(),"yyyy-MM-dd","en")
    
    if(this.addAppointment.get('appointmentDate')?.value === dateNow){
      this.maxTime = time;
    }
    
  }
  isTimeValid(): boolean {
    debugger
    const selectedDate = new Date(this.addAppointment.value.appointmentDate);
    const today = new Date();
    if (selectedDate.toDateString() === today.toDateString()) {
      const selectedTime = this.addAppointment.value.appointmentTime;
      const currentTime = today.getHours() + today.getMinutes() / 60;
      const selectedTimeValue = parseInt(selectedTime.split(':')[0]) + parseInt(selectedTime.split(':')[1]) / 60;
      return (selectedTimeValue > (currentTime + 1)  );
    }
    return true
  }
  // onDateChange(event: Event) {
  //   const selectedDate = (event.target as HTMLInputElement).value;
  //   const today = new Date().toISOString().split('T')[0];
  //   if (selectedDate === today) { 
  //     const now = new Date();
  //     const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
  //     this.minTime = nextHour.toTimeString().slice(0, 5); // Format HH:mm
  //     this.maxTime = '18:00'
  //   } else {

  //     this.minTime = '09:00';
  //     this.maxTime = '18:00';

  //   }
  // }
  onDateChange(event: any) {
    const selectedDate = event.target.value;
    const today = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

    if (selectedDate === today) {
      // If today is selected, set the time min to current time
      const currentTime = new Date();
      const hours = String(currentTime.getHours()).padStart(2, '0');
      const minutes = String(currentTime.getMinutes()).padStart(2, '0');
      this.minTime = `${hours}:${minutes}`;
    } else {
      this.minTime = '09:00';
      this.maxTime = '18:00'; // Reset timeMin to allow any time for future dates
    }
  }

  // getFee(){
  //   debugger
  //   const feeData = this.providersCopy.find(
  //     (f:any)=> f.userId == this.addAppointment.get('providerId')?.value
  //   )
  //   this.fee = feeData.visitingCharge
  // }

  getPatients(){
    debugger
    this.appointmentService.getAllPatients().subscribe({
      next:(value:any)=>{
        this.patients = value;
        this.patientsCopy = value;
        console.log(this.patients);
        
      }
    })
  }

  onSubmit(){
    debugger
    if(this.addAppointment.invalid){
      this.addAppointment.markAllAsTouched()
    }
    if(this.addAppointment.valid){
      const userId = parseInt(sessionStorage.getItem("userId") || '0' , 10);

    const formData = this.addAppointment.value
    const providerId = formData.providerId
    // const providerFee = formData.find(
    //   (f:any)=> f.providerId === providerId
    // );
    formData.fee = this.fee;
    this.appointmentService.createAppointment(formData).subscribe({
      next:(value:any)=>{
        debugger
        this.toastr.success("Appointment Added!");
        this.addAppointment.reset();
        this.router.navigateByUrl("/layout/practitioner-dashboard")
      },
      error:(error:any)=>{
          Swal.fire({
            icon:'error',
            title:'Invalid Time',
            timer:1500,
            showCancelButton:false,
            showConfirmButton:false
          })
      }
    })
    }
  }
  isFieldInvalid(fieldName: string): boolean {
    const control = this.addAppointment.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}
