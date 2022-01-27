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

import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SelectorConfig} from '../../selector.config';
import {SearchFilter} from '../../../../core/loadable/search.filter';
import {SelectorProviderMultipleAdapterComponent} from './adapter';
import {LoadableComponent} from '../../../../core/components/componentLoader';
import {Observable} from 'rxjs';
import {ObservableTransformer} from '../../../../../helpers/observable.transformer';

@Component({
  selector: 'nga-selector-multiple',
  templateUrl: './selector.provider.multiple.html',
})
export class SelectorProviderMultipleComponent extends LoadableComponent implements OnInit {
  protected componentName: string = 'SelectorProviderMultipleComponent';

  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Income configuration
   * @param {SelectorConfig} conf
   */
  @Input() set setConfig(conf: SelectorConfig) {
    this.conf = conf;
  }

  /**
   * Selected options
   * @type {EventEmitter<any[]>}
   */
  @Output() selected: EventEmitter<any[]> = new EventEmitter<any[]>();

  /**
   * Html adapter element
   */
  @ViewChild('selectorProviderMultipleAdapter')
  adapter: SelectorProviderMultipleAdapterComponent;

  /**
   * Configuration for the current selector
   */
  conf: SelectorConfig;

  /**
   * Options to show in selector
   * According to current filter or first which were loaded from the storage
   * @type {any[]}
   */
  options: any[] = [];

  ngOnInit(): void {
    // increase limit for multiselect
    const filter = SearchFilter.instance({
      rows: 3000,
      first: 0,
    });

    new ObservableTransformer()
      .transform(this.loadData(filter.getBodyPayload()), r => this.selectItems(this.conf.preloaded));
  }

  /**
   * Make provided items selected in the selector
   * @param {any[]} items
   */
  selectItems(items: any): void {
    let selected: any = items;

    // convert to number, because json input usually stayed as a number
    if (typeof items === 'string') {
      items = +items;
    }

    if (typeof items === 'number') {
      // by ID
      selected = [this.options.find(v => v.hasOwnProperty('id') && v['id'] === items)];
    } else if (typeof items === 'object' && items.length) {
      // if list of ID's
      const isIds = items.find(v => typeof v !== 'number');
      if (!isIds) {
        selected = this.options.filter(v => v.hasOwnProperty('id') && this.options.indexOf(v['id']));
      }
    }
    if (selected && selected.length) {
      this.adapter.selectItems(selected);
    }
  }

  /**
   * Load data according to the provided filter
   * @param {SearchFilter} filter
   * @returns {Observable<any>}
   */
  loadData(filter: SearchFilter = null): Observable<any> {
    const postfix = 'LoadData';
    this.startLoader(postfix);
    const obs = this.conf.dataProvider.search(filter);
    obs.subscribe({
      next: response => {
        this.stopLoader(postfix);
        this.options = response.data;
        return this.options;
      },
      error: (e) => {
        this.stopLoader(postfix);
      },
    });
    return obs;
  }

  /**
   * On selections changed
   * @param event
   */
  onChanged(event: any[]) {
    this.selected.emit(event);
  }

}
