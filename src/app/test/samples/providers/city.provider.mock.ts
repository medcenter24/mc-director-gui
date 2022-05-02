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

import { SearchFilter } from '../../../components/core/loadable/search.filter';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class CityProviderMock {
  private data: any = {
    data: [{
      id: 1,
      title: 'city1',
    }, {
      id: 2,
      title: 'city2',
    }, {
      id: 3,
      title: 'city3',
    }],
  };

  search(filter: SearchFilter = null): Observable<any> {
    const filtered = this.data;
    if (filter && filter.first) {
      filtered.data = filtered.data.slice(filter.first, filter.rows);
    }
    return new Observable<any>(subscriber => subscriber.next(filtered));
  }
}
