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
import { Doctor } from './doctor';
import { HttpService } from '../core/http/http.service';
import { City } from '../city';
import { LoadableServiceInterface } from '../core/loadable';
import {Observable} from 'rxjs';
import {ObservableTransformer} from '../../helpers/observable.transformer';

@Injectable()
export class DoctorsService extends HttpService implements LoadableServiceInterface {

  protected getPrefix(): string {
    return 'director/doctors';
  }

  getDoctors(): Observable<Doctor[]> {
    const obs = this.get();
    return new ObservableTransformer().transform(obs, r => r.data as Doctor[]);
  }

  getDoctor(id: number): Observable<Doctor> {
    const obs = this.get(id);
    return new ObservableTransformer().transform(obs, r => r.data as Doctor);
  }

  delete(id: number): Observable<void> {
    return this.remove(id);
  }

  create(doctor: Doctor): Observable<Doctor> {
    const obs = this.store(doctor);
    return new ObservableTransformer().transform(obs, r => r.data as Doctor);
  }

  update(doctor: Doctor): Observable<Doctor> {
    const obs = this.put(doctor.id, doctor);
    return new ObservableTransformer().transform(obs, r => r.data as Doctor);
  }

  getDoctorCities(id: number): Observable<City[]> {
    const obs = this.get(`${id}/cities`);
    return new ObservableTransformer().transform(obs, r => r.data as City[]);
  }

  setDoctorCities(id: number, cities: City[]): Observable<any> {
    return this.put(`${id}/cities`, { cities: cities.map(x => x.id) });
  }

  getDoctorsByCity(cityId: number): Observable<Doctor[]> {
    const obs = this.get(`cities/${cityId}`);
    return new ObservableTransformer().transform(obs, r => r.data as Doctor[]);
  }

  save (doctor: Doctor): Observable<Doctor> {
    const obs = doctor.id ? this.put(doctor.id, doctor) : this.store(doctor);
    return new ObservableTransformer().transform(obs, r => r.data as Doctor);
  }

  destroy (doctor: Doctor): Observable<any> {
    return this.remove(doctor.id);
  }
}
