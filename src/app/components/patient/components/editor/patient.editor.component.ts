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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Patient } from '../../patient';
import { DateHelper } from '../../../../helpers/date.helper';
import { PatientsService } from '../../patients.service';
import { GlobalState } from '../../../../global.state';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/api';
import { LoadableComponent } from '../../../core/components/componentLoader';

@Component({
  selector: 'nga-patient-editor',
  templateUrl: './patient.editor.html',
  outputs: ['init', 'loaded'],
})
export class PatientEditorComponent extends LoadableComponent {
  @Input() initPatient(patient: Patient) {
    this.setPatient(patient);
  }

  @Output() changed: EventEmitter<Patient> = new EventEmitter<Patient>();

  patient: Patient = new Patient();
  birthday: string = '';
  msgs: Message[] = [];
  protected componentName: string = 'PatientEditorComponent';

  constructor(
    private patientService: PatientsService,
    private _state: GlobalState,
    private translate: TranslateService,
  ) {
    super();
  }

  setPatient(patient: Patient): void {
    this.patient = patient ? patient : new Patient();
    this.birthday = this.patient && this.patient.birthday
      ? DateHelper.toEuropeFormatWithTime(this.patient.birthday)
      : null;
  }

  save(): void {
    const postfix = 'Save';
    this.startLoader(postfix);
    if (this.birthday) {
      this.patient.birthday = DateHelper
        .getUnixDate(DateHelper.parseDateFromFormat(this.birthday, 'd.m.Y'));
    } else {
      this.patient.birthday = '';
    }
    if (this.patient.name && this.patient.name.length) {
      this.patient.name = this.patient.name.trim();
    }
    let savePromise;
    savePromise = this.patient.id ? this.patientService.update(this.patient)
      : this.patientService.create(this.patient);
    savePromise.then((patient) => {
      this.stopLoader(postfix);
      if (patient && patient.id) {
        this.patient = patient;
      }
      this.changed.emit(this.patient);
    }).catch(() => this.stopLoader(postfix));
  }

  onDelete(): void {
    this._state.notifyDataChanged('confirmDialog',
      {
        header: this.translate.instant('Delete'),
        message: this.translate.instant('Are you sure that you want to delete this patient?'),
        accept: () => {
          const postfix = 'Delete';
          this.startLoader(postfix);
          this.patientService.delete(this.patient.id)
            .then(() => {
              this.changed.emit(this.patient);
              this.patient = null;
              this.stopLoader(postfix);
            })
            .catch(() => this.stopLoader(postfix));
        },
        icon: 'fa fa-window-close-o red',
      },
    );
  }

  changedPatientName(event): void {
    this.patient.name = event.target.value = this.patientService.formatPatientName(event.target.value);
  }

  changedPatientPhone(event): void {
    this.patient.phones = event.target.value;
  }

  changedPatientAddress(event): void {
    this.patient.address = event.target.value;
  }

  changedPatientComment(event): void {
    this.patient.comment = event.target.value;
  }
}
