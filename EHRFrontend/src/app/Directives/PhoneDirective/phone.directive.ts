import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  standalone:true,
  selector: '[appPhone]'
})
export class PhoneDirective {

  constructor(private el : ElementRef, private renderer : Renderer2) { }

  @HostListener("keydown", ['$event'])
  onKeyDown(event:KeyboardEvent){
    const allowed = ['Backspace','Tab','.'];
    if((event.key>='0' && event.key <='9') || (event.key>='Numpad0' && event.key<='Numpad9') || (allowed.includes(event.key)) ){
      return ;
    }
    else{
      event.preventDefault();
    }
  }
}
