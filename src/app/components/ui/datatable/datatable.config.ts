/*
 * Copyright (c) 2018.
 *
 * @author Zagovorychev Olexandr <zagovorichev@gmail.com>
 */

import { DatatableAction } from './datatable.action';
import { DatatableCol } from './datatable.col';
import { DatatableTransformer } from './datatable.transformer';

export class DatatableConfig {

  constructor (
    public dataProvider: Function = function (filters: Object) {},
    public lazy: boolean = true,
    public paginator: boolean = true,
    public rows: number = 25,
    public offset: number = 0,
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
    public onRowSelect: Function = function (event) {},
    public showTotal: boolean = true,
    public refreshBtnTitle: string = 'Refresh',
    public showRefreshBtn: boolean = true,
    /**
     * https://www.primefaces.org/primeng/#/table/sort
     * 'single', 'multiple'
     * @type {string}
     */
    public sortMode: string = 'single',
    /**
     * it turns sorting on|off
     * @type {boolean}
     */
    public sort: boolean = false,
    /**
     * field to sort by on the init
     * @type {null}
     */
    public sortBy: string = null,
    /**
     * 1 - asc
     * -1 - desc
     * @type {number}
     */
    public sortOrder: number = 1,
    /**
     * if present then will be shown sorting on that fields
     * @type {null}
     */
    public sortable: string[] = null,
  ) { }

  /**
   * Apply configuration from the object
   * @param configuration
   */
  static factory(configuration: Object) {
    const config = new DatatableConfig();
    if (configuration) {
      config.update('dataProvider', configuration);
      config.update('lazy', configuration);
      config.update('paginator', configuration);
      config.update('rows', configuration);
      config.update('offset', configuration);
      config.update('selectionMode', configuration);
      config.update('controlPanel', configuration);
      config.update('captionPanel', configuration);
      config.update('controlPanelActions', configuration);
      config.update('captionPanelActions', configuration);
      config.update('csvExportAll', configuration);
      config.update('csvExportAllTitle', configuration);
      config.update('csvExportSelections', configuration);
      config.update('csvExportSelectionsTitle', configuration);
      config.update('cols', configuration);
      config.update('onRowSelect', configuration);
      config.update('showTotal', configuration);
      config.update('refreshBtnTitle', configuration);
      config.update('showRefreshBtn', configuration);
      config.update('transformers', configuration);
      config.update('sortMode', configuration);
      config.update('sort', configuration);
      config.update('sortBy', configuration);
      config.update('sortOrder', configuration);
      config.update('sortable', configuration);
    }
    return config;
  }

  update(key: string, fromConf: Object) {
    if (fromConf.hasOwnProperty(key)) {
      this[key] = fromConf[key];
    }
  }
}