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
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import { TranslateService } from '@ngx-translate/core';
import { GlobalState } from '../../../../global.state';
import { Hospital } from '../../hospital';
import { HospitalsService } from '../../hospitals.service';
import { DatatableAction, DatatableCol, DatatableComponent, DatatableConfig } from '../../../ui/datatable';
import { AbstractDatatableController } from '../../../ui/tables/abstract.datatable.controller';
import { LoadableServiceInterface } from '../../../core/loadable';
import { Breadcrumb } from '../../../../theme/components/baContentTop/breadcrumb';

@Component({
  selector: 'nga-hospital-datatable',
  templateUrl: './hospital.datatable.html',
})
export class HospitalDatatableComponent extends AbstractDatatableController {
  protected componentName: string = 'HospitalDatatableComponent';

  @ViewChild('datatable')
    private datatable: DatatableComponent;

  displayDialog: boolean;
  langLoaded: boolean = false;
  datatableConfig: DatatableConfig;

  hospital: Hospital;

  constructor(
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    protected translateService: TranslateService,
    private hospitalService: HospitalsService,
  ) {
    super();
  }

  protected onLangLoaded () {
    super.onLangLoaded();
    const breadcrumbs = [];
    const title = this.translateService.instant('Hospitals');
    breadcrumbs.push(new Breadcrumb(title, '/pages/geo/hospitals', true));
    this._state.notifyDataChanged('menu.activeLink', breadcrumbs);
    this._state.notifyDataChanged('changeTitle', title);
  }

  protected getDatatableComponent (): DatatableComponent {
    return this.datatable;
  }

  protected getTranslateService (): TranslateService {
    return this.translateService;
  }

  protected getService (): LoadableServiceInterface {
    return this.hospitalService;
  }

  protected getEmptyModel (): Object {
    return new Hospital();
  }

  protected getColumns (): DatatableCol[] {
    return [
      new DatatableCol('title', this.translateService.instant('Title')),
      new DatatableCol('refKey', this.translateService.instant('Ref. Key')),
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

  showDialogToAdd() {
    this.setHospital(new Hospital());
    this.displayDialog = true;
  }

  private setHospital(hospital: Hospital = null): void {
    this.hospital = hospital;
  }

  save() {
    const postfix = 'Save';
    this.startLoader(postfix);
    this.hospitalService.save(this.hospital)
      .subscribe({next: () => {
        this.stopLoader(postfix);
        this.setHospital();
        this.displayDialog = false;
        this.datatable.refresh();
      }, error: () => {
        this.stopLoader(postfix);
      }});
  }

  onRowSelect(event) {
    this.setHospital(this.cloneHospital(event.data));
    this.displayDialog = true;
  }

  cloneHospital(hospital: Hospital): Hospital {
    const hospital1 = new Hospital();
    for (const prop of Object.keys(hospital)) {
      hospital1[prop] = hospital[prop];
    }
    return hospital1;
  }

  delete() {
    this._state.notifyDataChanged('confirmDialog',
      {
        header: this.translateService.instant('Delete'),
        message: this.translateService.instant('Are you sure that you want to delete this hospital?'),
        accept: () => {
          const postfix = 'Delete';
          this.startLoader(postfix);
          this.hospitalService.destroy(this.hospital)
            .subscribe({next: () => {
              this.stopLoader(postfix);
              this.setHospital();
              this.displayDialog = false;
              this.datatable.refresh();
            }, error: () => {
              this.stopLoader(postfix);
            }});
        },
        icon: 'fa fa-window-close-o red',
      },
    );
  }
}
