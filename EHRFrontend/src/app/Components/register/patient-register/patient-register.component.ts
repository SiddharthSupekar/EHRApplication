import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CountrystateService } from '../../../Services/CountryState/countrystate.service';
import { RegisterService } from '../../../Services/Register/register.service';
import { RequireddataService } from '../../../Services/RequiredData/requireddata.service';
import { customEmailValidator } from '../emailValidator';
import { CommonModule, formatDate } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2'
import { PhoneDirective } from '../../../Directives/PhoneDirective/phone.directive';

@Component({
    selector: 'app-patient-register',
    standalone:true,
    imports: [ReactiveFormsModule, CommonModule, RouterLink, PhoneDirective ],
    templateUrl: './patient-register.component.html',
    styleUrl: './patient-register.component.css'
})
export class PatientRegisterComponent {

  bloodGroups:any;
  genders:any;
  selectedFile: File | null = null;
  countryData:any;
  filteredStateData:any
  todayDate:any = formatDate(new Date(), "yyyy-MM-dd", "en")


  constructor(
    private registerService: RegisterService, 
    private countrystateService: CountrystateService,
    private requiredData : RequireddataService,
    private router : Router
  ) {}

    patientRegisterForm = new FormGroup({
    firstName: new FormControl('', [Validators.required,Validators.maxLength(20)]),
    lastName: new FormControl('',  [Validators.required,Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, customEmailValidator()]),
    mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    roleId: new FormControl(2),
    dob: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    countryId: new FormControl('', Validators.required),
    stateId: new FormControl('', Validators.required),
    city:new FormControl('',Validators.required),
    pincode: new FormControl('', Validators.required),
    genderId : new FormControl('',Validators.required),
    bloodGroupId : new FormControl('',Validators.required),
  });

  ngOnInit():void{
    this.getCountries();
    this.getBloodGroup();
    this.getGender();
  }

  getBloodGroup():void{
    this.requiredData.getBloodGroup().subscribe(
      {
        next:(value:any)=>{
          this.bloodGroups = value;
          console.log(this.bloodGroups);
          
        },
        error:(error:any)=>{
          console.log((error.status));
          
        }
      }
    )
  }

  getGender():void{
    this.requiredData.getGender().subscribe({
      next:(value:any)=>{
        this.genders = value;
      },
      error:(error:any)=>{
        console.log(error);
        
      }
    })
  }
  getCountries(): void {
    this.countrystateService.getCountries().subscribe({
      next: (value: any) => {
        this.countryData = value;
        console.log(this.countryData);
      },
      error: (error: any) => {
        console.error(error.status);
      }
    });
  }

  onCountryChange(): void {
    debugger
    const selectedCountry = this.patientRegisterForm.get('countryId')?.value;
    if (selectedCountry) {
      this.countrystateService.getStateByCountryId(selectedCountry).subscribe({
        next: (value: any) => {
          this.filteredStateData = value;
          console.log(this.filteredStateData);
          
        },
        error: (error: any) => {
          console.error(error);
        }
      });
    }
  }

  onSubmit(){
    if (this.patientRegisterForm.invalid) {
      // this.submissionMessage = 'Please fill all required fields.';
      this.patientRegisterForm.markAllAsTouched();
    }

    if(this.patientRegisterForm.valid){
      debugger
      const formData = new FormData();
    Object.keys(this.patientRegisterForm.controls).forEach((key) => {
      formData.append(key, this.patientRegisterForm.get(key)?.value as string);
    });



    console.log("Checking data",formData.get("countryId"),formData.get("stateId"))

    // Add the image file if selected
    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile, this.selectedFile.name);
    }

    console.log('FormData to be submitted:', formData);

    // Call the backend API
    this.registerService.postUser(formData).subscribe({
      next: (value: any) => {
        debugger;
        Swal.fire({
          icon: "success",
          title: "Registered Successfully",
          text: "Your login details will be sent to your registered email address",
          showConfirmButton: false,
          timer: 2000
        });
        console.log(value);
        const cartId = value;
        this.router.navigateByUrl('/login');
      },
      error: (error: any) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text:"Entered email address already exists",
          showConfirmButton: false,
          timer: 1000
        });
      }
    });
    }
    
  }


  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }
  isFieldInvalid(fieldName: string): boolean {
    const control = this.patientRegisterForm.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

}
