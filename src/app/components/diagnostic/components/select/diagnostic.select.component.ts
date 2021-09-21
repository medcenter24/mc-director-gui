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

import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { DiagnosticService } from '../../diagnostic.service';
import { SelectItem } from 'primeng/api';
import { Diagnostic } from '../../diagnostic';
import { LoadableComponent } from '../../../core/components/componentLoader';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import {
  FilterRequestField,
  PaginationLimitRequestField,
  PaginationOffsetRequestField,
  SortRequestField,
} from '../../../core/http/request/fields';

@Component({
  selector: 'nga-select-diagnostics',
  templateUrl: './select.html',
  outputs: ['init', 'loaded'],
})
export class DiagnosticSelectComponent extends LoadableComponent implements OnInit {

  @Output() chosenDiagnosticsChange: EventEmitter<Diagnostic[]> = new EventEmitter<Diagnostic[]>();
  @Input() chosenDiagnostics: Diagnostic[] = [];

  isLoaded: boolean = false;
  dataDiagnostics: SelectItem[] = [];
  selectedDiagnostics: string[] = [];
  diagnostics: Diagnostic[] = [];
  protected componentName: string = 'SelectDiagnosticsComponent';

  constructor (
    private diagnosticsService: DiagnosticService,
    private _logger: LoggerComponent,
  ) {
    super();
  }

  ngOnInit () {
    this.startLoader();

    const statusFilter = {
      'filter': {
        'fields': [
          new FilterRequestField('status', 'active', FilterRequestField.MATCH_EQ),
        ],
      },
      'sorter': {
        'fields': [
          new SortRequestField('title'),
          new SortRequestField('id'),
        ],
      },
      'paginator': {
        'fields': [
          new PaginationLimitRequestField('500'),
          new PaginationOffsetRequestField('0'),
        ],
      },
    };

    this.diagnosticsService.getDiagnostics(statusFilter).then(diagnostics => {
      this.diagnostics = diagnostics;
      this.dataDiagnostics = diagnostics.map(x => {
        return {
          label: `${x.title}`,
          value: `${x.id}`,
        };
      });

      if (!this.selectedDiagnostics.length) {
        // to show placeholder
        this.selectedDiagnostics = [];
      }
      this.isLoaded = true;
      this.stopLoader();
    }).catch((err) => {
      this.stopLoader();
      this._logger.error(err);
    });
  }

   onChanged(event): void {
     const diagnostics = this.diagnostics.filter(function (diagnostic) {
       const id = `${diagnostic.id}`;
       return event.value.indexOf(id) !== -1;
     });

     this.chosenDiagnosticsChange.emit(diagnostics);
   }

   reloadChosenDiagnostics(diagnostics: Diagnostic[]): void {
     diagnostics.forEach((diagnostic: Diagnostic) => {
       const el = {
         label: diagnostic.title,
         value: diagnostic.id,
       };

       if (!this.dataDiagnostics.find(obj => +obj.value === +diagnostic.id)) {
         this.dataDiagnostics.push(el);
         this.diagnostics.push(diagnostic);
       }
     });
     this.chosenDiagnostics = diagnostics;
     this.selectedDiagnostics = this.chosenDiagnostics.length ? this.chosenDiagnostics.map(x => `${x.id}`) : [];
   }
}
