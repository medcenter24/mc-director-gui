/*
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2022 (original work) MedCenter24.com;
 */

import {Component, Input} from '@angular/core';
import {LoadingComponent} from '../../../../core/components/componentLoader';
import {Searcher} from '../../form/models/searcher';
import {LoggerComponent} from '../../../../core/logger/LoggerComponent';
import {GlobalState} from '../../../../../global.state';
import {TranslateService} from '@ngx-translate/core';
import {Doctor} from '../../../../doctors';
import {Assistant} from '../../../../assistant';
import {City} from '../../../../city';
import {Patient} from '../../../../patient/patient';
import {AccidentStatus} from '../../../../accident/components/status';
import {AccidentType} from '../../../../accident/components/type/type';
import {Survey} from '../../../../survey';
import {Service} from '../../../../service';
import {Diagnostic} from '../../../../diagnostic/diagnostic';

@Component({
  selector: 'nga-searcher-filters',
  templateUrl: './searcher.filters.html',
  styleUrls: ['./searcher.filters.scss'],
})
export class SearcherFiltersComponent extends LoadingComponent {
  protected componentName: string = 'SearcherFiltersComponent';

  @Input() searcher: Searcher;

  constructor(
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    protected translateService: TranslateService,
  ) {
    super();
  }

  deleteCaseableType(type: string) {
    this.searcher.filters.caseableTypes = this.searcher.filters.caseableTypes.filter((ct) => ct !== type);
  }

  deleteDoctor(id: number) {
    this.searcher.filters.doctors = this.searcher.filters.doctors.filter((doc: Doctor) => doc.id !== id);
  }

  deleteAssistant(id: number) {
    this.searcher.filters.assistants = this.searcher.filters.assistants
      .filter((assistant: Assistant) => assistant.id !== id);
  }

  deleteCity(id: number) {
    this.searcher.filters.cities = this.searcher.filters.cities
      .filter((city: City) => city.id !== id);
  }

  deletePatient(id: number) {
    this.searcher.filters.patients = this.searcher.filters.patients
      .filter((patient: Patient) => patient.id !== id);
  }

  deleteHandlingTimeRange(handlingTimeRange: string) {
    this.searcher.filters.handlingTimeRanges = this.searcher.filters.handlingTimeRanges
      .filter((handlingRange: string) => handlingRange !== handlingTimeRange);
  }

  deleteAccidentStatus(id: number) {
    this.searcher.filters.accidentStatuses = this.searcher.filters.accidentStatuses
      .filter((accidentStatus: AccidentStatus) => accidentStatus.id !== id);
  }

  deleteAccidentType(id: number) {
    this.searcher.filters.accidentTypes = this.searcher.filters.accidentTypes
      .filter((accidentType: AccidentType) => accidentType.id !== id);
  }

  deleteDoctorService(id: number) {
    this.searcher.filters.doctorServices = this.searcher.filters.doctorServices
      .filter((service: Service) => service.id !== id);
  }

  deleteDoctorSurvey(id: number) {
    this.searcher.filters.doctorSurveys = this.searcher.filters.doctorSurveys
      .filter((survey: Survey) => survey.id !== id);
  }

  deleteDoctorDiagnostic(id: number) {
    this.searcher.filters.doctorDiagnostics = this.searcher.filters.doctorDiagnostics
      .filter((diagnostic: Diagnostic) => diagnostic.id !== id);
  }
}
