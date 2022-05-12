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
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { KeyFilterModule } from 'primeng/keyfilter';
import { AppTranslationModule } from '../../../../app.translation.module';
import { FormsModule } from '@angular/forms';
import { FormService } from '../../../forms';
import { FormViewerModule } from '../../../forms/components/viewer';
import { InvoiceEditorModule } from '../../../invoice/components/editor';
import { DownloadFileModule } from '../../../upload/components/download';
import { UploadFileModule } from '../../../upload/components/file';
import { CaseEditorComponent } from './case.editor.component';
import { CaseEditorTabsService } from './case.editor.tabs.service';
import { CaseTypeSelectModule } from '../type/case.type.select.module';
import { AccidentCardModule } from '../../../accident/components/card';
import { PatientEditorModule } from '../../../patient/components/editor';
import { PatientSelectorModule } from '../../../patient/components/selector/patient.selector.module';
import { AccidentScenarioLineModule } from '../../../accident/components/scenario/components/line/accident.scenario.line.module';
import { AccidentCheckpointsSelectorModule } from '../../../accident/components/checkpoint/components/select/accident.checkpoints.selector.module';
import { AccidentTypeSelectModule } from '../../../accident/components/type/select';
import { SurveySelectorModule } from '../../../survey/components/selector/survey.selector.module';
import { DiagnosticSelectorModule } from '../../../diagnostic/components/selector';
import { UploaderModule } from '../../../document/components/uploader';
import { CaseFinanceModule } from '../finance';
import { NgaModule } from '../../../../theme/nga.module';
import { AccidentActivityModule } from '../../../accident/components/activity';
import { ServiceSelectorModule } from '../../../service/components/selector';
import { AutocompleterModule } from '../../../ui/selector/components/autocompleter';
import { DoctorsService } from '../../../doctors';
import { AssistantsService } from '../../../assistant';
import { CitiesService } from '../../../city';
import { AccidentsService } from '../../../accident/accidents.service';
import { HospitalsService } from '../../../hospital';
import {AccidentsRefNumService} from "../../../accident/accidents.refNum.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    DialogModule,
    FileUploadModule,
    ConfirmDialogModule,
    ButtonModule,
    InplaceModule,
    TooltipModule,
    CaseTypeSelectModule,
    InputMaskModule,
    AccidentCardModule,
    PatientEditorModule,
    PatientSelectorModule,
    AccidentScenarioLineModule,
    AccidentCheckpointsSelectorModule,
    ServiceSelectorModule,
    AccidentTypeSelectModule,
    SurveySelectorModule,
    DiagnosticSelectorModule,
    UploaderModule,
    CaseFinanceModule,
    AccidentActivityModule,
    NgaModule,
    AutocompleterModule,
    KeyFilterModule,
    CheckboxModule,
    InvoiceEditorModule,
    UploadFileModule,
    DownloadFileModule,
    FormViewerModule,
    InputTextareaModule,
    InputTextModule,
  ],
  declarations: [
    CaseEditorComponent,
  ],
  providers: [
    CaseEditorTabsService,
    DoctorsService,
    AssistantsService,
    CitiesService,
    AccidentsService,
    HospitalsService,
    FormService,
    AccidentsRefNumService,
  ],
  exports: [
    CaseEditorComponent,
  ],
})
export class CaseEditorModule {
}
