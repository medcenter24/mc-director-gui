import {NgModule} from '@angular/core';
import {AppTranslationModule} from '../../../../app.translation.module';
import {ButtonModule} from 'primeng/button';
import {NgaModule} from '../../../../theme/nga.module';
import {RouterModule} from '@angular/router';
import {ConditionsAssistantPageComponent} from './conditions.assistant.page.component';
import {FinanceViewTableAssistantModule} from '../../../../components/finance/components/view/table/assistant';

@NgModule({
  imports: [
    AppTranslationModule,
    ButtonModule,
    NgaModule,
    RouterModule,
    FinanceViewTableAssistantModule,
  ],
  exports: [ConditionsAssistantPageComponent],
  declarations: [ConditionsAssistantPageComponent],
})
export class ConditionsAssistantPageModule {
}
