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

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CompanyService } from '../../company.service';
import { Company } from '../../company';
import { LoggedUserService } from '../../../auth/loggedUser.service';
import { AuthenticationService } from '../../../auth/authentication.service';
import { UploaderOptions, UploadFile, UploadInput, humanizeBytes } from 'ngx-uploader';
import { GlobalState } from '../../../../global.state';
import { LoadableComponent } from '../../../core/components/componentLoader';

@Component({
  selector: 'nga-company-editor',
  templateUrl: 'company.editor.html',
})
export class CompanyEditorComponent extends LoadableComponent implements OnInit {

  protected componentName: string = 'CompanyEditorComponent';

  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  defaultCompanyLogo: string = 'assets/img/theme/cardiogram.svg';
  pictureLogo: string = '';
  eventLogoToUpload: UploadInput;
  uploaderLogoOptions: UploaderOptions;
  company: Company;
  uploadLogoInput: EventEmitter<UploadInput>;
  dragOver: boolean;
  logoFiles: UploadFile[];
  humanizeLogoBytes: Function;

  constructor(private companyService: CompanyService,
              private loggedUserService: LoggedUserService,
              private authService: AuthenticationService,
              protected _state: GlobalState,
  ) {
    super();
    this.logoFiles = []; // local uploading files array
    this.uploadLogoInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeLogoBytes = humanizeBytes;
  }

  ngOnInit() {
    this.startLoader();
    this.loggedUserService.getCompany()
      .then((company: Company) => {
        this.stopLoader();

        this.company = company;

        this.pictureLogo = this.company.logo250.length ? this.company.logo250 : '';

        this.eventLogoToUpload = {
          type: 'uploadAll',
          url: this.companyService.getUrl(`${this.company.id}/logo`),
          method: 'POST',
          headers: { 'Authorization': `Bearer ${this.authService.getToken()}` },
        };

      })
      .catch(() => this.stopLoader());

    this._state.subscribe('token', (token) => {
      this.eventLogoToUpload.headers = { 'Authorization': `Bearer ${token}` };
    });
  }

  saveCompany(): void {
    const postfix = 'SaveCompany';
    this.startLoader(postfix);
    this.companyService.update(this.company)
      .then(() => this.stopLoader(postfix))
      .catch(() => this.stopLoader(postfix));
  }

  startCompanyLogoUpload(): void {
    this.startLoader('CompanyLogoUpload');
  }

  endCompanyLogoUpload(): void {
    this.stopLoader('CompanyLogoUpload');
  }

  deleteCompanyLogo(): void {
    const postfix = 'DeleteCompanyLogo';
    this.startLoader(postfix);
    this.companyService.deleteLogo(this.company)
      .then(() => this.stopLoader(postfix))
      .catch(() => this.stopLoader(postfix));
  }

}
