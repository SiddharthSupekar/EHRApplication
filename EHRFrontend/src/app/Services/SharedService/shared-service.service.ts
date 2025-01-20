import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  constructor() { }

  private itemsCountSubject = new BehaviorSubject<number>(0);
  private showProfilePictureSubject = new BehaviorSubject<string>('')


  showProfilePicture$ = this.showProfilePictureSubject.asObservable();

  setProfPicture(profile:string):void{
    this.showProfilePictureSubject.next(profile);
  }
}
