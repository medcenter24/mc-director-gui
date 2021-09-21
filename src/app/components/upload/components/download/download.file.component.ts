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

import { Component, Input } from '@angular/core';
import { Message } from 'primeng/api';
import { LoadableComponent } from '../../../core/components/componentLoader';
import { Upload } from '../../upload';
import { UploadService } from '../../upload.service';

@Component({
  selector: 'nga-file-download',
  template: `<p-button
          [disabled]="!file"
          (onClick)="downloadFile()"
          label="{{ 'Download' | translate }}"
          icon="fa fa-download"></p-button>`,
  outputs: ['init', 'loaded'],
})
export class DownloadFileComponent extends LoadableComponent {
  protected componentName: string = 'DownloadFileComponent';

  msgs: Message[] = [];
  url: string = '';

  @Input() file: Upload;

  constructor(
    private uploadService: UploadService,
  ) {
    super();
  }

  downloadFile(): void {
    this.uploadService.download(this.file);
  }
}
