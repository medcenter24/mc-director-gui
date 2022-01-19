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

import { Injectable } from '@angular/core';
import { City } from './city';
import { HttpService } from '../core/http/http.service';
import { Observable } from 'rxjs';

@Injectable()
export class CitiesService extends HttpService {

  protected getPrefix(): string {
    return 'director/cities';
  }

  getCities(): Observable<City[]> {
    const obs = this.get();
    obs.subscribe(response => response.data as City[]);
    return obs;
  }

  getCity (id: number): Observable<City> {
    const obs = this.get(id);
    obs.subscribe(response => response.data as City);
    return obs;
  }

  delete (id: number): Observable<void> {
    return this.remove(id);
  }

  create (city: City): Observable<City> {
    const obs = this.store(city);
    obs.subscribe(res => res.json() as City);
    return obs;
  }

  update (city: City): Observable<City> {
    return this.put(city.id, city);
  }

  save (city: City): Observable<City> {
    const action = city.id ? this.put(city.id, city) : this.store(city);
    action.subscribe(response => response.data as City);
    return action;
  }

  destroy (city: City): Observable<any> {
    return this.remove(city.id);
  }
}
