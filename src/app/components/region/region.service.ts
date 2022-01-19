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
import { Region } from './region';
import { HttpService } from '../core/http/http.service';
import {Observable} from 'rxjs';

@Injectable()
export class RegionService extends HttpService {

  protected getPrefix(): string {
    return 'director/regions';
  }

  delete (id: number): Observable<void> {
    return this.remove(id);
  }

  create (region: Region): Observable<Region> {
    const obs = this.store(region);
    obs.subscribe(res => res.json() as Region);
    return obs;
  }

  update (region: Region): Observable<Region> {
    return this.put(region.id, region);
  }

  save (region: Region): Observable<Region> {
    const action = region.id ? this.put(region.id, region) : this.store(region);
    action.subscribe(response => response.data as Region);
    return action;
  }

  destroy (region: Region): Observable<any> {
    return this.remove(region.id);
  }
}
