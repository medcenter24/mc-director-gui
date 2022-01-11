/**
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

import { Component, Input, ChangeDetectorRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { LoadableComponent } from '../../core/components/componentLoader';
import { LazyLoadEvent } from 'primeng/api';
import {
  DatatableAction,
  DatatableCol,
  DatatableConfig,
  DatatablePaginationService,
  DatatableResponse,
  DatatableTransformer,
} from './entities';
import { Location } from '@angular/common';
import { UrlHelper } from '../../../helpers/url.helper';
import { Table } from 'primeng/table';
import { DatatableRequestBuilder } from './request/datatable.request.builder';
import { DatatableSortService } from './services/datatable.sort.service';
import { Router } from '@angular/router';

@Component({
  selector: 'nga-datatable',
  templateUrl: './datatable.html',
})
export class DatatableComponent extends LoadableComponent {
  protected componentName: string = 'DatatableComponent';

  private _config: DatatableConfig ;
  private preloadDelay;

  @Input() set config(config: DatatableConfig) {

    if (!config) {
      throw new Error('Configuration is not set');
    } else {
      this._config = config;
      this.initialize();
    }
  }

  @Output() sorted: EventEmitter<void> = new EventEmitter<void>();
  @Output() filtered: EventEmitter<void> = new EventEmitter<void>();
  @Output() pagination: EventEmitter<void> = new EventEmitter<void>();
  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  /**
   * it is used by this component only
   * we can't use it as external selector
   * to use it from elsewhere outside we need to to use this.refresh method (facade)
   */
  @ViewChild('datatable')
    private datatable: Table;

  data: any[];
  loading: boolean = false;
  selectedData: any;
  lazyLoadEvent: LazyLoadEvent;
  paginationService: DatatablePaginationService;
  private sortService: DatatableSortService;

  /**
   * Count rows that shown in the datatable
   */
  rows: number = 0;
  /**
   * total amount of rows that selected for datatable
   */
  total: number = 0;

  constructor (
    private cdr: ChangeDetectorRef,
    private location: Location,
    private router: Router,
  ) {
    super();
  }

  private initialize() {
    if (this.getConfig() && this.getConfig().get('showRefreshBtn')) {
      this.getConfig().controlPanelActions.push(new DatatableAction(
        this.getConfig().refreshBtnTitle,
        'fa fa-refresh',
        () => {
          this.refresh();
      }));
    }

    this.paginationService = new DatatablePaginationService( this.getConfig(), this.location );
    this.sortService = new DatatableSortService(this.getConfig(), this.location);

    // first loading of the table
    this.refresh();
  }

  // if I want to clean all selections
  deselectAll(): void {
    this.selectedData = [];
  }

  loadLazy(event: LazyLoadEvent) {
    this.lazyLoadEvent = event;
  }

  requestData(requestBuilder: DatatableRequestBuilder): void {
    if (!this.getConfig().get('dataProvider')) {
      throw new Error('Data provider was not configured for DataTable');
    }

    if (this.preloadDelay) {
      // to avoid quick updates
      clearTimeout(this.preloadDelay);
    }

    this.preloadDelay = setTimeout(() => {
      if (
        this.getConfig().get('dataProvider')
        && typeof this.getConfig().get('dataProvider')['search'] === 'function'
      ) {
        this.setLoading(true);
        this.getConfig().get( 'dataProvider' ).search( requestBuilder )
          .then( ( response: DatatableResponse ) => {
            this.setLoading( false );
            this.data = response.data;
            this.total = response.meta.pagination.total;
            this.rows = this.data.length;
            this.setUri(requestBuilder.toUrl());
          } ).catch( () => {
            this.setLoading( false );
          } );
      }
    }, 500);
  }

  private setUri(uri: string): void {
    let location = this.location.path(true);

    const uriVars = UrlHelper.getQueryVariables(uri);
    // delete unused parameters from the query
    UrlHelper.getQueryVariables(location)
      .forEach((obj: Object) => {
        Object.keys(obj).forEach((key: string) => {
          const filtered = uriVars.filter((uriVar: Object) => uriVar.hasOwnProperty(key));
          const replaceVal = filtered.length ? filtered.pop()[key] : '';
          location = UrlHelper.replaceOrAdd(location, key, replaceVal);
        });
      });
    // adding new parameters to query
    UrlHelper.getQueryVariables(uri)
      .forEach((obj) => {
        Object.keys(obj).forEach((key) => {
          location = UrlHelper.replaceOrAdd(location, key, obj[key]);
        });
      });

    if (location.includes('?')) {
      const queryParams = { queryParams: UrlHelper.getQueryVarsAsObject(location) };
      this.router.navigate([`${location.split('?')[0]}`], queryParams);
    } else {
      this.router.navigate([location]);
    }
  }

  private setLoading(state: boolean): void {
    this.loading = state;
    this.cdr.detectChanges();
    if (this.loading) {
      this.startLoader( this.componentName );
    } else {
      this.stopLoader( this.componentName );
    }
  }

  onRowSelect (event): void {
    this.getConfig().onRowSelect(event);
  }

  private datatableRequestBuilder(): DatatableRequestBuilder {
    return this.getConfig().getDatatableRequestBuilder();
  }

  refresh(): void {
    const requestBuilder = this.datatableRequestBuilder();
    if (requestBuilder) {
      this.requestData(requestBuilder);
    } else {
      throw new Error('Datatable RequestBuilder not initialized, so can not load any data');
    }
  }

  showData(rowData: string[], col: DatatableCol): string {
    const transformer: DatatableTransformer = this.getTransformer(col);
    return transformer.transform(rowData[col.field], rowData);
  }

  private getTransformer(col: DatatableCol): DatatableTransformer {
    let transformer;
    if (this.getConfig().transformers) {
      transformer = this.getConfig().transformers.find(tr => tr.field === col.field);
    }

    return transformer || new DatatableTransformer(col.field);
  }

  /**
   * Update current model in the datatable
   * @param {Object} model
   * @return {boolean}
   */
  updateModel(model: Object): boolean {
    if (!model || !model.hasOwnProperty('id')) {
      throw Error('You need to implement your own updater since this model does not have id');
    }
    let found = false;
    this.data.forEach((val, ind) => {
      if (val.id === model['id']) {
        this.data[ind] = model;
        found = true;
      }
    });
    return found;
  }

  onPageChange(event): void {
    this.paginationService.changePage(event);
    if (this.lazyLoadEvent) {
      this.refresh();
    }
    this.pagination.emit();
  }

  /**
   * To get current datatable configuration
   */
  getConfig(): DatatableConfig {
    return this._config;
  }

  /**
   * Datatable Sorted
   */
  onSorted(): void {
    this.refresh();
    this.sorted.emit();
  }

  /**
   * Datatable Sorted
   */
  onFilter(): void {
    this.refresh();
    this.filtered.emit();
  }
}
