import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Stripe, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement, StripeElements, loadStripe } from '@stripe/stripe-js';
import { AppointmentService } from '../../../Services/Appointment/appointment.service';
import { PaymentService } from '../../../Services/Payment/payment.service';
import { RequireddataService } from '../../../Services/RequiredData/requireddata.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import * as bootstrap from 'bootstrap'

@Component({
  selector: 'app-add-appointment-patient',
  standalone:true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-appointment-patient.component.html',
  styleUrl: './add-appointment-patient.component.css'
})
export class AddAppointmentPatientComponent {
  constructor(private requiredData : RequireddataService, 
              private appointmentService : AppointmentService,
              private paymentService: PaymentService,
              private toastr : ToastrService,
              private router : Router
            ){
              const now = new Date();
              this.today = now.toISOString().split('T')[0];
            }


  addAppointment:FormGroup = new FormGroup({
    providerId: new FormControl('',Validators.required),
    patientId : new FormControl(parseInt(sessionStorage.getItem("userId") || '0',10)),
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
  maxTime : string='';
  fee:any;
  roleName:any;
  stripe: Stripe | null = null;  
  elements: StripeElements | null = null;
  cardNumber: StripeCardNumberElement | null = null;
  cardExpiry: StripeCardExpiryElement | null = null;
  cardCvc: StripeCardCvcElement | null = null;
  // todayDate:any = formatDate(new Date(), "yyyy-MM-dd", "en")
  today: string = '';
  minTime: string = '';
  isTimeDisabled: boolean = true;
  navigate:boolean = false;
  cardNumberInvalid = false;
  expiryDateInvalid = false;
  cvcInvalid = false;



   async ngOnInit() {

    await this.initializeStripe();
    this.getSpecializations();
    this.roleName = sessionStorage.getItem('roleName');
    this.getPractitioners() 
  }

  isTimeValid(): boolean {

    const selectedDate = new Date(this.addAppointment.value.appointmentDate);
    const today = new Date();
    if (selectedDate.toDateString() === today.toDateString()) {
      const selectedTime = this.addAppointment.value.appointmentTime;
      const currentTime = today.getHours() + today.getMinutes() / 60;
      const selectedTimeValue = parseInt(selectedTime.split(':')[0]) + parseInt(selectedTime.split(':')[1]) / 60;
      return (selectedTimeValue > (currentTime + 1)  );
    }
    return true;
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

  private async initializeStripe() {
    // Ensure Stripe is loaded with your publishable key
    this.stripe = await loadStripe('pk_test_51QV4OmCGfUPL7xHs9w3gISpwSRaTiXoOVFXKuXgLslYSxxa0F5CzBSX2wVvit9ZcL382AxoNg67S4M6PVSwLz8fn00TFYOJ5Rx');  // Replace with your actual Stripe publishable key

    if (this.stripe) {
      this.elements = this.stripe.elements();
      // Create the individual Stripe elements
      this.cardNumber = this.elements.create('cardNumber');
      this.cardExpiry = this.elements.create('cardExpiry');
      this.cardCvc = this.elements.create('cardCvc');
      
      // Mount each element into its respective div
      this.cardNumber.mount('#card-number');
      this.cardExpiry.mount('#expiry-date');
      this.cardCvc.mount('#cvc');
    } else {
      console.error('Stripe failed to load.');
    }
  }

  // time(){
  //   const date = new Date();
  //   const time = date.toTimeString();
  //   console.log(formatDate(date.toDateString(),"yyyy-MM-dd","en"));  
  //   const dateNow = formatDate(date.toDateString(),"yyyy-MM-dd","en")
    
  //   if(this.addAppointment.get('appointmentDate')?.value === dateNow){
  //     this.maxTime = time;
  //   }
    
  // }
  getFee(){

    const feeData = this.providersCopy.find(
      (f:any)=> f.userId == this.addAppointment.get('providerId')?.value
    )
    this.fee = feeData.visitingCharge
  }

  closeAppointmentModal() {
    const otpModalElement = document.getElementById('appointmentModal');
    if (otpModalElement) {
      const appointmentModalInstance = bootstrap.Modal.getInstance(otpModalElement);
      appointmentModalInstance?.hide();
    }
    
  }
  
  openAppointmentModal() {
    if(this.addAppointment.invalid){
      this.addAppointment.markAllAsTouched()
    }
    if(this.addAppointment.valid){
      const modalElement = document.getElementById('appointmentModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      } 
    }   
  }

  getSpecializations(){
    this.requiredData.getSpecialization().subscribe({
      next:(value:any)=>{
        this.specializations = value
      }
    })
  }
  getPractitioners(){

    this.appointmentService.getAllProviders().subscribe({
      next:(value:any)=>{
        this.providers = value;
        this.providersCopy = value;
      }
    });
  }
  getPatients(){
    this.appointmentService.getAllPatients().subscribe({
      next:(value:any)=>{
        this.patients = value;
        this.patientsCopy = value;
      }
    })
  }
  practitionerForSpecialization(event:any):void{

    const specializationId = parseInt(event?.target.value);
    const practitioners= this.providersCopy.filter(
      (p:any)=> p.specializationId === specializationId
    );
    // practitioners.forEach((practitioner:any) => {
    //   this.practitioners.add(practitioner);
    // });
    // for(let practitioner in practitioners){
    //   this.practitioners.push(practitioner);
    // }
    this.providers = practitioners
    console.log("Hello",this.providers)
  }

  onSubmit(){
    debugger
    if(this.addAppointment.invalid || !this.isTimeValid()){
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
        this.toastr.success("Appointment Added!","Success");
        this.addAppointment.reset();
        // this.router.navigateByUrl("/layout/patient-dashboard")
      }
    })
    }
  }

  async handlePayment(amount: number) {
    debugger
    this.cardNumberInvalid = false;
    this.expiryDateInvalid = false;
    this.cvcInvalid = false;

    // Validate the Stripe card fields
    const cardNumber = this.cardNumber; // Replace with the correct reference to your card input
    const expiryDate = this.cardExpiry; // Replace with your reference for expiry input
    const cvc = this.cardCvc; // Replace with your reference for CVC input

    if (!cardNumber || !expiryDate || !cvc) {
      if (!cardNumber) this.cardNumberInvalid = true;
      if (!expiryDate) this.expiryDateInvalid = true;
      if (!cvc) this.cvcInvalid = true;
      return;
    }
    if (!this.stripe || !this.elements) {
      console.error('Stripe is not loaded properly.');
      return;
    }
    this.paymentService.createPaymentIntent(amount).subscribe({
      next: async (response) => {
        debugger
        const { clientSecret } = response;
        if (this.stripe) {
          const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: this.cardNumber!,
              billing_details: {
                name: 'Customer Name',  // You can collect this dynamically
              },
            },
          });

          if (error) {
            this.toastr.error("Enter card details first")
            console.error('Payment failed:', error.message);
          } else if (paymentIntent?.status === 'succeeded') {
            this.toastr.success("Payment Successfull")
            this.closeAppointmentModal();
            this.onSubmit();
            this.router.navigateByUrl("/layout/patient-dashboard")
          }
        } else {
          console.error('Stripe object is not initialized.');
        }
      },
      error: (err) => {
        this.toastr.error("Enter card details first")
        console.error('Error with payment intent creation:', err);
      },
    });
  }
  isFieldInvalid(fieldName: string): boolean {
    const control = this.addAppointment.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}
