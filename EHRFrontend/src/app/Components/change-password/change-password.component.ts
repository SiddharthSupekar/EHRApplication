import { Component } from '@angular/core';
import { ValidatorFn, AbstractControl, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { RegisterService } from '../../Services/Register/register.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-change-password',
    standalone:true,
    imports: [ReactiveFormsModule, CommonModule, RouterLink],
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {

  constructor(private registerService : RegisterService, private router : Router){}

  userData:string | null = '';
  passwordsData:any;
  roleName:string = ''
  passwordMatchValidator:ValidatorFn = (formGroup:AbstractControl)=>{
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  };
  passwords:FormGroup = new FormGroup({
    oldPassword: new FormControl('',Validators.required),
    newPassword: new FormControl('',Validators.required),
    confirmPassword : new FormControl('', Validators.required)
  }, this.passwordMatchValidator
)
  ngOnInit(){
    this.roleName = sessionStorage.getItem("roleName") || '';
  }

  onSubmit():void{
    if(this.passwords.invalid){
      this.passwords.markAllAsTouched()
    }
    if(this.passwords.valid){
      this.userData = sessionStorage.getItem("username");
    this.passwordsData = this.passwords.value;
    const details = {
      username : this.userData,
      oldPassword : this.passwordsData.oldPassword,
      newPassword : this.passwordsData.newPassword
    }

    this.registerService.changePassword(details).subscribe({
      next:(value:any)=>{
        Swal.fire({
          icon: "success",
          title: "Product deleted successfully",
          showConfirmButton: true,
          timer: 800
        });
        this.router.navigateByUrl('/layout')
      },
      error:(error:any)=>{
        Swal.fire({
          icon: "error",
          title: "Incorrect Entries",
          showConfirmButton: false,
          timer: 1200
        });
        this
      }
    })
    }

  }
  isFieldInvalid(fieldName: string): boolean {
    debugger
    const control = this.passwords.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

}
