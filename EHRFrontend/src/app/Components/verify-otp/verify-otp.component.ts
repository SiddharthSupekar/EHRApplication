import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../../Services/Login/login.service';
import { CommonModule } from '@angular/common';
import { Toast } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PhoneDirective } from '../../Directives/PhoneDirective/phone.directive';

@Component({
    selector: 'app-verify-otp',
    standalone:true,
    imports: [ReactiveFormsModule, CommonModule, PhoneDirective],
    templateUrl: './verify-otp.component.html',
    styleUrl: './verify-otp.component.css',
})
export class VerifyOtpComponent {

  constructor(private loginService: LoginService, private router: Router, private toastr:ToastrService) {}

  otpForm: FormGroup = new FormGroup({
    otp: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]) 
  });

  otpData: any;
  username: string = '';

  onSubmit(): void {
    if(this.otpForm.invalid){
      this.otpForm.markAllAsTouched();
    }
    if(this.otpForm.valid){
      this.username = sessionStorage.getItem('username') || '';
    this.otpData = this.otpForm.value;

    if (this.otpForm.valid && this.username) {
      const otpDetails = {
        username: this.username,
        otp: this.otpData.otp
      };

      console.log(otpDetails);

      this.loginService.verifyOtp(otpDetails).subscribe({
        next: (value: any) => {

          Swal.fire({
            icon: "success",
            title: "Otp Verified",
            showConfirmButton: false,
            timer: 1000
          });
          debugger
          sessionStorage.setItem('verifyOtp', 'true');
          const role = sessionStorage.getItem('roleName');
          if (role === 'Practitioner') {
            this.router.navigateByUrl('/layout/provider-dashboard');
          } else if (role === 'Patient') {
            this.router.navigateByUrl('/layout/patient-dashboard');
          } else {
            this.router.navigateByUrl('/layout');
          }
        },
        error: (error: any) => {
          this.toastr.error("Invalid Otp!!!");
        }
      });
    }
    }
  }

}
