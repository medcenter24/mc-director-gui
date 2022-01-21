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
import { Accident } from './accident';
import { HttpService } from '../core/http/http.service';
import { Observable } from 'rxjs';
import {ObservableTransformer} from '../../helpers/observable.transformer';

@Injectable()
export class AccidentsService extends HttpService {

  protected getPrefix (): string {
    return 'director/accidents';
  }

  getAccidents(): Observable<Accident[]> {
    return new ObservableTransformer().transform(this.get(), r => r.data as Accident[]);
  }

  getAccident(id: number): Observable<Accident> {
    return new ObservableTransformer().transform(this.get(id), r => r.data as Accident);
  }

  delete(id: number): Observable<void> {
    return this.remove(id);
  }

  destroy ( model: Accident ): Observable<any> {
    return this.delete(model.id);
  }

  create(accident: Accident): Observable<Accident> {
    return new ObservableTransformer().transform(this.store(accident), r => r.data as Accident);
  }

  update(accident: Accident): Observable<Accident> {
    return this.put(accident.id, accident);
  }

  save ( model: Accident ): Observable<any> {
    return model.id ? this.update(model) : this.create(model);
  }
}
