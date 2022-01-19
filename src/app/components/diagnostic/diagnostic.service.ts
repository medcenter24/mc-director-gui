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
import { Diagnostic } from './diagnostic';
import { HttpService } from '../core/http/http.service';
import { LoadableServiceInterface } from '../core/loadable';
import { Observable } from 'rxjs';

@Injectable()
export class DiagnosticService extends HttpService implements LoadableServiceInterface {

  protected getPrefix(): string {
    return 'director/diagnostics';
  }

  getDiagnostics(filters: Object): Observable<Diagnostic[]> {
    const obs = this.search(filters);
    obs.subscribe(response => response.data as Diagnostic[]);
    return obs;
  }

  delete(id: number): Observable<void> {
    return this.remove(id);
  }

  save(diagnostic: Diagnostic): Observable<Diagnostic> {
    if (diagnostic.id) {
      const obs = this.put(diagnostic.id, diagnostic);
      obs.subscribe(res => res.data as Diagnostic);
      return obs;
    } else {
      return this.store(diagnostic);
    }
  }

  destroy(diagnostic: Diagnostic): Observable<any> {
    return this.remove(diagnostic.id);
  }
}
