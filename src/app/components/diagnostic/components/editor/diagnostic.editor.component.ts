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

import { Component, Input, Output, EventEmitter, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Diagnostic } from '../../diagnostic';
import { DiagnosticService } from '../../diagnostic.service';
import { LoadableComponent } from '../../../core/components/componentLoader';
import { DiagnosticCategory } from '../../category/category';
import { DiagnosticCategoryEditorComponent } from '../../category/components/editor';
import { GlobalState } from '../../../../global.state';
import { TranslateService } from '@ngx-translate/core';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import { DiseaseService } from '../../../disease';
import { DiagnosticCategoryService } from '../../category/category.service';
import { AutocompleterComponent } from '../../../ui/selector/components/autocompleter';

@Component({
  selector: 'nga-diagnostic-editor',
  templateUrl: './diagnostic.editor.html',
})
export class DiagnosticEditorComponent extends LoadableComponent implements OnInit, AfterViewInit {
  protected componentName: string = 'DiagnosticEditorComponent';

  @Input() diagnostic: Diagnostic = new Diagnostic();
  @Output() diagnosticSaved: EventEmitter<Diagnostic> = new EventEmitter<Diagnostic>();
  @Output() close: EventEmitter<null> = new EventEmitter<null>();
  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('diagnosticCategoryAutoCompleter')
    private categorySelectComponent: AutocompleterComponent;

  @ViewChild('diagnosticCategoryEditor')
    private diagnosticCategoryEditor: DiagnosticCategoryEditorComponent;

  showEditor: boolean = false;
  isActive: boolean = true;

  constructor(
    private service: DiagnosticService,
    protected _state: GlobalState,
    private translateService: TranslateService,
    protected _logger: LoggerComponent,
    public diseaseService: DiseaseService,
    public diagnosticCategoryService: DiagnosticCategoryService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.isActive = this.diagnostic.status === 'active';
  }

  ngAfterViewInit () {
    if (this.diagnostic.diagnosticCategoryId) {
      this.categorySelectComponent.selectItems(this.diagnostic.diagnosticCategoryId);
    }
  }

  onSubmit(): void {
    const opName = 'UpdateDiagnostic';
    this.startLoader(opName);
    this.diagnostic.status = this.isActive ? 'active' : 'disabled';
    this.service.save(this.diagnostic).subscribe({next: (diagnostic: Diagnostic) => {
      this.stopLoader(opName);
      this.diagnostic = diagnostic;
      this.checkStatus();
      this.diagnosticSaved.emit(this.diagnostic);
      this.closeEditor();
    }, error: (e) => {
      this._logger.error(e);
      this.stopLoader(opName);
    }});
  }

  private checkStatus(): void {
    this.isActive = this.diagnostic && this.diagnostic.status === 'active';
  }

  onDelete(): void {
    this._state.notifyDataChanged('confirmDialog',
      {
        header: this.translateService.instant('Delete'),
        message: this.translateService.instant('Are you sure that you want to delete this diagnostic?'),

        accept: () => {
          const postfix = 'Delete';
          this.startLoader(postfix);
          this.service.destroy(this.diagnostic)
            .subscribe({next: () => {
              this.stopLoader(postfix);
              this.diagnosticSaved.emit(null);
              this.closeEditor();
            }, error: () => {
              this.stopLoader(postfix);
            }});
        },
        icon: 'fa fa-window-close-o red',
      },
    );
  }

  toggleEditor(): void {
    this.showEditor = !this.showEditor;
  }

  editDiagnostic(diagnostic: Diagnostic): void {
    if (this.diagnostic !== diagnostic) {
      this.showEditor = false;
    }
    this.diagnostic = diagnostic;
  }

  closeEditor(): void {
    this.close.emit();
  }

  onDiagnosticCategoryChanged(diagnosticCategory: any): void {
    if (this.diagnostic.diagnosticCategoryId !== diagnosticCategory.id && this.showEditor) {
      this.showEditor = false;
    }
    this.diagnostic.diagnosticCategoryId = diagnosticCategory.id;
  }

  onDiagnosticCategorySubmit (dc: DiagnosticCategory): void {
    this.showEditor = false;
    if (dc) {
      this.diagnostic.diagnosticCategoryId = dc.id;
      this.categorySelectComponent.selectItems( dc.id );
    }
  }
}
