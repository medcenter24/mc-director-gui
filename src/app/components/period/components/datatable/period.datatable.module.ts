/*
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2019 (original work) MedCenter24.com;
 */

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AppTranslationModule } from '../../../../app.translation.module';
import { CommonModule } from '@angular/common';
import { DatatableModule } from '../../../ui/datatable';
import { PeriodService } from '../../period.service';
import { PeriodDatatableComponent } from './period.datatable.component';
import { InputMaskModule } from 'primeng/inputmask';
import { UiDateDowDropdownModule } from '../../../ui/date/dow/dropdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    DialogModule,
    ButtonModule,
    DatatableModule,
    InputMaskModule,
    UiDateDowDropdownModule,
  ],
  providers: [
    PeriodService,
  ],
  declarations: [
    PeriodDatatableComponent,
  ],
  exports: [
    PeriodDatatableComponent,
  ],
})
export class PeriodDatatableModule {
}
