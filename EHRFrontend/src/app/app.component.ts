import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { LoadingComponent } from './Components/loading/loading.component';

@Component({
    selector: 'app-root',
    standalone:true,
    imports: [RouterOutlet,LoadingComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'EHRFrontend';
}
