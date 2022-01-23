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
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { GlobalState } from '../../global.state';
import { Message } from 'primeng/api';
import { LocalStorageHelper } from '../../helpers/local.storage.helper';
import { LoggerComponent } from '../core/logger/LoggerComponent';
import { TokenService } from './token.service';
import { Observable } from 'rxjs';

/**
 * I met a lot of issues with tokens, so make it as simple as possible
 * 1. issue: this service is not unique, so I can't use this.token
 * 2. issue: auto refresh of the token will be a cause like that:
 *   when I need to refresh token I could lost data
 *   - send refresh request (it will update token on the server)
 *   - send request with old token (it will produce an error that token is not correct)
 *   - return from server with new token, but error has been already thrown
 *
 *   // todo find out how could I push all requests to the queue to avoid requests with incorrect token on update
 *   to reproduce it -> I can press button refresh token very fast
 *
 */

@Injectable()
export class AuthenticationService {

  langKey: string = 'lang';
  msgs: Message[] = [];

  private authUrl = `${environment.apiHost}/authenticate`;  // URL to web api

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private _state: GlobalState,
    private storage: LocalStorageHelper,
    private _logger: LoggerComponent,
    private tokenService: TokenService,
  ) {
  }

  login(username: string, password: string): Observable<Object> {
    this._state.notifyDataChanged('runLoadingProcess', true);
    const obs = this.http.post(this.authUrl, JSON.stringify({ email: username, password }));
    obs.subscribe(response => {
        this._state.notifyDataChanged('runLoadingProcess', false);
        this.update(response);
        return true;
      });
    return obs;
  }

  logout(): void {
    this.tokenService.removeToken();
  }

  private update(response): void {
    const token = response && response.access_token;
    const ava = response && response.thumb;
    const lang = response && response.lang;
    // store language
    this.storage.setItem(this.langKey, lang);
    this._state.notifyDataChanged('avatarB64', ava);
    this.tokenService.setToken(token);
  }

  getToken(): string {
    return this.tokenService.getToken();
  }
}
