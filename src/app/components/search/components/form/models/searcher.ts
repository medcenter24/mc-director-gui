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

import {SearchFilters} from './search.filters';
import {CaseTypeSelectComponent} from '../../../../case/components/type/case.type.select.component';
import {SmartSearch} from '../../smartSearch';
import {SearchField} from '../contracts/searhc.field';

export class Searcher {
  constructor(
    public id: number = 0,
    public title: string = '',
    public type: string = '',
    public result: string = 'datatable',
    public filters: SearchFilters = new SearchFilters(),
    public fields: SearchField[] = [],
  ) {
  }

  hasData(): boolean {
    return this.hasFields() || this.hasFilters();
  }

  hasFilters(): boolean {
    return this.filters.hasFilters();
  }

  hasFields(): boolean {
    return this.fields.length > 0;
  }

  hasDoctorCase(): boolean {
    return this.filters.caseableTypes.includes(CaseTypeSelectComponent.getDoctorType());
  }

  static fromSmartSearch(smartSearch: SmartSearch): Searcher {
    const searcher = new Searcher(
      smartSearch['id'],
      smartSearch['title'],
      smartSearch['type'],
    );

    const data = JSON.parse(smartSearch.getBody());
    searcher.result = data['result'];
    searcher.loadFilters(data['filters']);
    searcher.loadFields(data['fields']);

    return searcher;
  }

  loadFilters(filters: any[]) {
    for (const filtersKey in filters) {
      if (filters.hasOwnProperty(filtersKey)) {
        this.filters[filtersKey] = filters[filtersKey];
      }
    }
  }

  loadFields(fields: any[]) {
    if (fields.length) {
      for (const field of fields) {
        this.fields.push(field);
      }
    }
  }
}
