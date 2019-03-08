/*
 * Copyright (c) 2018.
 *
 * @author Zagovorychev Oleksandr <zagovorichev@gmail.com>
 */

import { NgModule } from '@angular/core';
import { DevelopmentPageComponent } from './development.page.component';
import { routing } from './development.page.routing';
import { DevelopmentGuiModule } from './gui';
import { DevelopmentGuiInvoiceModule } from './gui/invoice';
import { DevelopmentGuiMultiselectModule } from './gui/multiselect';
import { MultiselectImplementationsModule } from './gui/multiselect/implementations';
import { DevelopmentGuiAutocompleterModule } from './gui/autocompleter';
import { GuiPaymentBlockModule } from './gui/payment/block';
import { DevelopmentGuiUploaderFileModule } from './gui/uploader/file';
import { GuiDialogDeleteModule } from './gui/dialog/delete';

@NgModule({
  imports: [
    routing,
    DevelopmentGuiModule,
    DevelopmentGuiMultiselectModule,
    MultiselectImplementationsModule,
    DevelopmentGuiAutocompleterModule,
    DevelopmentGuiUploaderFileModule,
    DevelopmentGuiInvoiceModule,
    GuiPaymentBlockModule,
    GuiDialogDeleteModule,
  ],
  declarations: [
    DevelopmentPageComponent,
  ],
})
export class DevelopmentPageModule {
}