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
import { Hospital } from './hospital';
import { HttpService } from '../core/http/http.service';
import {Observable} from 'rxjs';
import {ObservableTransformer} from '../../helpers/observable.transformer';

@Injectable()
export class HospitalsService extends HttpService {

  protected getPrefix(): string {
    return 'director/hospitals';
  }

  getHospitals(): Observable<Hospital[]> {
    const obs = this.get();
    return new ObservableTransformer().transform(obs, r => r.data as Hospital[]);
  }

  getHospital(id: number): Observable<Hospital> {
    const obs = this.get(id);
    return new ObservableTransformer().transform(obs, r => r.data as Hospital);
  }

  delete(id: number): Observable<void> {
    return this.remove(id);
  }

  create(hospital: Hospital): Observable<Hospital> {
    const obs = this.store(hospital);
    return new ObservableTransformer().transform(obs, r => r.data as Hospital);
  }

  update(hospital: Hospital): Observable<Hospital> {
    return this.put(hospital.id, hospital);
  }

  save (hospital: Hospital): Observable<Hospital> {
    const obs = hospital.id ? this.put(hospital.id, hospital) : this.store(hospital);
    return new ObservableTransformer().transform(obs, r => r.data as Hospital);
  }

  destroy (hospital: Hospital): Observable<any> {
    return this.remove(hospital.id);
  }
}
