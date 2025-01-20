import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CountrystateService } from '../../Services/CountryState/countrystate.service';
import { RegisterService } from '../../Services/Register/register.service';
import { SharedServiceService } from '../../Services/SharedService/shared-service.service';
import { customEmailValidator } from '../register/emailValidator';
import { RequireddataService } from '../../Services/RequiredData/requireddata.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import * as bootstrap from 'bootstrap'


@Component({
    selector: 'app-profile',
    standalone:true,
    imports: [ReactiveFormsModule, CommonModule, RouterLink],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent {

  userProfile: any = null;
  countryData: any[] = [];
  stateData: any[] = [];
  filteredStateData : any[] = []
  selectedFile: File | null = null;
  role:string = '';
  isView:boolean = true
  loggedInEmail : string | null = ''
  image:any
  todayDate:any = formatDate(new Date(), "yyyy-MM-dd","en")
  roleName:string = '';
  specializations:any;
  qualifications:any;
  bloodGroups:any;
  genders:any;

  constructor(
    private registerService: RegisterService,
    private countrystateService: CountrystateService,
    private sharedService : SharedServiceService,
    private requiredData:RequireddataService
  ) {}

  updateForm:FormGroup = new FormGroup({
    
    firstName: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    lastName: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, customEmailValidator()]),
    mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    dob: new FormControl('', Validators.required),
    address: new FormControl('',Validators.required),
    countryId: new FormControl('', Validators.required),
    stateId: new FormControl('', Validators.required),
    pincode: new FormControl('', Validators.required),
    genderId:new FormControl('',Validators.required),
    bloodGroupId:new FormControl('',Validators.required),
    city: new FormControl('',Validators.required),
    qualificationId : new FormControl('',Validators.required),
    specializationId : new FormControl('',Validators.required),
    registrationNumber : new FormControl('',Validators.required),
    visitingCharge : new FormControl('',Validators.required)

  });
  // practitionerForm:FormGroup

  ngOnInit(): void {
    this.getBloodGroup();
    this.getGender();
    this.getQualification();
    this.getSpecialization();
    this.loadInitialData();
    this.roleName = sessionStorage.getItem("roleName") || '';
  }

  loadInitialData(): void {
    this.getProfile();
    this.getCountries();

  }

  onSubmit(){
    debugger
    if(this.roleName=='Patient'){
      this.updateForm.get('qualificationId')?.clearValidators();
      this.updateForm.get('specializationId')?.clearValidators();
      this.updateForm.get('registrationNumber')?.clearValidators();
      this.updateForm.get('visitingCharge')?.clearValidators();
      this.updateForm.get('qualificationId')?.updateValueAndValidity();
      this.updateForm.get('specializationId')?.updateValueAndValidity();
      this.updateForm.get('registrationNumber')?.updateValueAndValidity();
      this.updateForm.get('visitingCharge')?.updateValueAndValidity();
      
    }
    if(this.updateForm.invalid){
      this.updateForm.markAllAsTouched();
    }

    // const updateData = this.updateForm.value;
    // updateData.append
    if(this.updateForm.valid){
      debugger
      const formData = new FormData();
      Object.keys(this.updateForm.controls).forEach((key) => {
        formData.append(key, this.updateForm.get(key)?.value as string);
      });

      if(this.selectedFile){
        formData.append('profileImage', this.selectedFile, this.selectedFile.name)
      }


      this.registerService.updateUser(sessionStorage.getItem("username")?? '',formData).subscribe({
        next : (value:any)=>{
          debugger
          Swal.fire({
            icon: "success",
            title: "Profile updated",
            showConfirmButton: true,
            timer: 1000
          });
          this.isView = true;
          this.getProfile();
        },
        error :(error : any)=>{
          Swal.fire({
            icon: "error",
            title: "Error!!",
            text: "Either null value or the image profile picture is not selected",
          });
          console.log(error);
          
        }
      });
  
    }
    // else{
    //   formData.append('profileImage',)
    // }

  }
  


  forUpdate(){
    this.openProfileModal();
    this.updateForm.get('firstName')?.setValue(this.userProfile.firstName);
    this.updateForm.get('lastName')?.setValue(this.userProfile.lastName);
    this.updateForm.get('email')?.setValue(this.userProfile.email);
    this.updateForm.get('mobile')?.setValue(this.userProfile.mobile);
    this.updateForm.get('dob')?.setValue(formatDate(this.userProfile.dob,"yyyy-MM-dd","en"));
    this.updateForm.get('address')?.setValue(this.userProfile.address);
    this.updateForm.get('countryId')?.setValue(this.userProfile.countryId);
    this.onCountryChange();
    this.updateForm.get('stateId')?.setValue(this.userProfile.stateId);
    this.updateForm.get('pincode')?.setValue(this.userProfile.pincode);
    this.updateForm.get('genderId')?.setValue(this.userProfile.genderId);
    this.updateForm.get('bloodGroupId')?.setValue(this.userProfile.bloodGroupId);
    this.updateForm.get('city')?.setValue(this.userProfile.city);
    if(this.roleName === 'Practitioner'){
      this.updateForm.get('qualificationId')?.setValue(this.userProfile.qualificationId);
      this.updateForm.get('specializationId')?.setValue(this.userProfile.specializationId);
      this.updateForm.get('registrationNumber')?.setValue(this.userProfile.registrationNumber);
      this.updateForm.get('visitingCharge')?.setValue(this.userProfile.visitingCharge);
    }
    // this.updateForm.patchValue(this.userProfile)
  }

  onFileSelected(event: any): void {
    debugger
    this.selectedFile = event.target.files[0];
    const imagefromhtml = event.target as HTMLInputElement
    if(imagefromhtml.files && imagefromhtml.files[0]){
      const file = imagefromhtml.files[0]
      var reader = new FileReader();
    reader.onload=()=>{
      this.image = reader.result
    };
    reader.readAsDataURL(file)
    }

    
  }

  // getRoles(){
  //   this.registerService.getRoles().subscribe({
  //     next:(value:any)=>{
  //       this.roles = value
  //     }
  //   })
  // }
  getSpecialization():void{
    this.requiredData.getSpecialization().subscribe({
      next: (value:any)=>{
        this.specializations = value
        console.log(this.specializations);
        
      },
      error:(error)=>{
        console.log(error.status);
        
      }
    })
  }
  getBloodGroup():void{
    debugger
    this.requiredData.getBloodGroup().subscribe(
      {
        next:(value:any)=>{
          debugger
          this.bloodGroups = value;
          console.log("adkuaslidjaslidj",this.bloodGroups);
          
        },
        error:(error:any)=>{
          debugger
          console.log("adkuaslidjaslidj",error.status);
          
        }
      }
    )
  }
  getQualification():void{
    this.requiredData.getQualification().subscribe({
      next:(value:any)=>{
        this.qualifications = value;
      },
      error:(error:any)=>{
        console.log(error.status);
        
      }
    })
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
      next: (countries: any[]) => {
        
        this.countryData = countries;
        this.tryMapCountryState();
      },
      error: (error: any) => {
        console.error('Error fetching countries:', error);
      },
    });
  }


  getProfile(): void {
    this.loggedInEmail = sessionStorage.getItem("email")?? '';
    this.registerService.getUserByEmail(this.loggedInEmail).subscribe({
      next: (profile: any) => {
        debugger
        this.userProfile = profile;
        console.log(this.userProfile);
        this.tryMapCountryState();
        this.mapBloodGroup();
        this.mapSpecialization();
        this.mapGender();
        this.mapQualification();
        this.sharedService.setProfPicture('https://localhost:7187/'+this.userProfile.profileImage);
      },
      error: (error: any) => {
      },
    });
  }
  mapQualification(){
    debugger
    const qualification = this.qualifications.find(
      (q:any)=> q.qualificationId === this.userProfile.qualificationId
      );
      this.userProfile.qualificationName = qualification? qualification.qualificationName : "Unknown"
  }
  mapGender(){
    debugger
    const gender = this.genders.find(
      (g:any)=> g.genderId === this.userProfile.genderId
    );
    this.userProfile.genderName = gender? gender.genderName : "Unknown"
  }
  mapSpecialization(){
    debugger
    const specialization = this.specializations.find(
      (s:any)=> s.specializationId === this.userProfile.specializationId
    );
    this.userProfile.specializationName = specialization? specialization.specializationName : "Unknown"
  }
  mapBloodGroup(){
    debugger
    const bloodGroup = this.bloodGroups.find(
      (b:any)=> b.bloodGroupId === this.userProfile.bloodGroupId
    );
    this.userProfile.bloodGroupName = bloodGroup? bloodGroup.bloodGroupName : "Unknown"
  }

  getState(countryId: number): void {

    this.countrystateService.getStateByCountryId(countryId).subscribe({
      next: (states: any[]) => {
        this.stateData = states;
        this.mapState();
      },
      error: (error: any) => {
      },
    });
  }


  tryMapCountryState(): void {
    debugger
    if (this.userProfile && this.countryData.length) {
      const country = this.countryData.find(
        (c: any) => c.countryId === this.userProfile.countryId
      );
      this.userProfile.countryName = country ? country.countryName : 'Unknown';

      this.getState(this.userProfile.countryId);
    }
  }


  mapState(): void {
    debugger
    if (this.userProfile && this.stateData.length) {
      const state = this.stateData.find(
        (s: any) => s.stateId === this.userProfile.stateId
      );
      this.userProfile.stateName = state ? state.stateName : 'Unknown';
    }
  }

  onCountryChange(): void {
    const selectedCountry = this.updateForm.get('countryId')?.value;
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

  isFieldInvalid(fieldName: string): boolean {
    const control = this.updateForm.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  closeProfileModal() {
    const otpModalElement = document.getElementById('profileModal');
    if (otpModalElement) {
      const profileModalInstance = bootstrap.Modal.getInstance(otpModalElement);
      profileModalInstance?.hide();
    }
  }
  
  openProfileModal() {
    const modalElement = document.getElementById('profileModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

}

