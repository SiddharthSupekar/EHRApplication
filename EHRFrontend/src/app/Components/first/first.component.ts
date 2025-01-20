import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-first',
    standalone:true,
    imports: [RouterLink],
    templateUrl: './first.component.html',
    styleUrl: './first.component.css'
})
export class FirstComponent {

  role(roleName : string):void{
    if(roleName === 'patient'){
      localStorage.setItem("role", '2');
    }
    if(roleName === 'practitioner'){
      localStorage.setItem("role", "1")
    }
  }

}
