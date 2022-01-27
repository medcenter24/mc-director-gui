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

import { PaginationLoadableProvider } from '../pagination.loadable.provider';
import { PaginationDataSample } from './sample/pagination.data.sample';
import { SearchFilter } from '../../search.filter';

describe('Loadable: Pagination Provider', () => {
  let service: PaginationLoadableProvider;
  let conf: PaginationDataSample;

  beforeEach(() => {
    conf = new PaginationDataSample();
    // @ts-ignore
    service = new PaginationLoadableProvider(conf);
  });

  it('should find first page with data', function () {
    expect(conf.getNumTry()).toBe(0);
    const filter: SearchFilter = SearchFilter.instance();
    const obs = service.search(filter);
    obs.subscribe({
      next: data => expect(data).toEqual({
        data: [{
          id: 1,
          name: 'Peter',
          description: 'doctor',
        }, {
          id: 2,
          name: 'Foster',
          description: 'director',
        }, {
          id: 3,
          name: 'Abigail',
          description: 'user',
        }],
      }),
      error: error => expect(error).toBeNull(),
    });
    expect(conf.getNumTry()).toBe(1);
  });

  it('should find second page with data', function () {
    expect(conf.getNumTry()).toBe(0);
    const filter: SearchFilter = SearchFilter.instance({
      rows: 1,
      first: 1,
    });
    const obs = service.search(filter);
    obs.subscribe({
      next: value => expect(value).toEqual({
        data: [{
          id: 2,
          name: 'Foster',
          description: 'director',
        }],
      }),
      error: err => expect(err).toBeNull(),
    });
    expect(conf.getNumTry()).toBe(1);
  });
});
