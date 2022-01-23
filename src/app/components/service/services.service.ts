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
import { Service } from './service';
import { HttpService } from '../core/http/http.service';
import { LoadableServiceInterface } from '../core/loadable';
import { Observable } from 'rxjs';
import {ObservableTransformer} from '../../helpers/observable.transformer';

@Injectable()
export class ServicesService extends HttpService implements LoadableServiceInterface {

  protected getPrefix(): string {
    return 'director/services';
  }

  getServices(filters: Object): Observable<Service[]> {
    const obs = this.search(filters);
    return new ObservableTransformer().transform(obs, r => r.data as Service[]);
  }

  getService(id: number): Observable<Service> {
    const obs = this.get(id);
    return new ObservableTransformer().transform(obs, r => r.data as Service);
  }

  save(service: Service): Observable<Service> {
    const obs = service.id ? this.put(service.id, service) : this.store(service);
    return new ObservableTransformer().transform(obs, r => r.data as Service);
  }

  destroy(service: Service): Observable<any> {
    return this.remove(service.id);
  }
}
