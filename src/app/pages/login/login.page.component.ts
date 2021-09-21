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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../components/auth/authentication.service';
import { Router } from '@angular/router';
import { LocalStorageHelper } from '../../helpers/local.storage.helper';
import { environment } from '../../../environments/environment';
import { UrlHelper } from '../../helpers/url.helper';
import { GlobalState } from '../../global.state';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'nga-login',
  templateUrl: './login.html',
  styleUrls: ['login.scss'],
})
export class LoginPageComponent implements OnInit {

  form: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  submitted: boolean = false;
  showError: boolean = false;
  year: number;
  projectName: string = '';

  constructor (
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private storage: LocalStorageHelper,
    protected _state: GlobalState,
  ) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    });
  }

  ngOnInit (): void {
    this.submitted = false;
    this.showError = false;
    this.email = this.form.controls[ 'email' ];
    this.password = this.form.controls[ 'password' ];
    this.year = new Date().getFullYear();
    this.projectName = environment.projectName;
  }

  onSubmit (): void {
    this._state.notifyDataChanged('runLoadingProcess', true);
    this.submitted = true;
    this.showError = false;
    if (this.form.valid) {
      // your code goes here
      this.authenticationService.login(this.email.value, this.password.value)
        .then(() => {
          this._state.notifyDataChanged('runLoadingProcess', true);
          let lastUri = this.storage.getItem('lastActiveUri');
          lastUri = lastUri && lastUri !== '/login' ? lastUri : '/';
          if (lastUri === '/') {
            lastUri = '/pages/dashboard';
          }

          if (lastUri.includes('?')) {
            const queryParams = { queryParams: UrlHelper.getQueryVarsAsObject(lastUri) };
            this.router
              .navigate([`${lastUri.split('?')[0]}`], queryParams)
              .then(() => this._state.notifyDataChanged('runLoadingProcess', false));
          } else {
            this.router.navigate([lastUri])
              .then(() => this._state.notifyDataChanged('runLoadingProcess', false));
          }

          this.submitted = false;
        }, () => {
          this.showError = true;
          this._state.notifyDataChanged('runLoadingProcess', false);
          this.submitted = false;
        });
    }
  }
}
