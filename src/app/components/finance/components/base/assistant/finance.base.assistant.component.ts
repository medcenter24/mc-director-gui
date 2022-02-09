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

import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {LoadableComponent} from "../../../../core/components/componentLoader";
import {FinanceService} from "../../../finance.service";
import {Breadcrumb} from "../../../../../theme/components/baContentTop/breadcrumb";
import {LoggerComponent} from "../../../../core/logger/LoggerComponent";
import {GlobalState} from "../../../../../global.state";
import {TranslateService} from "@ngx-translate/core";
import {DatatableRequestBuilder} from "../../../../ui/datatable/request/datatable.request.builder";
import {RequestBuilder} from "../../../../core/http/request";
import {FilterRequestField} from "../../../../core/http/request/fields";
import {FinanceRule} from "../../../finance.rule";
import {Assistant} from "../../../../assistant";
import {City} from "../../../../city";
import {Service} from "../../../../service";

@Component({
  selector: 'nga-finance-base-assistant',
  templateUrl: './finance.base.assistant.html',
})
export class FinanceBaseAssistantComponent extends LoadableComponent implements OnInit {
  protected componentName: string = 'FinanceBaseAssistantComponent';

  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  tableData: {} = {};
  showTable: boolean = false;

  constructor(
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    protected translateService: TranslateService,
    private financeService: FinanceService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.translateService.get('Assistant Base Conditions').subscribe((text: string) => {
      this.setBreadcrumb();
      this.showInTable();
    });
  }

  private setBreadcrumb() {
    const breadcrumbs = [];
    this._state.notifyDataChanged('menu.activeLink', {title: 'Conditions'});
    const title = this.translateService.instant('List of Conditions');
    breadcrumbs.push(new Breadcrumb(title, '/pages/finance/conditions'));
    const pageTitle = this.translateService.instant('Assistant Base Conditions');
    breadcrumbs.push(new Breadcrumb(pageTitle, '/pages/finance/base-assistant-conditions', true));
    this._state.notifyDataChanged('menu.activeLink', breadcrumbs);
    this._state.notifyDataChanged('changeTitle', title);
  }

  private showInTable() {
    const requestBuilder = new DatatableRequestBuilder();
    requestBuilder.setFilter(new RequestBuilder([
        new FilterRequestField(
          'model',
          'assistant',
          FilterRequestField.MATCH_CONTENTS,
          FilterRequestField.TYPE_TEXT
        ),
      new FilterRequestField(
        'type',
        'base',
        FilterRequestField.MATCH_CONTENTS,
        FilterRequestField.TYPE_TEXT
      ),
      ]));
    this.financeService.search(requestBuilder).subscribe(res => {
      const financeRules = [];
      res.data.forEach(rawData => {
        financeRules.push(FinanceRule.fromData(rawData));
      });
      this.tableData = this.convertToTableData(financeRules);
      this.showTable = true;
    });
  }

  private convertToTableData(financeRules: any[]) {
    let res: object = {
      assistants: ['All'],
      regions: {},
    };
    financeRules.forEach( (financeRule: FinanceRule) => {
      res = this.addAssistants(res, financeRule);
      res = this.addRegions(res, financeRule)
    });
    return res;
  }

  private addAssistants(stored: object, financeRule: FinanceRule) {
    let assistantsKey = this.generateAssistantsKey(financeRule.assistants);
    if (stored['assistants'].indexOf(assistantsKey) === -1) {
      stored['assistants'].push(assistantsKey);
    }
    return stored;
  }

  private generateAssistantsKey(assistants: Assistant[]) {
    let keys = [];
    assistants.forEach((assistant: Assistant) => {
      keys.push(assistant.refKey);
    });
    if (!keys.length) {
      return 'All';
    }
    return keys.join(', ');
  }

  private addRegions(stored: object, financeRule: FinanceRule) {
    const region = this.getRegion(financeRule);
    if (!stored['regions'].hasOwnProperty(region)) {
      stored['regions'][region] = {};
    }
    const cities = this.getCities(financeRule);
    if (!stored['regions'][region].hasOwnProperty(cities)) {
      stored['regions'][region][cities] = {};
    }
    const services = this.getServices(financeRule);
    if (!stored['regions'][region][cities].hasOwnProperty(services)) {
      stored['regions'][region][cities][services] = {};
    }
    const assistantsKey = this.generateAssistantsKey(financeRule.assistants);
    if (!stored['regions'][region][cities][services].hasOwnProperty(assistantsKey)) {
      stored['regions'][region][cities][services][assistantsKey] = {};
    }
    stored['regions'][region][cities][services][assistantsKey][financeRule.title] = financeRule.value;
    return stored;
  }

  private getRegion(financeRule: FinanceRule) {
    let regions = [];
    financeRule.cities.forEach((city: City) => {
      const title = city.regionTitle;
      if (regions.indexOf(title) === -1) {
        regions.push(title);
      }
    });

    if (!regions.length) {
      return 'All';
    }

    return regions.join(', ');
  }

  private getCities(financeRule: FinanceRule) {
    let cities = [];
    financeRule.cities.forEach((city: City) => {
      const title = city.title;
      if (cities.indexOf(title) === -1) {
        cities.push(title);
      }
    });

    if (!cities.length) {
      return 'All';
    }

    return cities.join(', ');
  }

  private getServices(financeRule: FinanceRule) {
    let services = [];
    financeRule.services.forEach((service: Service) => {
      const title = service.title;
      if (services.indexOf(title) === -1) {
        services.push(title);
      }
    });

    if (!services.length) {
      return 'All'
    }

    return services.join(', ');
  }

  objectToArray(obj: object): Array<string> {
    const arr = [];
    for(let key in obj) {
      const el = {};
      el['value'] = obj[key];
      el['key'] = key;
      arr.push(el);
    }
    return arr;
  }

  countElements(obj: object) {
    let count = 0;
    for(let i in obj) {
      count++;
    }
    return count;
  }
}
