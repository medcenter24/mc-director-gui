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
    obs.subscribe(response => response.data as Document[]);
    return obs;
  }

  getCaseServices(id: number): Observable<Service[]> {
    const obs = this.get(`${id}/services`);
    obs.subscribe(response => response.data as Service[]);
    return obs;
  }

  getCaseDiagnostics(id: number): Observable<Diagnostic[]> {
    const obs = this.get(`${id}/diagnostics`);
    obs.subscribe(response => response.data as Diagnostic[]);
    return obs;
  }

  getCaseSurveys(id: number): Observable<Survey[]> {
    const obs = this.get(`${id}/surveys`);
    obs.subscribe(response => response.data as Survey[]);
    return obs;
  }

  getCheckpoints(id: number): Observable<AccidentCheckpoint[]> {
    const obs = this.get(`${id}/checkpoints`);
    obs.subscribe(response => response.data as AccidentCheckpoint[]);
    return obs;
  }

  getDoctorCase(id: number): Observable<DoctorAccident> {
    const obs = this.get(`${id}/doctorcase`);
    obs.subscribe(response => response.data as DoctorAccident);
    return obs;
  }

  getHospitalCase(id: number): Observable<HospitalAccident> {
    const obs = this.get(`${id}/hospitalcase`);
    obs.subscribe(response => response.data as HospitalAccident);
    return obs;
  }

  getImportUrl(): string {
    return `${this.getPrefix()}/importer`;
  }

  saveCase(data): Observable<any> {
    return data.accident.id ? this.put(data.accident.id, data) : this.store(data);
  }

  closeCase(id: number): Observable<any> {
    return this.put(`${id}/close`, {});
  }

  deleteCase(id: number): Observable<any> {
    return this.remove(id);
  }

  getScenario(id: number): Observable<AccidentScenario[]> {
    const obs = this.get(`${id}/scenario`);
    obs.subscribe(response => response.data as AccidentScenario[]);
    return obs;
  }

  getHistory(accident: Accident): Observable<AccidentHistory[]> {
    const obs = this.get(`${accident.id}/history`);
    obs.subscribe(response => response.data as AccidentHistory[]);
    return obs;
  }

  getCommentaries(accident: Accident): Observable<Commentary[]> {
    const obs = this.get(`${accident.id}/comments`);
    obs.subscribe(response => response.data as Commentary[]);
    return obs;
  }

  createComment(accident: Accident, text: string): Observable<any> {
    const obs = this.http.post(
      this.getUrl(`${accident.id}/comments`),
      JSON.stringify({text}),
      {headers: this.getAuthHeaders()},
    );
    obs.subscribe({
      next: response => response as Commentary,
      error: error => this.handleError(error),
    });
    return obs;
  }

  getFinance(accident: Accident, types: string[]): Observable<PaymentViewer[]> {
    let typesUri = '';
    if (types.length) {
      typesUri = `?types=${types.join(',')}`;
    }
    const obs = this.get(`${accident.id}/finance${typesUri}`);
    obs.subscribe(response => {
        let res = [];
        if (response && 'data' in response) {
          res = response['data'] as PaymentViewer[];
        }
        return res;
      });
    return obs;
  }

  saveFinance(accident: Accident, type: string, data: Object): Observable<PaymentViewer[]> {
    const obs = this.put(`${accident.id}/finance/${type}`, data);
    obs.subscribe(response => {
        let res = null;
        if (response && 'data' in response) {
          res = response['data'] as PaymentViewer[];
        }
        return res;
      });
    return obs;
  }
}
