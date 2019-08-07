import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[nextFocusElementId]'
})
export class NextFocusDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { 
  }

  @Input() nextFocusElementId: string;

  @HostListener('keydown.enter', ['$event']) onkeydown(event) {

    event.preventDefault();
    
    var nextElement = document.getElementsByName(this.nextFocusElementId)[0];

    if (nextElement.tagName == 'MAT-RADIO-GROUP') {
      var radioButtons = nextElement.getElementsByTagName('INPUT');

      for (var i = 0; i < radioButtons.length; ++i) {
        var button = <HTMLInputElement>radioButtons[i];

        if (button.checked) {
          button.focus();
          break;
        }
      }
    }
    else {
      nextElement.focus();
    }
    
  }
}