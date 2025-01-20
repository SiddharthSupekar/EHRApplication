import { CommonModule, formatDate, Time } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequireddataService } from '../../Services/RequiredData/requireddata.service';
import { AppointmentService } from '../../Services/Appointment/appointment.service';
import { Stripe, StripeElements, loadStripe } from '@stripe/stripe-js';
import { PaymentService } from '../../Services/Payment/payment.service';

@Component({
  selector: 'app-add-appointment',
  standalone:true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.css'
})
export class AddAppointmentComponent {

  constructor(private requiredData : RequireddataService, private appointmentService : AppointmentService,private paymentService: PaymentService){}


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
  maxTime : any;
  fee:any;
  roleName:any;
  stripe: Stripe | null = null;  
  elements: StripeElements | null = null;
  card: any;

  async ngOnInit() {
    debugger
    await this.initializeStripe();
    this.getSpecializations();
    this.roleName = sessionStorage.getItem('roleName');
    if(this.roleName === 'Practitioner'){
      this.getPatients();
    }
    if(this.roleName === 'Patient'){
      this.getPractitioners();
    }
  }

  private async initializeStripe() {
    // Ensure Stripe is loaded with your publishable key
    this.stripe = await loadStripe('pk_test_51QV4OmCGfUPL7xHs9w3gISpwSRaTiXoOVFXKuXgLslYSxxa0F5CzBSX2wVvit9ZcL382AxoNg67S4M6PVSwLz8fn00TFYOJ5Rx');  // Replace with your actual Stripe publishable key

    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card');
      this.card.mount('#card-element');
    } else {
      console.error('Stripe failed to load.');
    }
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
  getFee(){
    debugger
    const feeData = this.providersCopy.find(
      (f:any)=> f.userId == this.addAppointment.get('providerId')?.value
    )
    this.fee = feeData.visitingCharge
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
    const userId = parseInt(sessionStorage.getItem("userId") || '0' , 10);

    const formData = this.addAppointment.value
    const providerId = formData.providerId
    // const providerFee = formData.find(
    //   (f:any)=> f.providerId === providerId
    // );
    formData.fee = this.fee;
    this.appointmentService.createAppointment(formData).subscribe({
      next:(value:any)=>{
        alert("booked");
      }
    })
  }

  async handlePayment(amount: number) {
    debugger
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
              card: this.card,
              billing_details: {
                name: 'Customer Name',  // You can collect this dynamically
              },
            },
          });

          if (error) {
            console.error('Payment failed:', error.message);
          } else if (paymentIntent?.status === 'succeeded') {
            console.log('Payment successful!', paymentIntent);
            this.onSubmit();
          }
        } else {
          console.error('Stripe object is not initialized.');
        }
      },
      error: (err) => {
        console.error('Error with payment intent creation:', err);
      },
    });
  }

}
