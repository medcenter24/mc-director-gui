import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[fvtBody]',
})
export class FvtBodyDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
