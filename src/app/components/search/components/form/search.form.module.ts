/*
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2022 (original work) MedCenter24.com;
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AppTranslationModule} from '../../../../app.translation.module';
import {SearchFormComponent} from './search.form.component';
import {CheckboxModule} from 'primeng/checkbox';
import {ButtonModule} from 'primeng/button';
import {SelectButtonModule} from 'primeng/selectbutton';
import {DropdownModule} from 'primeng/dropdown';
import {CaseTypeSelectModule} from '../../../case/components/type/case.type.select.module';
import {AutocompleterModule} from '../../../ui/selector/components/autocompleter';
import {DoctorsService} from '../../../doctors';
import {CitiesService} from '../../../city';
import {AssistantsService} from '../../../assistant';
import {PatientsService} from '../../../patient/patients.service';
import {AccidentStatusService} from '../../../accident/components/status';
import {AccidentTypeSelectModule} from '../../../accident/components/type/select';
import {ServicesService} from '../../../service';
import {SurveyService} from '../../../survey';
import {DiagnosticService} from '../../../diagnostic/diagnostic.service';
import {UiDatePickerModule} from '../../../ui/date/picker';
import {Ng2FlatpickrModule} from 'ng2-flatpickr';
import {AccidentTypesService} from '../../../accident/components/type/types.service';
import {SearchService} from '../../search.service';
import {SmartSearchService} from '../smartSearch';
import {SearcherFiltersModule} from '../searcher/filters';
import {OrderListModule} from 'primeng/orderlist';
import {SearchFields} from './models/search.fields';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    CheckboxModule,
    ButtonModule,
    SelectButtonModule,
    DropdownModule,
    CaseTypeSelectModule,
    AutocompleterModule,
    AccidentTypeSelectModule,
    UiDatePickerModule,
    Ng2FlatpickrModule,
    SearcherFiltersModule,
    OrderListModule,
  ],
  declarations: [
    SearchFormComponent,
  ],
  exports: [
    SearchFormComponent,
  ],
  providers: [
    DoctorsService,
    CitiesService,
    AssistantsService,
    PatientsService,
    AccidentStatusService,
    ServicesService,
    SurveyService,
    DiagnosticService,
    AccidentTypesService,
    SearchService,
    SmartSearchService,
    SearchFields,
  ],
})
export class SearchFormModule {}
