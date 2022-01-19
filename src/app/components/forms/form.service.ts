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
import {Observable} from 'rxjs';
import { HttpService } from '../core/http/http.service';
import { LoadableServiceInterface } from '../core/loadable';
import { Form } from './form';
import { saveAs } from 'file-saver';
import { map } from 'rxjs/operators';

@Injectable()
export class FormService extends HttpService implements LoadableServiceInterface {
  protected getPrefix(): string {
    return 'director/forms';
  }

  getForm(id: number): Observable<Form> {
    const obs = this.get(id);
    obs.subscribe(response => response.data as Form);
    return obs;
  }

  save (form: Form): Observable<Form> {
    const action = form.id ? this.put(form.id, form) : this.store(form);
    action.subscribe(response => response as Form);
    return action;
  }

  destroy (form: Form): Observable<any> {
    return this.remove(form.id);
  }

  downloadPdf(formId: number, formableId: number): Observable<any> {
    const obs = this.http
      .get(this.getUrl(`${formId}/${formableId}/pdf`),
        { headers: this.getAuthHeaders(), responseType: 'blob' })
      .pipe(
        map(res => res),
      );

      // todo to see if I can sent a title from a server side to make it more readable
      obs.subscribe(data => saveAs(data, `report_case_${formableId}_${formableId}.pdf`), err => this.handleError(err));
      return obs;
  }

  getReportHtml(formId: number, formableId: number): Observable<string> {
    const obs = this.get(`${formId}/${formableId}/html`);
    obs.subscribe(response => response.data as string);
    return obs;
  }
}
