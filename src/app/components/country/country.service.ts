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
 * Copyright (c) 2019 (original work) MedCenter24.com;
 */

import { Injectable } from '@angular/core';
import { Country } from './country';
import { HttpService } from '../core/http/http.service';
import {Observable} from 'rxjs';
import {ObservableTransformer} from '../../helpers/observable.transformer';

@Injectable()
export class CountryService extends HttpService {

  protected getPrefix(): string {
    return 'director/countries';
  }

  delete (id: number): Observable<void> {
    return this.remove(id);
  }

  create (country: Country): Observable<Country> {
    const obs = this.store(country);
    return new ObservableTransformer().transform(obs, r => r.data as Country);
  }

  update (country: Country): Observable<Country> {
    return this.put(country.id, country);
  }

  save (country: Country): Observable<Country> {
    const obs = country.id ? this.put(country.id, country) : this.store(country);
    return new ObservableTransformer().transform(obs, r => r.data as Country);
  }

  destroy (country: Country): Observable<any> {
    return this.remove(country.id);
  }
}
