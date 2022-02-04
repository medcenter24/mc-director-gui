import {NgModule} from "@angular/core";
import {NgaModule} from "../../../../../../../../../theme/nga.module";
import {FvtTbodyComponent} from "./fvt.tbody.component";
import {FvtRowsDirective} from "./fvt.rows.directive";

@NgModule({
  imports: [
    NgaModule,
  ],
  exports: [
    FvtTbodyComponent,
    FvtRowsDirective,
  ],
  declarations: [
    FvtTbodyComponent,
    FvtRowsDirective,
  ],
})
export class FvtTbodyModule {
}
