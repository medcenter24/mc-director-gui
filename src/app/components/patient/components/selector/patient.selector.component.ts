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

import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PatientsService } from '../../patients.service';
import { Patient } from '../../patient';
import { LoadableComponent } from '../../../core/components/componentLoader';
import { AutocompleterComponent } from '../../../ui/selector/components/autocompleter';

@Component({
    selector: 'nga-patient-selector',
    templateUrl: 'patient.selector.html',
    styleUrls: ['patient.selector.scss'],
    outputs: ['init', 'loaded'],
})
export class PatientSelectorComponent extends LoadableComponent {

    @ViewChild('patientSelect')
        patientSelectComponent: AutocompleterComponent;

    @Output() select: EventEmitter<Patient> = new EventEmitter<Patient>();
    @Input() set initPatient(patient: Patient) {
        if (patient) {
            this.setPatient(patient);
        }
    }

    protected componentName: string = 'PatientSelectorComponent';

    patient: Patient = new Patient();

    constructor (
        public patientService: PatientsService,
    ) {
        super();
    }

    resetPatient (patient: Patient): void {
        this.patient = patient;
    }

    setPatient (patient: Patient): void {
        this.patient = patient;
        this.patientSelectComponent.selectItems(this.patient.id);
    }

    onPatientChanged(patient: Patient) {
        this.patient = patient;
        this.select.emit(this.patient);
    }

    getPatient(): Patient {
        return this.patient;
    }
}
