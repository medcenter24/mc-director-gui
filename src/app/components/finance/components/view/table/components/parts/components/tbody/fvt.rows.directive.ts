import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[fvtRows]',
})
export class FvtRowsDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
