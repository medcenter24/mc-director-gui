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
import { AbstractDatatableController } from '../../../ui/tables/abstract.datatable.controller';
import { GlobalState } from '../../../../global.state';
import { TranslateService } from '@ngx-translate/core';
import { FinanceService } from '../../finance.service';
import { LoadableServiceInterface } from '../../../core/loadable';
import { FinanceRule } from '../../finance.rule';
import { DatatableAction, DatatableCol, DatatableComponent, DatatableTransformer } from '../../../ui/datatable';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import { Breadcrumb } from '../../../../theme/components/baContentTop/breadcrumb';
import {DatatableRequestBuilder} from '../../../ui/datatable/request/datatable.request.builder';
import {RequestBuilder} from '../../../core/http/request';
import {SortRequestField} from '../../../core/http/request/fields';
import {Location} from '@angular/common';

@Component({
  selector: 'nga-finance-datatable',
  templateUrl: './finance.datatable.html',
})
export class FinanceDatatableComponent extends AbstractDatatableController {
  protected componentName: string = 'FinanceDatatableComponent';

  @ViewChild('financeDatatableComponent')
  private financeDatatableComponent: DatatableComponent;

  constructor (
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    protected translateService: TranslateService,
    private financeService: FinanceService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private location: Location,
  ) {
    super();
  }

  protected onLangLoaded () {
    super.onLangLoaded();
    const breadcrumbs = [];
    const title = this.translateService.instant('List of Conditions');
    breadcrumbs.push(new Breadcrumb(title, '/pages/finance/conditions', true));
    this._state.notifyDataChanged('menu.activeLink', breadcrumbs);
    this._state.notifyDataChanged('changeTitle', title);
  }

  protected getDatatableComponent (): DatatableComponent {
    return this.financeDatatableComponent;
  }

  protected getTranslateService (): TranslateService {
    return this.translateService;
  }

  getService(): LoadableServiceInterface {
    return this.financeService;
  }

  getEmptyModel(): Object {
    return new FinanceRule();
  }

  getColumns(): DatatableCol[] {
    return [
      new DatatableCol('title', this.translateService.instant('Title')),
      new DatatableCol('model', this.translateService.instant('Model'), { width: '5em' }),
      new DatatableCol('value', this.translateService.instant('Price'), { width: '7em' }),
      new DatatableCol('condition', this.translateService.instant('Condition')),
      new DatatableCol('order', this.translateService.instant('Order')),
    ];
  }

  getTransformers(): DatatableTransformer[] {
    return [
      new DatatableTransformer('model', val => val),
      new DatatableTransformer('condition', (val, row: FinanceRule) => {
            let res: string[] = [];
            res.push(this.conditionToString(row, 'assistants', 'title'));
            res.push(this.conditionToString(row, 'cities', 'title'));
            res.push(this.conditionToString(row, 'doctors', 'name'));
            res.push(this.conditionToString(row, 'services', 'title'));
            res.push(this.conditionToString(row, 'datePeriods', 'title'));

            res = res.filter(value => value.length > 0);
            return res.join(', ');
        }),
    ];
  }

  private conditionToString(rule: FinanceRule, key: string, title: string): string {
    let res: string = '';
    if (rule[key].length > 0) {
      res = `${this.translateService.instant(key)}:
        ${rule[key].length === 1 ? rule[key][0][title] : rule[key].length}`;
    }
    return res;
  }

  protected hasControlPanel (): boolean {
    return true;
  }

  getControlPanelActions(): DatatableAction[] {
    return [
      new DatatableAction(this.translateService.instant('Add'), 'fa fa-plus', () => {
        this.setModel(this.getEmptyModel());
        this.router.navigate(['pages/finance/conditions/new']).then();
      }),
    ];
  }

  protected onRowSelect(event): void {
    this.router.navigate([`pages/finance/conditions/${event.data.id}`]).then();
  }

  confirmDelete(): void {
    this.confirmationService.confirm({
      message: this.translateService.instant('Are you sure that you want to perform this action?'),
      accept: () => {
        this.delete();
      },
    });
  }

  getRequestBuilder (): DatatableRequestBuilder {
    const requestBuilder = super.getRequestBuilder();

    requestBuilder.setSorter(new RequestBuilder([
      new SortRequestField('order', 'desc'),
      new SortRequestField('title', 'asc'),
    ]));
    const urlRequestBuilder = DatatableRequestBuilder.fromUrl(this.location.path(true));

    urlRequestBuilder.propagate(requestBuilder);

    return urlRequestBuilder;
  }

  protected hasCaptionPanel (): boolean {
    return true;
  }

  protected getCaptionActions (): DatatableAction[] {
    const actions = [];
    actions.push(new DatatableAction(this.translateService.instant('Assistant Base Conditions'), 'fa fa-table', () => {
      this.router.navigate(['pages/finance/base-assistant-conditions'])
        .then().catch();
    }));
    return actions;
  }
}
