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
import { FilterRequestField } from '../../../../core/http/request/fields';
import {Observable} from 'rxjs';
import {ObservableTransformer} from '../../../../../helpers/observable.transformer';

/**
 * Loads only limit count of rows and for each request going to the server
 */
export class AutoCompleteLoadableProvider implements AutoCompleteProvider {

  /**
   * Data to show in the selector
   * @type {any[]}
   */
  filtered: Object[] = [];

  /**
   * Chosen data
   */
  selected: Object|Object[];

  /**
   * Total amount of data
   */
  total: number = 0;

  constructor (private config: AutoCompleteSrcConfig) {}

  /**
   * Load Data
   * @param event
   */
  loadData(event): Observable<any> {
    const filterRequestField = new FilterRequestField(
      this.config.fieldKey,
      event.query,
      FilterRequestField.MATCH_CONTENTS,
      FilterRequestField.TYPE_TEXT,
    );
    return this.searchData(filterRequestField);
  }

  private searchData(filterRequestField: FilterRequestField): Observable<any> {
    return this.config.dataProvider({
      filter: {
        fields: [
          filterRequestField,
        ],
      },
    });
  }

  filter(event): void {
    this.loadData(event).subscribe(response => {
      this.total = response.meta.pagination.total;
      return this.filtered = response.data;
    });
  }

  /**
   * Select new selection
   * @param {any} items
   * @param fieldName
   */
  selectItems(items: any, fieldName: string = null): Observable<any> {
    // if int id provided - try to load resource with the service
    if (typeof items === 'number' && items) {

      return new ObservableTransformer()
        .transform(
          this.findByField(items, fieldName),
            res => {
              if (res.hasOwnProperty('data') && res['data'].length) {
                this.selected = res.data[0];
                return this.selected;
              } else {
                console.error(`Record with ID ${items} not found`);
              }
            });
    } else {
      this.selected = items;
      return new Observable(subscriber => subscriber.next(this.selected));
    }
  }

  private findByField(id: number, fieldName: string = null): Observable<any> {
    const filterRequestField = new FilterRequestField(
      fieldName ?? 'id',
      `${id}`,
      FilterRequestField.MATCH_EQ,
      FilterRequestField.TYPE_TEXT,
    );

    return this.searchData(filterRequestField);
  }
}
