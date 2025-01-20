import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { RegisterService } from '../../Services/Register/register.service';
import { SharedServiceService } from '../../Services/SharedService/shared-service.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../loading/loading.component";

@Component({
    selector: 'app-layout',
    standalone:true,
    imports: [RouterOutlet, CommonModule, RouterLink],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css'
})
export class LayoutComponent {

  constructor(private router : Router, private registerService : RegisterService,  private sharedService : SharedServiceService){}

  userProfile:any;
  userRole:string | null = '' ;
  cartItems:any;
  itemsCount:number=0;
  image : any;


  ngOnInit():void{
    this.userRole = sessionStorage.getItem("roleName");
    this.getProfile();
    // this.getAllItems();
    
    

    // this.sharedService.itemsCount$.subscribe((count)=>{
    //   this.itemsCount = count
  };
  

  isPatient():boolean {
    return this.userRole === 'Patient';
  }

  logout(){
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
    
  }

  getProfile():void{
    this.registerService.getUserByEmail(sessionStorage.getItem("email")?? '').subscribe({
      next: (profile: any) => {

        this.userProfile = profile;
        console.log(this.userProfile)
        console.log(this.userProfile.profileImage)
        this.sharedService.setProfPicture('https://localhost:7187/' + this.userProfile.profileImage)
        this.sharedService.showProfilePicture$.subscribe((profPic)=>{
          this.image = profPic;
        })

      },
      error: (error: any) => {
        console.error('Error fetching profile:', error);
      },
    });
  }
}


  

