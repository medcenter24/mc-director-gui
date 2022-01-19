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
import { ObjectHelper } from '../../helpers/object.helper';
import { HttpService } from '../core/http/http.service';
import { Form } from '../forms';
import { Upload } from '../upload/upload';
import { Invoice } from './invoice';
import { Observable } from 'rxjs';

@Injectable()
export class InvoiceService extends HttpService {

  protected getPrefix(): string {
    return 'director/invoice';
  }

  save(invoice: any): Observable<Invoice> {
    const action = invoice && +invoice.id ? this.put(invoice.id, invoice) : this.store(invoice);
    action.subscribe(response => response as Invoice);
    return action;
  }

  assignFile(invoice: Invoice, file: Upload): Observable<Invoice> {
    if (!file || typeof file.id === 'undefined') {
      return new Observable<Invoice>(subscriber => subscriber.error('File should be provided'));
    }
    return this.save(ObjectHelper.extend(invoice, { fileId: file.id }));
  }

  assignForm(invoice: Invoice, form: Form): Observable<Invoice> {
    if (!form || typeof form.id === 'undefined') {
      return new Observable<Invoice>(subscriber => subscriber.error('Form should be provided'));
    }
    return this.save(ObjectHelper.extend(invoice, { formId: form.id }));
  }

  getForm(invoice: Invoice): Observable<Form> {
    const obs = this.get(`${invoice.id}/form`);
    obs.subscribe(response => response.data as Form);
    return obs;
  }

  getFile(invoice: Invoice): Observable<Upload> {
    const obs = this.get(`${invoice.id}/file`);
    obs.subscribe(response => response.data as Upload);
    return obs;
  }
}
