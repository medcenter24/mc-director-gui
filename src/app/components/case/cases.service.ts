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

import {Injectable} from '@angular/core';
import {PaymentViewer} from '../finance/components/payment/components/block/payment.viewer';
import {Service} from '../service';
import {DoctorAccident} from '../doctorAccident/doctorAccident';
import {HospitalAccident} from '../hospitalAccident/hospitalAccident';
import {Diagnostic} from '../diagnostic/diagnostic';
import {HttpService} from '../core/http/http.service';
import {Document} from '../document/document';
import {AccidentCheckpoint} from '../accident/components/checkpoint/checkpoint';
import {AccidentScenario} from '../accident/components/scenario/scenario';
import {Survey} from '../survey';
import {Accident} from '../accident/accident';
import {AccidentHistory} from '../accident/components/history/history';
import {Commentary} from '../comment/commentary';
import {LoadableServiceInterface} from '../core/loadable';
import {Observable} from 'rxjs';
import {ObservableTransformer} from '../../helpers/observable.transformer';
import {CaseAccident} from './case';

@Injectable()
export class CasesService extends HttpService implements LoadableServiceInterface {

  protected getPrefix(): string {
    return 'director/cases';
  }

  getDocumentsUrl(id): string {
    return `${this.getUrl()}/${id}/documents`;
  }

  getDocuments(id): Observable<Document[]> {
    const obs = this.get(`${id}/documents`);
    return new ObservableTransformer().transform(obs, r => r.data as Document[]);
  }

  getCaseServices(id: number): Observable<Service[]> {
    const obs = this.get(`${id}/services`);
    return new ObservableTransformer().transform(obs, r => r.data as Service[]);
  }

  getCaseDiagnostics(id: number): Observable<Diagnostic[]> {
    const obs = this.get(`${id}/diagnostics`);
    return new ObservableTransformer().transform(obs, r => r.data as Diagnostic[]);
  }

  getCaseSurveys(id: number): Observable<Survey[]> {
    const obs = this.get(`${id}/surveys`);
    return new ObservableTransformer().transform(obs, r => r.data as Survey[]);
  }

  getCheckpoints(id: number): Observable<AccidentCheckpoint[]> {
    const obs = this.get(`${id}/checkpoints`);
    return new ObservableTransformer().transform(obs, r => r.data as AccidentCheckpoint[]);
  }

  getDoctorCase(id: number): Observable<DoctorAccident> {
    const obs = this.get(`${id}/doctorcase`);
    return new ObservableTransformer().transform(obs, r => r.data as DoctorAccident);
  }

  getHospitalCase(id: number): Observable<HospitalAccident> {
    const obs = this.get(`${id}/hospitalcase`);
    return new ObservableTransformer().transform(obs, r => r.data as HospitalAccident);
  }

  getImportUrl(): string {
    return `${this.getPrefix()}/importer`;
  }

  saveCase(data): Observable<CaseAccident> {
    const obs = data.accident.id ? this.put(data.accident.id, data) : this.store(data);
    return new ObservableTransformer().transform(obs, r => r.data as CaseAccident);
  }

  closeCase(id: number): Observable<any> {
    return this.put(`${id}/close`, {});
  }

  deleteCase(id: number): Observable<any> {
    return this.remove(id);
  }

  getScenario(id: number): Observable<AccidentScenario[]> {
    const obs = this.get(`${id}/scenario`);
    return new ObservableTransformer().transform(obs, r => r.data as AccidentScenario[]);
  }

  getHistory(accident: Accident): Observable<AccidentHistory[]> {
    const obs = this.get(`${accident.id}/history`);
    return new ObservableTransformer().transform(obs, r => r.data as AccidentHistory[]);
  }

  getCommentaries(accident: Accident): Observable<Commentary[]> {
    const obs = this.get(`${accident.id}/comments`);
    return new ObservableTransformer().transform(obs, r => r.data as Commentary[]);
  }

  createComment(accident: Accident, text: string): Observable<Commentary> {
    const obs = this.http.post(
      this.getUrl(`${accident.id}/comments`),
      JSON.stringify({text}),
      {headers: this.getAuthHeaders()},
    );
    return new ObservableTransformer().transform(
      obs,
        r => r.data as Commentary,
        error => this.handleError(error),
    );
  }

  getFinance(accident: Accident, types: string[]): Observable<PaymentViewer[]> {
    let typesUri = '';
    if (types.length) {
      typesUri = `?types=${types.join(',')}`;
    }
    const obs = this.get(`${accident.id}/finance${typesUri}`);
    return new ObservableTransformer()
      .transform(obs, r => r.data.map(row => PaymentViewer.fromData(row)))
  }

  saveFinance(accident: Accident, type: string, data: Object): Observable<PaymentViewer[]> {
    const obs = this.put(`${accident.id}/finance/${type}`, data);
    return new ObservableTransformer()
      .transform(obs, r => r.data.map(row => PaymentViewer.fromData(row)));
  }
}
