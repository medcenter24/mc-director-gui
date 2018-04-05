/*
 * Copyright (c) 2018.
 *
 * @author Zagovorychev Olexandr <zagovorichev@gmail.com>
 */

import { NgModule } from '@angular/core';
import { FileUploadModule } from 'primeng/primeng';
import { AppTranslationModule } from '../../../../app.translation.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploaderComponent } from './uploader.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    AppTranslationModule,
  ],
  declarations: [
    FileUploaderComponent,
  ],
  exports: [
    FileUploaderComponent,
  ]
})
export class UploaderModule {
}
