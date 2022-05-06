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

import {City} from '../../../../city';
import {Assistant} from '../../../../assistant';
import {Doctor} from '../../../../doctors';
import {Patient} from '../../../../patient/patient';
import {AccidentStatus} from '../../../../accident/components/status';
import {AccidentType} from '../../../../accident/components/type/type';
import {Service} from '../../../../service';
import {Survey} from '../../../../survey';
import {Diagnostic} from '../../../../diagnostic/diagnostic';

export class SearchFilters {
  constructor(
    public cities: City[] = [],
    public assistants: Assistant[] = [],
    public doctors: Doctor[] = [],
    public caseableTypes: string[] = [],
    public patients: Patient[] = [],
    public handlingTimeRanges: string[] = [],
    public accidentStatuses: AccidentStatus[] = [],
    public accidentTypes: AccidentType[] = [],
    public visitTimeRanges: string[] = [],
    public doctorServices: Service[] = [],
    public doctorSurveys: Survey[] = [],
    public doctorDiagnostics: Diagnostic[] = [],
    public searchInDeleted: boolean = false,
  ) {
  }

  hasFilters(): boolean {
    return this.cities.length
      + this.assistants.length
      + this.doctors.length
      + this.caseableTypes.length
      + this.patients.length
      + this.handlingTimeRanges.length
      + this.accidentStatuses.length
      + this.accidentTypes.length
      + this.visitTimeRanges.length
      + this.doctorServices.length
      + this.doctorSurveys.length
      + this.doctorDiagnostics.length > 0 || this.searchInDeleted;
  }
}
