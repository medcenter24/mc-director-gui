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

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import { GlobalState } from '../../../../global.state';
import { LoadableComponent } from '../../../core/components/componentLoader';
import { FormService } from '../../form.service';
import { UiToastService } from '../../../ui/toast/ui.toast.service';

@Component({
  selector: 'nga-form-viewer',
  template: `
    <div *ngIf="formId && formableId">
      <span
              class="fa fa-file-pdf-o mr-2"
              (click)="downloadPdf()"
              title="{{ 'Save as PDF' | translate }}"></span>
      <span
              class="fa fa-print mr-2"
              (click)="print()"
              title="{{ 'Print' | translate }}"
      ></span>
      <span
              class="fa fa-window-maximize"
              (click)="preview()"
              title="{{ 'Preview' | translate }}"
      ></span>
    </div>
    <span class="text-muted" *ngIf="!formId" translate>Form not assigned</span>
    <iframe id="printf" name="printf" style="display: none;"></iframe>

    <p-dialog [(visible)]="formPreviewerVisible"
              header="{{ 'Form Preview' | translate }}"
              [style]="{width: '800px'}"
              [contentStyle]="{'max-height':'90vh'}"
              [modal]="true"
              [blockScroll]="true"
              [closeOnEscape]="true"
              [dismissableMask]="true"
              [closable]="true"
              appendTo="body">
      <div class="preview-content" #previewContainer></div>
    </p-dialog>
  `,
  styleUrls: ['./form.viewer.scss'],
})
export class FormViewerComponent extends LoadableComponent {
  protected componentName: string = 'FormViewerComponent';

  /**
   * Identifier of the form to show
   */
  @Input() formId: number;

  /**
   * Identifier of the source of the data for this form
   */
  @Input() formableId: number;

  @Output() init: any;

  @Output() loaded: any;

  /**
   * will be triggered event instead of real method
   * to pass control upper
   */
  @Input() emitInsteadOfAction: boolean = false;

  @Output() onPreview: EventEmitter<any> = new EventEmitter();
  @Output() onPrint: EventEmitter<any> = new EventEmitter();
  @Output() onPdf: EventEmitter<any> = new EventEmitter();

  @ViewChild('previewContainer')
  previewContainer: ElementRef;

  formPreviewerVisible: boolean = false;

  constructor(
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    protected translateService: TranslateService,
    protected formService: FormService,
    private uiToastService: UiToastService,
  ) {
    super();
  }

  private valid(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (!this.formId || !this.formableId) {
        this.translateService.get('`form` and/or `data source` has not been provided').subscribe(res => {
          this.uiToastService.errorMessage(res);
        });
        if (reject) {
          reject();
        }
      } else {
        resolve(true);
      }
    });
  }

  downloadPdf(forceRun: boolean = false): void {
    if (this.emitInsteadOfAction && !forceRun) {
      this.onPdf.emit();
    } else {
      this.valid()
        .then(() => this.formService.downloadPdf(this.formId, this.formableId));
    }
  }

  print(forceRun: boolean = false): void {
    if (this.emitInsteadOfAction && !forceRun) {
      this.onPrint.emit();
    } else {
      this.valid()
        .then( () => {
          const postfix = 'Print';
          this.startLoader( postfix );
          this.formService.getReportHtml( this.formId, this.formableId )
            .then( html => {
              this.stopLoader( postfix );
              const newWin = window.frames[ 'printf' ];
              newWin.document.write( `<body onload="window.print()">${html}</body>` );
              newWin.document.close();
            } )
            .catch( () => this.stopLoader( postfix ) );
        } );
    }
  }

  preview(forceRun: boolean = false): void {
    if (this.emitInsteadOfAction && !forceRun) {
      this.onPreview.emit();
    } else {
      this.valid()
        .then( () => {
          this.formService.getReportHtml( this.formId, this.formableId )
            .then( ( html: string ) => {
              this.formPreviewerVisible = true;
              this.previewContainer.nativeElement.innerHTML = html;
            } ).catch();
        } );
    }
  }
}
