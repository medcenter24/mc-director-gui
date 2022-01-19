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
 * Copyright (c) 2020 (original work) MedCenter24.com;
 */

import { DatatableConfig } from './datatable.config';
import { DatatableResponse } from './datatable.response';
import { DatatableRequestBuilder } from '../request/datatable.request.builder';

/**
 * Main mission of this class is to make requests and update datatable statuses
 */
export class DatatableDataProvider {
  constructor (
    public config: DatatableConfig,
    public searchService: any,
  ) {
  }

  search(datatableRequestBuilder: DatatableRequestBuilder): Promise<DatatableResponse> {
    if (this.searchService && typeof this.searchService['search'] === 'function') {
      return this.searchService
        .search(datatableRequestBuilder)
        .subscribe(( response: DatatableResponse ) => {
          // this.updatePaginatorState(response);
          return response;
        } );
    }

    throw new Error('Service searchService should be defined and implement method `search`');
  }

  /*private updatePaginatorState(response: DatatableResponse): void {
    this.config.getDatatableRequestBuilder().getPaginator().setValue()
  }*/
}
