import { Routes } from '@angular/router';
import { PatientRegisterComponent } from './Components/register/patient-register/patient-register.component';
import { LoginComponent } from './Components/login/login.component';
import { FirstComponent } from './Components/first/first.component';
import { PractitionerRegisterComponent } from './Components/register/practitioner-register/practitioner-register.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { VerifyOtpComponent } from './Components/verify-otp/verify-otp.component';
import { LayoutComponent } from './Components/layout/layout.component';
import { ChangePasswordComponent } from './Components/change-password/change-password.component';
import { AddAppointmentComponent } from './Components/add-appointment/add-appointment.component';
import { PatientDashboardComponent } from './Components/patient-dashboard/patient-dashboard.component';
import { ProviderDashboardComponent } from './Components/provider-dashboard/provider-dashboard.component';
import { AddAppointmentPatientComponent } from './Components/addAppointment/add-appointment-patient/add-appointment-patient.component';
import { AddAppointmentPractitionerComponent } from './Components/addAppointment/add-appointment-practitioner/add-appointment-practitioner.component';
import { CompletedComponent } from './Components/completed/completed.component';
import { loginGuard } from './Guards/LoginGuard/login.guard';
import { ForgotPasswordComponent } from './Components/forgot-password/forgot-password.component';
import { ChatComponent } from './Components/chat/chat.component';


export const routes: Routes = [
    {
        path:'',
        component:LoginComponent
    },
    {
        path:'first',
        component:FirstComponent
    },
    {
        path:'patientRegister',
        component: PatientRegisterComponent 
    },
    {
        path:'practitionerRegister',
        component: PractitionerRegisterComponent
    },
    {
        path:'login',
        component:LoginComponent
    },
    
    {
        path:'verify',
        component:VerifyOtpComponent
    },
    {
        path:'forgot-password',
        component : ForgotPasswordComponent
    },
    {
        path:'layout',
        component:LayoutComponent,
        canActivate:[loginGuard],
        children:[
            {
                path:'profile',
                component:ProfileComponent
            },
            {
                path:'change-password',
                component:ChangePasswordComponent
            },
            {
                path:'add-appointment-patient',
                component:AddAppointmentPatientComponent
            },
            {
                path:'add-appointment-practitioner',
                component:AddAppointmentPractitionerComponent
            },
            {
                path:'patient-dashboard',
                component:PatientDashboardComponent
            },
            {
                path:'provider-dashboard',
                component:ProviderDashboardComponent
            },
            {
                path:'completed-appointments',
                component:CompletedComponent
            },
            {
                path:'chat/:id/:name',
                component:ChatComponent
            }
        ]
    },
];
