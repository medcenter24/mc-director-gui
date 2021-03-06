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

import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PatientsService } from '../../patients.service';
import { DateHelper } from '../../../../helpers/date.helper';
import { Patient } from '../../patient';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import { GlobalState } from '../../../../global.state';
import { PatientEditorComponent } from '../editor/patient.editor.component';
import {
  DatatableAction,
  DatatableCol,
  DatatableComponent,
  DatatableConfig,
  DatatableTransformer,
} from '../../../ui/datatable';
import { AbstractDatatableController } from '../../../ui/tables/abstract.datatable.controller';
import { Breadcrumb } from '../../../../theme/components/baContentTop/breadcrumb';
import { LoadableServiceInterface } from '../../../core/loadable';
import { DatatableRequestBuilder } from '../../../ui/datatable/request/datatable.request.builder';
import { RequestBuilder } from '../../../core/http/request';
import { FilterRequestField, SortRequestField } from '../../../core/http/request/fields';

@Component({
  selector: 'nga-patient-datatable',
  templateUrl: './patient.datatable.html',
})
export class PatientDatatableComponent extends AbstractDatatableController {

  protected componentName: string = 'PatientDatatableComponent';

  @ViewChild('patientDatatable')
  private patientDatatable: DatatableComponent;

  @ViewChild('editPatientForm')
  private editPatientForm: PatientEditorComponent;

  datatableConfig: DatatableConfig;
  langLoaded: boolean = false;
  displayDialog: boolean = false;

  constructor(
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    private translateService: TranslateService,
    private patientService: PatientsService,
  ) {
    super();
  }

  protected onLangLoaded () {
    super.onLangLoaded();
    const breadcrumbs = [];
    const title = this.translateService.instant('Patients');
    breadcrumbs.push(new Breadcrumb(title, '/pages/companions/patients', true));
    this._state.notifyDataChanged('menu.activeLink', breadcrumbs);
    this._state.notifyDataChanged('changeTitle', title);
  }

  protected getDatatableComponent (): DatatableComponent {
    return this.patientDatatable;
  }

  protected getTranslateService (): TranslateService {
    return this.translateService;
  }

  protected getService (): LoadableServiceInterface {
    return this.patientService;
  }

  protected getEmptyModel (): Object {
    return new Patient();
  }

  protected getColumns (): DatatableCol[] {
    return [
      new DatatableCol('name', this.translateService.instant('Name')),
      new DatatableCol('address', this.translateService.instant('Address')),
      new DatatableCol('phones', this.translateService.instant('Phone')),
      new DatatableCol('birthday', this.translateService.instant('Birthday')),
    ];
  }

  protected getTransformers (): DatatableTransformer[] {
    return [
      new DatatableTransformer('birthday', val => DateHelper.toEuropeFormat(val)),
    ];
  }

  protected hasControlPanel (): boolean {
    return true;
  }

  protected getControlPanelActions (): DatatableAction[] {
    return [
      new DatatableAction(this.translateService.instant('Add'), 'fa fa-plus', () => {
        this.showDialogToAdd();
      }),
    ];
  }

  protected hasFilterRow (): boolean {
    return true;
  }

  protected getRequestBuilder (): DatatableRequestBuilder {
    const requestBuilder = super.getRequestBuilder();
    requestBuilder.setSorter(new RequestBuilder([
      new SortRequestField('name'),
    ]));
    requestBuilder.setFilter(new RequestBuilder([
      new FilterRequestField('name', null, FilterRequestField.MATCH_CONTENTS, FilterRequestField.TYPE_TEXT),
      new FilterRequestField('phones', null, FilterRequestField.MATCH_CONTENTS, FilterRequestField.TYPE_TEXT),
    ]));
    return requestBuilder;
  }

  showDialogToAdd() {
    this.setPatient(new Patient());
    this.displayDialog = true;
  }

  private setPatient(patient: Patient): void {
    this.editPatientForm.setPatient(patient);
  }

  onRowSelect(event) {
    this.setPatient(PatientDatatableComponent.clonePatient(event.data));
    this.displayDialog = true;
  }

  private static clonePatient( p: Patient): Patient {
    const patient = new Patient();
    for (const prop of Object.keys(p)) {
      patient[prop] = p[prop];
    }
    return patient;
  }

  onPatientChanged(): void {
    this.displayDialog = false;
    this.patientDatatable.refresh();
  }
}
