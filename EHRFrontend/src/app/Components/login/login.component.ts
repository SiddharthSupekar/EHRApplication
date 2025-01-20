import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../Services/Login/login.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    standalone:true,
    imports: [ReactiveFormsModule, CommonModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {

  roleName!:number;
  logFormData:any;
  constructor(private loginService:LoginService, private router : Router){}

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  ngOnInit():void{
    this.roleName = parseInt(localStorage.getItem("role") || '0' , 10)
  }

  forVerifying(){
    debugger
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    }
    this.logFormData = this.loginForm.value

    this.loginService.postLogin(this.logFormData).subscribe({
      next: (value: any) => {
        const loggedAgent = value;
        debugger
        // Store data in session storage
        sessionStorage.setItem('username', loggedAgent.username);
        sessionStorage.setItem('email', loggedAgent.email);
        sessionStorage.setItem('roleName', loggedAgent.roleName.result);
        sessionStorage.setItem('token', loggedAgent.token);
        sessionStorage.setItem('userId', loggedAgent.userId);


        Swal.fire({
          icon: "success",
          timer: 1500 ,
          showConfirmButton:false
        });
        this.router.navigateByUrl('/verify');
      },
      error: (value: any) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Incorrect username or password",
          showConfirmButton:false
        });
        this.resetForm();
      }
    });
  }

  resetForm(): void {
    this.loginForm.reset();
  }

}


