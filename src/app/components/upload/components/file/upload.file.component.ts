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

import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalState } from '../../../../global.state';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import { AuthenticationService } from '../../../auth/authentication.service';
import { Message } from 'primeng/api';
import { LoadableComponent } from '../../../core/components/componentLoader';
import { Upload } from '../../upload';
import { UploadService } from '../../upload.service';
import { HttpHeaders } from '@angular/common/http';
import { UiToastService } from '../../../ui/toast/ui.toast.service';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'nga-file-upload',
  template: `
      <p-fileUpload
        #uploader
        mode="basic"
        name="uploadFile"
        [url]="url"
        [maxFileSize]="maxSize"
        (onUpload)="handleUpload($event)"
        (onBeforeUpload)="handleBeforeUpload()"
        (onError)="handleError($event)"
        (onSelect)="handleSelect($event)"
        [headers]="httpHeaders"
        [withCredentials]="true"
        auto="true"
        [title]="'No file chosen' | translate"
        [chooseLabel]="'Browse' | translate"></p-fileUpload>`,
  outputs: ['init', 'loaded'],
})
export class UploadFileComponent extends LoadableComponent implements OnInit {
  protected componentName: string = 'UploadFileComponent';

  msgs: Message[] = [];
  url: string = '';
  httpHeaders: HttpHeaders;
  file: Upload;
  maxSize: number = 10000000; // 10 Mb

  @ViewChild('uploader')
  fileUploader: FileUpload;

  @Output() changed: EventEmitter<Upload> = new EventEmitter<Upload>();

  constructor(
    private translate: TranslateService,
    private _logger: LoggerComponent,
    private _state: GlobalState,
    private authenticationService: AuthenticationService,
    private uploadService: UploadService,
    private uiToastService: UiToastService,
  ) {
    super();
    this.httpHeaders = new HttpHeaders().set('Authorization', `Bearer ${this.authenticationService.getToken()}`);
  }

  ngOnInit(): void {
    this.url = this.uploadService.getUrl();
  }

  handleBeforeUpload(): void {
    this.startLoader('Uploader');
  }

  handleUpload(event): void {
    this.stopLoader('Uploader');
    this.msgs = [];
    this.file = event.originalEvent.body as Upload;
    this.uiToastService.saved();
    this.changed.emit(this.file);
  }

  // used by the template uploader.html
  handleError(event): void {
    this.uiToastService.error();
    if (event.hasOwnProperty('xhr')) {
      this._logger.error( `Error: Upload to ${event.xhr.responseURL}
        [${event.xhr.status}: ${event.xhr.statusText}]` );
    } else {
      this._logger.error(event.message);
    }
    this.stopLoader('Uploader');
  }

  handleSelect(event): void {
    if (!this.fileUploader.validate(event.files[0])) {
      this.uiToastService.errorMessage(this.translate.instant('File is not valid (check file size)'));
    }
  }
}
