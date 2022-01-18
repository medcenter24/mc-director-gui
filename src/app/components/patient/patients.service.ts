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

@Injectable()
export class PatientsService extends HttpService {

  protected getPrefix(): string {
    return 'director/patients';
  }

  getPatients(): Promise<Patient[]> {
    return this.get().then(response => response.data as Patient[]);
  }

  getPatient(id: number): Promise<Patient> {
    return this.get(id).then(response => response.data as Patient);
  }

  delete(id: number): Promise<void> {
    return this.remove(id);
  }

  create(patient: Patient): Promise<Patient> {
    return this.store(patient).then(res => res as Patient);
  }

  update(patient: Patient): Promise<Patient> {
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
