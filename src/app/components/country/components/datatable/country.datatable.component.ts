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
 * Copyright (c) 2019 (original work) MedCenter24.com;
 */

import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalState } from '../../../../global.state';
import { DatatableCol } from '../../../ui/datatable';
import { DatatableAction } from '../../../ui/datatable';
import { CountryService } from '../../country.service';
import { Country } from '../../country';
import { DatatableComponent } from '../../../ui/datatable';
import { AbstractDatatableController } from '../../../ui/tables/abstract.datatable.controller';
import { LoadableServiceInterface } from '../../../core/loadable';
import { ConfirmationService } from 'primeng/api';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import { Breadcrumb } from '../../../../theme/components/baContentTop/breadcrumb';

@Component({
  selector: 'nga-country-datatable',
  templateUrl: './country.datatable.html',
})
export class CountryDatatableComponent extends AbstractDatatableController {
  protected componentName: string = 'CountryDatatableComponent';

  @ViewChild('countryDatatableComponent')
    private countryDatatableComponent: DatatableComponent;

  constructor(
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    protected translateService: TranslateService,
    private countryService: CountryService,
    private confirmationService: ConfirmationService,
  ) {
    super();
  }

  protected onLangLoaded () {
    super.onLangLoaded();
    const breadcrumbs = [];
    const title = this.translateService.instant('Countries');
    breadcrumbs.push(new Breadcrumb(title, '/pages/geo/countries', true));
    this._state.notifyDataChanged('menu.activeLink', breadcrumbs);
    this._state.notifyDataChanged('changeTitle', title);
  }

  getService (): LoadableServiceInterface {
    return this.countryService;
  }

  protected getDatatableComponent (): DatatableComponent {
    return this.countryDatatableComponent;
  }

  protected getTranslateService (): TranslateService {
    return this.translateService;
  }

  getEmptyModel (): Object {
    return new Country();
  }

  getColumns (): DatatableCol[] {
    return [
      new DatatableCol('title', this.translateService.instant('Title')),
    ];
  }

  protected hasControlPanel (): boolean {
    return true;
  }

  protected getControlPanelActions (): DatatableAction[] {
    return [
      new DatatableAction(this.translateService.instant('Add'), 'fa fa-plus', () => {
        this.setModel(this.getEmptyModel());
        this.displayDialog = true;
      }),
    ];
  }

  confirmDelete(): void {
    this.confirmationService.confirm({
      header: this.translateService.instant('Delete'),
      message: this.translateService.instant('Are you sure that you want to delete country?'),
      accept: () => {
        this.delete();
      },
    });
  }
}
