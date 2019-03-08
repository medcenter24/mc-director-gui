/*
 * Copyright (c) 2018.
 *
 * @author Zagovorychev Olexandr <zagovorichev@gmail.com>
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssistantsService } from '../../assistant.service';
import { AssistantSelectComponent } from './assistant.select.component';
import { AppTranslationModule } from '../../../../app.translation.module';
import { AutoCompleteModule } from '../../../ui/autosuggest';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    AutoCompleteModule,
  ],
  providers: [
    AssistantsService,
  ],
  exports: [
    AssistantSelectComponent,
  ],
  declarations: [
    AssistantSelectComponent,
  ],
})
export class AssistantSelectModule {
}