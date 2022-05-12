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

import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {Accident} from '../../accident';
import {AccidentsService} from '../../accidents.service';
import {PatientsService} from '../../../patient/patients.service';
import {Patient} from '../../../patient/patient';
import {LoadableComponent} from '../../../core/components/componentLoader';
import {LoggerComponent} from '../../../core/logger/LoggerComponent';

@Component({
  selector: 'nga-accident-card',
  templateUrl: './accident.card.html',
})
export class AccidentCardComponent extends LoadableComponent implements OnInit {

  @Input() selectedAccidentId: number = 0;
  @Input() showDelete: boolean = true;
  @Output() closed: EventEmitter<any> = new EventEmitter();
  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  accident: Accident;
  patient: Patient;
  protected componentName: string = 'AccidentCardComponent';

  constructor(
    private accidentService: AccidentsService,
    private patientService: PatientsService,
    private _logger: LoggerComponent,
  ) {
    super();
  }

  ngOnInit() {
    if (+this.selectedAccidentId) {
      const postfix = 'getAccident';
      this.startLoader(postfix);
      this.accidentService.getAccident(this.selectedAccidentId).subscribe({
        next: accident => {
          this.stopLoader(postfix);
          this.accident = accident;
          this.loadPatient();
        }, error: (err) => {
          this._logger.error(err);
          this.stopLoader(postfix);
        },
      });
    }
  }

  private loadPatient(): void {
    const opName = 'getPatient';
    this.startLoader(opName);
    this.patientService.getPatient(+this.accident.patientId).subscribe({next: (patient: Patient) => {
      this.stopLoader(opName);
      this.patient = patient;
    }, error: (err) => {
      this.stopLoader(opName);
      this._logger.error(err);
    }});
  }

  closePanel(): void {
    this.accident = null;
    this.patient = null;
    this.closed.emit();
  }
}
