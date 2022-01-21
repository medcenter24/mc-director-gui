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

import { AutoCompleteProvider } from './auto.complete.provider';
import { AutoCompleteSrcConfig } from '../auto.complete.src.config';
import { ChangeDetectorRef } from '@angular/core';
import {Observable} from 'rxjs';

/**
 * Load all the data and store it for application
 */
export class AutoCompleteStaticProvider implements AutoCompleteProvider {

  /**
   * Data to show in the selector
   * @type {any[]}
   */
  filtered: Object[] = [];

  /**
   * Selected data
   */
  selected: Object|Object[];

  /**
   * All loaded data
   * @type {any[]}
   */
  private data: Object[] = [];
  /**
   * Allow only one loading
   * @type {boolean}
   */
  private loaded: boolean = false;

  constructor (
    private config: AutoCompleteSrcConfig,
    private _changeDetectionRef: ChangeDetectorRef,
  ) {
    if (!config.fieldKey) {
      console.info('Field key is empty');
    }
    this.selectItems(config.preloaded);
  }

  selectItems(items: any, fieldName: string = null): Observable<any> {
    if (typeof items === 'string') {
      items = +items;
    }
    if (typeof items === 'number') {
      this.afterLoaded(() => {
        fieldName = fieldName ?? 'id';
        this.selected = this.data.find(v => v.hasOwnProperty(fieldName) && v[fieldName] === items);
      });
    } else {
      this.selected = items;
    }
    try {
      this._changeDetectionRef.detectChanges();
    } catch (e) {
      // prevent ViewDestroyedError error
      // if click back while the page is loading
    }
    return new Observable(subscriber => subscriber.next(this.selected));
  }

  /**
   * Load Data
   * @param event
   */
  loadData(event): Observable<any> {
    return this.config.dataProvider({}).then(resp => {
      this.data = resp.data;
      this.filtered = this.data;
      this.loaded = true;
      return this.data;
    }).catch(e => {
      console.error('Error on auto complete static provider', e);
      this.loaded = false;
    });
  }

  filter(event): void {
    this.afterLoaded(() => this.filtering(event));
  }

  /**
   * Make action only after the data loaded
   * @param {Function} func
   */
  private afterLoaded(func: Function) {
    this.loaded ? func(this.data) : this.loadData('').subscribe(data => {
      func(data);
    });
  }

  /**
   * Filter data to filtered and for show
   */
  private filtering(event): void {
    this.filtered = [];
    for (const model of this.data) {
      if (model.hasOwnProperty(this.config.fieldKey)
        && model[this.config.fieldKey].toLowerCase().indexOf(event.query.toLowerCase()) !== -1) {

        this.filtered.push(model);
      }
    }
  }
}
