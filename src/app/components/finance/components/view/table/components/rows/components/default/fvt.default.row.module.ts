import {NgModule} from "@angular/core";
import {NgaModule} from "../../../../../../../../../theme/nga.module";
import {FvtDefaultRowComponent} from "./fvt.default.row.component";
import {FvtColsDirective} from "./fvt.cols.directive";

@NgModule({
  imports: [
    NgaModule,
  ],
  exports: [
    FvtDefaultRowComponent,
    FvtColsDirective,
  ],
  declarations: [
    FvtDefaultRowComponent,
    FvtColsDirective,
  ],
})
export class FvtDefaultRowModule {
}
