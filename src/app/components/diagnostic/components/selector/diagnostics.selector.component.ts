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
import { Diagnostic } from '../../diagnostic';
import { CasesService } from '../../../case/cases.service';
import { LoadableComponent } from '../../../core/components/componentLoader';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import {DiagnosticService} from '../../diagnostic.service';

@Component({
  selector: 'nga-diagnostics-selector',
  templateUrl: 'diagnostics.selector.html',
})
export class DiagnosticsSelectorComponent extends LoadableComponent implements OnInit {
  protected componentName: string = 'DiagnosticsSelectorComponent';

  @Input() caseId: number = 0;
  @Input() isStaticForm: boolean = false;
  @Output() changed: EventEmitter<Diagnostic[]> = new EventEmitter<Diagnostic[]>();
  @Output() diagnosticsLoaded: EventEmitter<Diagnostic[]> = new EventEmitter<Diagnostic[]>();
  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  isLoaded: boolean = false;
  caseDiagnostics: Diagnostic[] = [];

  constructor (
    private casesService: CasesService,
    private _logger: LoggerComponent,
    public diagnosticService: DiagnosticService,
  ) {
    super();
  }

  ngOnInit () {
    this.casesService.getCaseDiagnostics(this.caseId)
      .subscribe(diagnostics => {
        this.caseDiagnostics = diagnostics;
        this.onChange();
        this.isLoaded = true;
      });
  }

  onDelete (diagnostic: Diagnostic): void {
    if (this.hasDiagnostic(diagnostic)) {
      this.caseDiagnostics = this.caseDiagnostics.filter(function (el) {
        return el.id !== diagnostic.id;
      });
      this.onChange();
    }
  }

  onChange(): void {
    this.reSort(this.caseDiagnostics);
    this.changed.emit(this.caseDiagnostics);
  }

  private hasDiagnostic (diagnostic: Diagnostic): boolean {
    const result = this.caseDiagnostics.find(function (el) {
      return el.id === diagnostic.id;
    });

    return !!result;
  }

  onDiagnosticSelected($event: Diagnostic) {
    if (!this.hasDiagnostic($event)) {
      this.caseDiagnostics = [...this.caseDiagnostics, $event];
      this.onChange();
    }
  }

  private reSort(sf: Diagnostic[]): void {
    let sort = 1;
    sf.map((row) => {
      row.sort = sort++;
    });
  }
}
