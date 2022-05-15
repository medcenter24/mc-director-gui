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
import {ObservableTransformer} from '../../helpers/observable.transformer';
import {randomUUID} from 'crypto';
import {HttpResponse} from '@angular/common/http';

@Injectable()
export class FormService extends HttpService implements LoadableServiceInterface {
  protected getPrefix(): string {
    return 'director/forms';
  }

  getForm(id: number): Observable<Form> {
    const obs = this.get(id);
    return new ObservableTransformer().transform(obs, r => r.data as Form);
  }

  save (form: Form): Observable<Form> {
    const obs = form.id ? this.put(form.id, form) : this.store(form);
    return new ObservableTransformer().transform(obs, r => r.data as Form);
  }

  destroy (form: Form): Observable<any> {
    return this.remove(form.id);
  }

  downloadPdf(formId: number, formableId: number): Observable<any> {

    // fix an issue with browser cache
    const current = new Date();
    current.setHours(0);
    current.setMinutes(0);
    current.setSeconds(0);
    current.setMilliseconds(0);
    const cacheTime = current. getTime();

    const obs = this.http
      .get(this.getUrl(`${formId}/${formableId}/pdf?cache=${cacheTime}`),
        {
          headers: this.getAuthHeaders(),
          observe: 'response',
          responseType: 'blob',
        });

      // todo to see if I can sent a title from a server side to make it more readable
      obs.subscribe(
        (response: HttpResponse<Blob>) => {
          const disposition = response.headers.get('content-disposition');
          const name = disposition.substr(21);
          saveAs(response.body, name || `report_case_${formableId}.pdf`);
        },
          err => this.handleError(err),
      );
      return obs;
  }

  getReportHtml(formId: number, formableId: number): Observable<string> {
    const obs = this.get(`${formId}/${formableId}/html`);
    return new ObservableTransformer().transform(obs, r => r.data as string);
  }
}
