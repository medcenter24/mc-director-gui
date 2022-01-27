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

import { Configurable } from '../configurable';

export class SearchFilter extends Configurable {

  constructor (
    /**
     * `Offset for the data slice
     * Searching can work with parameter 'first' or with parameter 'page', 'first' parameter has priority
     * @type {boolean}
     */
    public first: number = null,
    /**
     * `Amount of rows to select
     * alias to limit
     * @type {number}
     */
    public rows: number = 25,
    /**
     * Page number
     * @type {number}
     */
    public page: number = 0,
    /**
     * `Field to sorting results
     * @type {string}
     */
    public sortField: string = '',
    /**
     * `Ordering results ASC or DESC
     * if > 0 = ASC or = DESC
     * @type {number}
     */
    public sortOrder: number = 1,
    /**
     * `Fields for the filtering
     * @type {any[]}
     */
    public fields: string[] = [],
    /**
     * Query for the filtering
     * @type {string}
     */
    public query: string = '',
  ) {
    super();
  }

  // todo add other parameter converted to filters
  public getBodyPayload(): object {
    return {
      paginator: {
        fields: [
          {field: 'limit', value: this.rows},
          {field: 'offset', value: this.first},
        ],
      },
    };
  }
}
