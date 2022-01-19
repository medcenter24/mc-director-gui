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
import { AuthenticationService } from '../../auth/authentication.service';
import { environment } from '../../../../environments/environment';
import { GlobalState } from '../../../global.state';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoggerComponent } from '../logger/LoggerComponent';
import { LoadableServiceInterface } from '../loadable';
import { ObjectHelper } from '../../../helpers/object.helper';
import { UiToastService } from '../../ui/toast/ui.toast.service';
import { TokenService } from '../../auth/token.service';
import { Observable } from 'rxjs';

@Injectable()
export abstract class HttpService implements LoadableServiceInterface {

  constructor (
    protected http: HttpClient,
    private authenticationService: AuthenticationService,
    private _logger: LoggerComponent,
    private _state: GlobalState,
    private router: Router,
    private uiToastService: UiToastService,
    private tokenService: TokenService,
  ) {
  }

  getUrl(path: string|number = null): string {
    let url = `${environment.apiHost}/${this.getPrefix()}`;
      if (path) {
        url += (url.substr(-1) === '/' ? '' : '/') + path;
      }
    return url;
  }

  protected getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${ this.tokenService.getToken() }`,
      'Content-Type': 'text/json',
    });
  }

  /**
   * path prefix to generating new urls by the method getUrl
   */
  protected abstract getPrefix(): string;

  /**
   * Loading filtered list of data resources
   * @param {Object} filters
   * @returns {Observable<any>}
   */
  search (filters: Object): Observable<any> {
    filters = ObjectHelper.extend({}, filters);
    const obs = this.http.post(
      this.getUrl('search'),
      JSON.stringify(filters),
      { headers: this.getAuthHeaders() },
    );
    obs.subscribe({ error: this.handleError });
    return obs;
  }

  /**
   * Get request
   * @param id
   * @param params
   * @returns {Observable<any>}
   */
  protected get(id: string|number = null, params: any = null): Observable<any> {
    const obs = this.http.get(this.getUrl(id), { headers: this.getAuthHeaders(), params });
    obs.subscribe({error: error => this.handleError(error)});
    return obs;
  }

  /**
   * Delete request
   * @param id
   * @returns {Observable<any>}
   */
  protected remove(id: any): Observable<any> {
    const obs = this.http.delete(this.getUrl(id), { headers: this.getAuthHeaders() });
    obs.subscribe({error: this.handleError});
    return obs;
  }

  /**
   * Create new resource
   * @param data
   * @returns {Observable<any>}
   */
  protected store(data): Observable<any> {
    const obs = this.http.post(this.getUrl(), JSON.stringify(data), { headers: this.getAuthHeaders() });
    obs.subscribe(response => {
      this.uiToastService.created();
      return response;
    });
    obs.subscribe({error: this.handleError});
    return obs;
  }

  /**
   * Update resource
   * @param id
   * @param data
   * @returns {Observable<any>}
   */
  protected put(id, data): Observable<any> {

    if (!id) {
      this.uiToastService.httpError();
      return;
    }
    const obs = this.http.put(this.getUrl(id), JSON.stringify(data), { headers: this.getAuthHeaders() });
    obs.subscribe(() => this.uiToastService.saved());
    obs.subscribe({error: this.handleError});
    return obs;
  }

  /**
   * Overlapping errors
   * @param error
   * @returns {Promise<never>}
   */
  protected handleError(error: any): Promise<any> {

    if (!environment.production) {
      this._logger.error(error);
    }

    if (error && error.status && error.status === 401) {
      // won't clean all data so we need browser redirect
      // but I'm trying to clean them by hand
      this.authenticationService.logout();
      this.router.navigate(['login']).then();
      // window.location.replace('/login');
    } else if (error && error.status && error.status === 422) {
      // using dingo/FormRequest style
      this._state.notifyDataChanged('apiError', error);
    } else if (typeof error === 'string') {
      this.uiToastService.error();
    } else {
      this.uiToastService.httpError();
    }

    return Promise.reject(error);
  }

  /**
   * Should be implemented if needed
   * @param model
   */
  destroy ( model: Object ): Observable<any> {
    return undefined;
  }

  /**
   * Should be implemented if needed
   * @param model
   */
  save ( model: Object ): Observable<any> {
    return undefined;
  }
}
