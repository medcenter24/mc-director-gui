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

import {Component, OnInit} from '@angular/core';
import {LoggerComponent} from '../../../core/logger/LoggerComponent';
import {GlobalState} from '../../../../global.state';
import {TranslateService} from '@ngx-translate/core';
import {LoadingComponent} from '../../../core/components/componentLoader';
import {UrlHelper} from '../../../../helpers/url.helper';
import {ObjectHelper} from '../../../../helpers/object.helper';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {DoctorsService} from '../../../doctors';
import {CitiesService} from '../../../city';
import {AssistantsService} from '../../../assistant';
import {PatientsService} from '../../../patient/patients.service';
import {AccidentStatusService} from '../../../accident/components/status';
import {ServicesService} from '../../../service';
import {SurveyService} from '../../../survey';
import {DiagnosticService} from '../../../diagnostic/diagnostic.service';
import {DateHelper} from '../../../../helpers/date.helper';

class Search {
  constructor(
    public caseableType: string = '',
  ) {
  }
}

interface SearchResultType {
  id: number;
  title: string;
}

interface SearchField {
  id: string;
  title: string;
}

interface ResultBuilder {
  id: string;
  name: string;
}

interface QuickFilter {
  id: string;
  name: string;
}

interface DatePickerConfig {
  mode: string;
  dateFormat: string;
  hasSearchButton: boolean;
  placeholder: string;
  ready: boolean;
}

@Component({
  selector: 'nga-search-form',
  templateUrl: './search.form.html',
})
export class SearchFormComponent extends LoadingComponent implements OnInit {
  protected componentName: string = 'SearchFormComponent';

  query: string = '';

  resultTypeOptions: SearchResultType[] = [];
  resultType: number = 0;

  listFields: SearchField[] = [];
  selectedFields: SearchField[] = [];

  quickResultBuilders: ResultBuilder[] = [];
  selectedResultBuilder: number = 0;

  quickFilters: QuickFilter[] = [];
  selectedQuickFilter: number = 0;

  isDoctorCase: boolean = true;

  searcher: Search;
  accidentType: number = 1;

  handlingDatePickerConfig: DatePickerConfig = {
    mode: 'range',
    dateFormat: DateHelper.EUROPE_DATE_FORMAT,
    hasSearchButton: false,
    placeholder: 'Handling time',
    ready: false,
  };
  handlingTimeRange: string = '';

  visitDatePickerConfig: DatePickerConfig = {
    mode: 'range',
    dateFormat: DateHelper.EUROPE_DATE_FORMAT,
    hasSearchButton: false,
    placeholder: 'Visit Time',
    ready: false,
  };
  visitTimeRange: string = '';

  constructor(
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    protected translateService: TranslateService,
    private route: ActivatedRoute,
    private location: Location,
    public doctorService: DoctorsService,
    public cityService: CitiesService,
    public assistantService: AssistantsService,
    public patientService: PatientsService,
    public statusService: AccidentStatusService,
    public doctorsServicesService: ServicesService,
    public doctorsSurveyService: SurveyService,
    public doctorsDiagnosticService: DiagnosticService,
  ) {
    super();
    this.searcher = new Search();
  }

  ngOnInit(): void {
    this.loadLang();
    this.parseUrl();
    this.loadTypeOptions();
    this.loadFields();
  }

  private loadLang(): void {
    this.translateService.get(this.visitDatePickerConfig.placeholder).subscribe((visitTime) => {
      this.visitDatePickerConfig.placeholder = visitTime;
      this.visitDatePickerConfig.ready = true;
      this.handlingDatePickerConfig.placeholder =
        this.translateService.instant(this.handlingDatePickerConfig.placeholder);
      this.handlingDatePickerConfig.ready = true;
    });
  }

  private loadTypeOptions(): void {
    this.resultTypeOptions = [{'id': 1, 'title': 'datatable'}, {'id': 2, 'title': 'exl'}];
    this.resultType = 1;
  }

  private parseUrl(): void {
    const url = this.location.path(true);
    UrlHelper.getQueryVariables(url).forEach(obj => {
      ObjectHelper.eachProp(obj, key => {
        if (key === 'q' && obj[key].length) {
          this.query = obj[key];
        }
      });
    });
  }

  onSearch() {
    console.log('search', this.query);
  }

  private loadFields() {
    this.listFields = [
      {id: '1', title: 'field1'},
      {id: '2', title: 'field2'},
      {id: '3', title: 'field3'},
    ];
    this.selectedFields = [
      {id: '1', title: 'field1'},
      {id: '3', title: 'field3'},
    ];
  }

  onCaseTypeSelected($event: string) {
    console.log($event)
  }

  onDoctorSelected($event: any) {
    console.log($event)
  }

  onCitySelected($event: any) {
    console.log($event)
  }

  onAssistantSelected($event: any) {
    console.log($event)
  }

  onPatientSelected($event: any) {
    console.log($event)
  }

  onStatusSelected($event: any) {
    console.log($event)
  }

  onAccidentTypeSelected($event: any) {
    console.log($event)
  }

  onDoctorsServiceSelected($event: any) {
    console.log($event)
  }

  onDoctorsSurveySelected($event: any) {
    console.log($event)
  }

  onDoctorsDiagnosticSelected($event: any) {
    console.log($event)
  }

  onVisitTimeRangeChanged($event: string) {
    console.log($event)
  }

  onHandlingTimeRangeChanged($event: string) {
    console.log($event)
  }
}
