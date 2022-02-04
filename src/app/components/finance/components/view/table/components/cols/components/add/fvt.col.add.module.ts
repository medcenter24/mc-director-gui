import {NgModule} from "@angular/core";
import {NgaModule} from "../../../../../../../../../theme/nga.module";
import {FvtColAddComponent} from "./fvt.col.add.component";
import {AppTranslationModule} from "../../../../../../../../../app.translation.module";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";

@NgModule({
  imports: [
    NgaModule,
    AppTranslationModule,
    ButtonModule,
    RippleModule,
  ],
  exports: [FvtColAddComponent],
  declarations: [FvtColAddComponent],
})
export class FvtColAddModule {
}
