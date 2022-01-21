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
import { Patient } from './patient';
import { HttpService } from '../core/http/http.service';
import {Observable} from 'rxjs';
import {ObservableTransformer} from '../../helpers/observable.transformer';

@Injectable()
export class PatientsService extends HttpService {

  protected getPrefix(): string {
    return 'director/patients';
  }

  getPatients(): Observable<Patient[]> {
    const obs = this.get();
    return new ObservableTransformer().transform(obs, r => r.data as Patient[]);
  }

  getPatient(id: number): Observable<Patient> {
    const obs = this.get(id);
    return new ObservableTransformer().transform(obs, r => r.data as Patient);
  }

  delete(id: number): Observable<void> {
    return this.remove(id);
  }

  create(patient: Patient): Observable<Patient> {
    const obs = this.store(patient);
    return new ObservableTransformer().transform(obs, r => r.data as Patient);
  }

  update(patient: Patient): Observable<Patient> {
    return this.put(patient.id, patient);
  }

  formatPatientName(name: string): string {
      name = name.toUpperCase();
      name = this.filterNameCharacters(name);
      return name;
  }

  filterNameCharacters(name: string): string {
    name = name.replace(/[^A-Z\s]/g, '');
    name = name.replace(/\s+/g, ' ');
    return name;
  }
}
