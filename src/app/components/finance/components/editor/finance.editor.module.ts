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
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AppTranslationModule } from '../../../../app.translation.module';
import { DoctorSelectModule } from '../../../doctors/components/select';
import { HospitalsService } from '../../../hospital';
import { AutocompleterModule } from '../../../ui/selector/components/autocompleter';
import { FinanceEditorComponent } from './finance.editor.component';
import { AssistantSelectModule } from '../../../assistant/components/select';
import { CitySelectModule } from '../../../city/components/select';
import { NgaModule } from '../../../../theme/nga.module';
import { FinanceService } from '../../finance.service';
import { PeriodSelectModule } from '../../../period/components/select';
import { DoctorsService } from '../../../doctors';
import { CitiesService } from '../../../city';
import { MultiSelectorModule } from '../../../ui/selector/components/multiSelector';
import { AssistantsService } from '../../../assistant';
import { PeriodService } from '../../../period';
import { ServicesService } from '../../../service';
import { FinanceInfoModule } from '../info';
import {InputNumberModule} from 'primeng/inputnumber';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AppTranslationModule,
        DoctorSelectModule,
        AssistantSelectModule,
        CitySelectModule,
        NgaModule,
        PeriodSelectModule,
        MultiSelectorModule,
        FinanceInfoModule,
        SelectButtonModule,
        InputSwitchModule,
        AutocompleterModule,
        InputNumberModule,
    ],
  providers: [
    FinanceService,
    DoctorsService,
    CitiesService,
    AssistantsService,
    PeriodService,
    ServicesService,
    HospitalsService,
  ],
  declarations: [
    FinanceEditorComponent,
  ],
  exports: [
    FinanceEditorComponent,
  ],
})
export class FinanceEditorModule {
}
