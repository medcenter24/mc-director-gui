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

import { DatatableAction } from './datatable.action';
import { DatatableCol } from './datatable.col';
import { DatatableTransformer } from './datatable.transformer';
import { DatatableRequestBuilder } from '../request/datatable.request.builder';
import { DatatableDataProvider } from './datatable.data.provider';

export class DatatableConfig {

  constructor (
    /**
     * dataProvider it is HttpService or any service that has search() method
     * to get the data
     */
    public dataProvider: DatatableDataProvider = null,
    public requestBuilder: DatatableRequestBuilder = new DatatableRequestBuilder(),
    public lazy: boolean = true,
    public paginator: boolean = true,
    public selectionMode: string = 'single',
    public controlPanel: boolean = false,
    public controlPanelActions: DatatableAction[] = null,
    public captionPanelActions: DatatableAction[] = null,
    public transformers: DatatableTransformer[] = null,
    public captionPanel: boolean = false,
    public csvExportAll: boolean = false,
    public csvExportAllTitle: string = 'All Data',
    public csvExportSelections: boolean = false,
    public csvExportSelectionsTitle: string = 'Selection Only',
    public cols: DatatableCol[] = null,
    public onRowSelect: Function = function() { },
    public showTotal: boolean = true,
    public refreshBtnTitle: string = '',
    public showRefreshBtn: boolean = true,

    /**
     * to Show filters next to the head column
     * @type boolean
     */
    public hasFilterRow: boolean = false,

    /**
     * Class for the main <table> element
     * @type string
     */
    public tableClass: string = '',
  ) { }

  /**
   * Apply configuration from the object
   * @param configuration
   */
  static factory(configuration: Object) {
    const config = new DatatableConfig();
    if (configuration) {
      Object.keys(config).forEach((prop: string) => config.update(prop, configuration));
    }
    return config;
  }

  update(key: string, fromConf: Object) {
    if (fromConf.hasOwnProperty(key)) {
      this[key] = fromConf[key];
    }
  }

  get(key: string): any {
    return this[key] || '';
  }

  getDatatableRequestBuilder(): DatatableRequestBuilder {
    return this.get('requestBuilder');
  }
}
