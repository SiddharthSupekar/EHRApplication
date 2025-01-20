import { ChangeDetectorRef, Component } from '@angular/core';
import { delay } from 'rxjs';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {

  loading:boolean = false;
  constructor(private _loading : LoaderService, private cdr: ChangeDetectorRef){}

  ngOnInit():void{
    this.listenToLoading()
  }

  listenToLoading():void{

      this._loading.loadingSub.pipe(delay(10)).subscribe((loading)=>{
      this.loading = loading;
      this.cdr.detectChanges();
    })
  }

}
