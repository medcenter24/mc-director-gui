import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[fvtCols]',
})
export class FvtColsDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
