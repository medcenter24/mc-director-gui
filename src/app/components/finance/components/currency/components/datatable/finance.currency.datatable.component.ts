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
import { GlobalState } from '../../../../../../global.state';
import {
  DatatableAction,
  DatatableCol,
  DatatableComponent,
  DatatableConfig,
  DatatableTransformer,
} from '../../../../../ui/datatable';
import { FinanceCurrency } from '../../finance.currency';
import { FinanceCurrencyService } from '../../finance.currency.service';
import { LoggerComponent } from '../../../../../core/logger/LoggerComponent';
import { Breadcrumb } from '../../../../../../theme/components/baContentTop/breadcrumb';
import { AbstractDatatableController } from '../../../../../ui/tables/abstract.datatable.controller';
import { LoadableServiceInterface } from '../../../../../core/loadable';

@Component({
  selector: 'nga-currency-datatable',
  templateUrl: './finance.currency.datatable.html',
})
export class FinanceCurrencyDatatableComponent extends AbstractDatatableController {
  protected componentName: string = 'FinanceCurrencyDatatableComponent';

  @ViewChild('datatable')
    private datatable: DatatableComponent;

  displayDialog: boolean;
  langLoaded: boolean = false;
  datatableConfig: DatatableConfig;

  currency: FinanceCurrency;

  constructor(
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    protected translateService: TranslateService,
    private financeCurrencyService: FinanceCurrencyService,
  ) {
    super();
  }

  protected onLangLoaded () {
    super.onLangLoaded();
    const breadcrumbs = [];
    const title = this.translateService.instant('Currencies');
    breadcrumbs.push(new Breadcrumb(title, '/pages/finance/conditions', true));
    this._state.notifyDataChanged('changeTitle', title);
    this._state.notifyDataChanged('menu.activeLink', breadcrumbs);
  }

  protected getDatatableComponent (): DatatableComponent {
    return this.datatable;
  }

  protected getTranslateService (): TranslateService {
    return this.translateService;
  }

  protected getService (): LoadableServiceInterface {
    return this.financeCurrencyService;
  }

  protected getEmptyModel (): Object {
    return new FinanceCurrency();
  }

  protected getColumns (): DatatableCol[] {
    return [
      new DatatableCol('title', this.translateService.instant('Title')),
      new DatatableCol('code', this.translateService.instant('Code')),
      new DatatableCol('ico', this.translateService.instant('Icon')),
      new DatatableCol('ico_preview', this.translateService.instant('Icon Preview')),
    ];
  }

  protected getTransformers (): DatatableTransformer[] {
    return [
      new DatatableTransformer('ico_preview', (f, row: FinanceCurrency) => `<span class="${row.ico}"></span>`),
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
    this.setObject(new FinanceCurrency());
    this.displayDialog = true;
  }

  private setObject(currency: FinanceCurrency = null): void {
    this.currency = currency;
  }

  save() {
    const postfix = 'Save';
    this.startLoader(postfix);
    this.financeCurrencyService.save(this.currency)
      .subscribe({
        next: () => {
          this.stopLoader(postfix);
          this.setObject();
          this.displayDialog = false;
          this.datatable.refresh();
        }, error: (e) => {
          this._logger.error(e.toString());
          this.stopLoader(postfix);
        },
      });
  }

  onRowSelect(event) {
    this.setObject(this.cloneObject(event.data));
    this.displayDialog = true;
  }

  cloneObject(o: FinanceCurrency): FinanceCurrency {
    const currency = new FinanceCurrency();
    for (const prop of Object.keys(o)) {
      currency[prop] = o[prop];
    }
    return currency;
  }

  delete() {
    this._state.notifyDataChanged('confirmDialog',
      {
        header: this.translateService.instant('Delete'),
        message: this.translateService.instant('Are you sure that you want to delete this currency?'),
        accept: () => {
          this.startLoader(`${this.componentName}Delete`);
          this.financeCurrencyService.destroy(this.currency)
            .subscribe({next: () => {
              this.stopLoader(`${this.componentName}Delete`);
              this.setObject();
              this.displayDialog = false;
              this.datatable.refresh();
            }, error: () => {
              this.stopLoader(`${this.componentName}Delete`);
            }});
        },
        icon: 'fa fa-window-close-o red',
      },
    );
  }
}
