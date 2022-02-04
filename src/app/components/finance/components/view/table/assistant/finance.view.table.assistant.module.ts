import {NgModule} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {AppTranslationModule} from '../../../../../../app.translation.module';
import {NgaModule} from '../../../../../../theme/nga.module';
import {FinanceViewTableAssistantComponent} from './finance.view.table.assistant.component';
import {CommonModule} from "@angular/common";
import {FvtBodyDirective} from "./fvt.body.directive";
import {FvtTbodyModule} from "../components/parts/components/tbody";
import {FvtDefaultRowModule} from "../components/rows/components/default";
import {FvtColAddModule} from "../components/cols/components/add/fvt.col.add.module";

@NgModule({
  imports: [
    AppTranslationModule,
    ButtonModule,
    NgaModule,
    CommonModule,
    FvtTbodyModule,
    FvtDefaultRowModule,
    FvtColAddModule,
  ],
  // exports: [FinanceViewTableAssistantComponent],
  declarations: [
    FinanceViewTableAssistantComponent,
    FvtBodyDirective,
  ],
  exports: [
    FinanceViewTableAssistantComponent,
    FvtBodyDirective,
  ]
})
export class FinanceViewTableAssistantModule {
}
