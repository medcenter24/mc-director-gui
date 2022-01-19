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

import { SingleLoadableProvider } from '../single.loadable.provider';
import { SingleDataSample } from './sample/single.data.sample';
import { SearchFilter } from '../../search.filter';

describe('Loadable: Single Provider', () => {
  let service: SingleLoadableProvider;
  let conf: SingleDataSample;

  beforeEach(() => {
    conf = new SingleDataSample();
    service = new SingleLoadableProvider(conf);
  });

  it('checkSearch', () => {
    expect(conf.getNumTry()).toBe(0);
    const filter: SearchFilter = SearchFilter.instance({
      fields: ['id'],
      query: '123',
    });
    const obs = service.search(filter);
    obs.subscribe({next: value => expect(value).toEqual([]), error: () => expect().nothing()});
    expect(conf.getNumTry()).toBe(1);
  });

  it('checkException', () => {
    expect(conf.getNumTry()).toBe(0);
    const filter = SearchFilter.instance();
    const obs = service.search(filter);
    obs.subscribe(data => expect(data).toEqual([]));
    obs.subscribe({
      error: err =>
        expect(err).toBe('Single Loadable Provider must have [field] and [query] filters parameters'),
    });
    expect(conf.getNumTry()).toBe(1);
  });

  it ('checkFiltering', done => {
    const filter = SearchFilter.instance({
      fields: ['id'],
      query: 1,
    });
    const obs = service.search(filter);
    obs.subscribe({
      next: data => {
        expect(data).toEqual([{
          id: 1,
          name: 'Peter',
          description: 'doctor',
        }]);
        done();
      },
      error: msg => {
        expect(msg).toBeNull();
        done();
      },
    });
  });

  it ('single provider returns all filtered data without pagination', done => {
    const filter = SearchFilter.instance({
      fields: ['id'],
      query: '',
      rows: 1,
    });
    const obs = service.search(filter);
    obs.subscribe({
      next: data => {
        expect(data).toEqual([{
          id: 1,
          name: 'Peter',
          description: 'doctor',
        }, {
          id: 2,
          name: 'Foster',
          description: 'director',
        }]);
        done();
      },
      error: err => {
        expect(err).toBeNull();
        done();
      },
    });
  });
});
