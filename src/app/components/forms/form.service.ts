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
import { Subscription } from 'rxjs';
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

  getForm(id: number): Promise<Form> {
    return this.get(id).then(response => response.data as Form);
  }

  save (form: Form): Promise<Form> {
    const action = form.id ? this.put(form.id, form) : this.store(form);
    return action.then(response => response as Form);
  }

  destroy (form: Form): Promise<any> {
    return this.remove(form.id);
  }

  downloadPdf(formId: number, formableId: number): Subscription {
    // const options = new RequestOptions({ responseType: ResponseContentType.Blob, headers: this.getAuthHeaders() });
    return this.http
      .get(this.getUrl(`${formId}/${formableId}/pdf`),
        { headers: this.getAuthHeaders(), responseType: 'blob' })
      .pipe(
        map(res => res),
      )
      // todo to see if I can sent a title from a server side to make it more readable
      .subscribe(data => saveAs(data, `report_case_${formableId}_${formableId}.pdf`), err => this.handleError(err));
  }

  getReportHtml(formId: number, formableId: number): Promise<string> {
    return this.get(`${formId}/${formableId}/html`)
      .then(response => response.data as string);
  }
}
