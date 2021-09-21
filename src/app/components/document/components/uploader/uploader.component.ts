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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message, SelectItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import { GlobalState } from '../../../../global.state';
import { AuthenticationService } from '../../../auth/authentication.service';
import { DocumentsService } from '../../documents.service';
import { Document } from '../../document';
import { LoadableComponent } from '../../../core/components/componentLoader';
import { UiToastService } from '../../../ui/toast/ui.toast.service';
import { HttpHeaders } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'nga-file-uploader',
  templateUrl: './uploader.html',
  outputs: ['init', 'loaded'],
})
export class FileUploaderComponent extends LoadableComponent implements OnInit {
  protected componentName: string = 'FileUploaderComponent';

  @Input() documents: Document[] = [];
  @Input() url: string = '';
  @Output() changed: EventEmitter<any[]> = new EventEmitter<any[]>();

  msgs: Message[] = [];
  langLoaded: boolean = false;
  docTypes: SelectItem[] = [];

  // preload translations for the component
  private translateLoaded: string;
  private translateErrorLoad: string;
  private deleterCounter: number = 0;

  constructor(
              private translate: TranslateService,
              private _logger: LoggerComponent, private _state: GlobalState,
              private authenticationService: AuthenticationService,
              private documentsService: DocumentsService,
              private uiToastService: UiToastService,
  ) {
    super();
  }

  ngOnInit() {
    this.translate.get('File Uploaded').subscribe(res => {
      this.translateLoaded = res;
      this.translateErrorLoad = this.translate.instant('Upload Error');
      this.docTypes = [
        { label: this.translate.instant('passport'), value: 'passport' },
        { label: this.translate.instant('insurance'), value: 'insurance' },
      ];
      this.langLoaded = true;
    });
  }

  handleBeforeUpload(): void {
    this.startLoader('Uploader');
  }

  headers(): HttpHeaders {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.authenticationService.getToken()}` });
  }

  handleUpload(): void {
    this.uiToastService.saved();
    this.changed.emit(this.documents);
    this.stopLoader('Uploader');
  }

  // used by the template uploader.html
  handleError(event): void {
    this.stopLoader('Uploader');
    this.uiToastService.error();
    this._logger.error(`Error: Upload to ${event.error.url}
      [${event.error.status}: ${event.error.statusText}]`);
  }

  downloadFile(file): void {
    this.documentsService.download(file);
  }

  updateFile(file): void {
    const postfix = 'Save';
    this.startLoader(postfix);
    this.documentsService.update(file).then(() => {
      this.stopLoader(postfix);
    }).catch(() => {
      this.stopLoader(postfix);
    });
  }

  deleteFile(file): void {
    const files = [];

    if (file) {
      files.push(file.id);
    }

    this.deleter(files);
  }

  private deleter(files: any[]): void {
    this.deleterCounter = files.length;

    if (this.deleterCounter) {
      const postfix = 'Deleter';
      this.startLoader(postfix);
      files.map(id => {
        this.documentsService.deleteDocument(id).then(() => {
          this.deleteFileFromGui(id);
          if (--this.deleterCounter <= 0) {
            this.stopLoader(postfix);
          }
        }).catch(err => {
          this._logger.error(err);
          if (--this.deleterCounter <= 0) {
            this.stopLoader(postfix);
          }
        });
      });
    }
  }

  private deleteFileFromGui(id: number): void {
    this.documents = this.documents.filter(val => +val.id !== +id);
    this.changed.emit(this.documents);
    $(`.row-file-${id}`).remove();
  }
}
