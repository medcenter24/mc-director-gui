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

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Diagnostic } from '../../diagnostic';
import { CasesService } from '../../../case/cases.service';
import { DiagnosticSelectComponent } from '../select/diagnostic.select.component';
import { LoadableComponent } from '../../../core/components/componentLoader';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';

@Component({
  selector: 'nga-diagnostics-selector',
  templateUrl: 'selector.html',
  outputs: ['init', 'loaded'],
})
export class DiagnosticsSelectorComponent extends LoadableComponent implements OnInit {
  protected componentName: string = 'DiagnosticsSelectorComponent';

  @Input() caseId: number = 0;
  @Output() changed: EventEmitter<Diagnostic[]> = new EventEmitter<Diagnostic[]>();
  @Output() diagnosticsLoaded: EventEmitter<Diagnostic[]> = new EventEmitter<Diagnostic[]>();
  @ViewChild('selectDiagnostics')
    private selectDiagnosticsComponent: DiagnosticSelectComponent;

  isLoaded: boolean = false;
  caseDiagnostics: Diagnostic[] = [];

  constructor (
    private casesService: CasesService,
    private _logger: LoggerComponent,
  ) {
    super();
  }

  ngOnInit () {
    this.isLoaded = true;
  }

  onDelete (diagnostic: Diagnostic): void {
    if (this.hasDiagnostic(diagnostic)) {
      this.caseDiagnostics = this.caseDiagnostics.filter(function (el) {
        return el.id !== diagnostic.id;
      });
      this.selectDiagnosticsComponent.reloadChosenDiagnostics(this.caseDiagnostics);
      this.changed.emit(this.caseDiagnostics);
    }
  }

  onChange(): void {
    this.changed.emit(this.caseDiagnostics);
  }

  onSelectDiagnosticsLoaded(name): void {
    this.stopLoader(name);
    if (this.caseId) {
      const postfix = 'SelectDiagnosticsLoaded';
      this.startLoader(postfix);
      this.casesService.getCaseDiagnostics(this.caseId).then(diagnostics => {
        this.stopLoader(postfix);
        this.caseDiagnostics = diagnostics;
        this.selectDiagnosticsComponent.reloadChosenDiagnostics(this.caseDiagnostics);
        // if I loaded diagnostics by the case id
        this.diagnosticsLoaded.emit(this.caseDiagnostics);
      }).catch((err) => {
        this.stopLoader(postfix);
        this._logger.error(err);
      });
    }
  }

  onSelectDiagnosticsInit(name): void {
    this.startLoader(name);
  }

  private hasDiagnostic (diagnostic: Diagnostic): boolean {
    const result = this.caseDiagnostics.find(function (el) {
      return el.id === diagnostic.id;
    });

    return !!result;
  }
}
