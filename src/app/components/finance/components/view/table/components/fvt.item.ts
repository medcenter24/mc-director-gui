import {ComponentFactory} from '@angular/core';

export class FvtItem {
  constructor(public component: ComponentFactory<any>, public data: any) {}
}
