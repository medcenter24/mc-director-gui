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
import { AccidentType } from './type';
import { HttpService } from '../../../core/http/http.service';
import { Observable } from 'rxjs';

@Injectable()
export class AccidentTypesService extends HttpService {

  protected getPrefix(): string {
    return 'director/types';
  }

  getTypes(): Observable<AccidentType[]> {
    const obs = this.get();
    obs.subscribe(response => response.data as AccidentType[]);
    return obs;
  }

  getType(id: number): Observable<AccidentType> {
    const obs = this.get(id);
    obs.subscribe(response => response.data as AccidentType);
    return obs;
  }

  delete(id: number): Observable<void> {
    return this.remove(id);
  }

  create(type: AccidentType): Observable<AccidentType> {
    const obs = this.store(type);
    obs.subscribe(res => res.data as AccidentType);
    return obs;
  }

  update(type: AccidentType): Observable<AccidentType> {
    return this.put(type.id, type);
  }
}
