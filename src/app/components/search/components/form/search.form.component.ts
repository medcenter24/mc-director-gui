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
import {Doctor, DoctorsService} from '../../../doctors';
import {CitiesService, City} from '../../../city';
import {Assistant, AssistantsService} from '../../../assistant';
import {PatientsService} from '../../../patient/patients.service';
import {AccidentStatus, AccidentStatusService} from '../../../accident/components/status';
import {Service, ServicesService} from '../../../service';
import {Survey, SurveyService} from '../../../survey';
import {DiagnosticService} from '../../../diagnostic/diagnostic.service';
import {DateHelper} from '../../../../helpers/date.helper';
import {Patient} from '../../../patient/patient';
import {Diagnostic} from '../../../diagnostic/diagnostic';
import {AccidentTypesService} from '../../../accident/components/type/types.service';
import {AccidentType} from '../../../accident/components/type/type';
import {SearchService} from '../../search.service';
import {SearchResultType} from './contracts/search.result.type';
import {SearchField} from './contracts/searhc.field';
import {DatePickerConfig} from '../../../ui/date/picker/date.picker.config';
import {SmartSearch, SmartSearchService} from '../smartSearch';
import {Searcher} from './models/searcher';

@Component({
  selector: 'nga-search-form',
  templateUrl: './search.form.html',
  styleUrls: ['./search.scss'],
})
export class SearchFormComponent extends LoadingComponent implements OnInit {
  protected componentName: string = 'SearchFormComponent';

  query: string = '';

  resultTypeOptions: SearchResultType[] = [];
  resultType: string = 'dt';

  listFields: SearchField[] = [];
  selectedFields: SearchField[] = [];

  searcher: Searcher;

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
    public accidentTypesService: AccidentTypesService,
    public searchService: SearchService,
    public smartSearchService: SmartSearchService,
  ) {
    super();
    this.searcher = SearchFormComponent.createSearcher();
  }

  ngOnInit(): void {
    this.loadLang();
    this.parseUrl();
  }

  private loadLang(): void {
    this.translateService.get(this.visitDatePickerConfig.placeholder).subscribe((visitTime) => {
      this.visitDatePickerConfig.placeholder = visitTime;
      this.visitDatePickerConfig.ready = true;
      this.handlingDatePickerConfig.placeholder =
        this.translateService.instant(this.handlingDatePickerConfig.placeholder);
      this.handlingDatePickerConfig.ready = true;

      // lang loaded, we can load objects
      this.loadResultTypeOptions();
      this.loadFields();
    });
  }

  private loadResultTypeOptions(): void {
    this.resultTypeOptions = [{
      id: 'datatable', title: this.translateService.instant('Table'),
    }, {
      id: 'excel', title: this.translateService.instant('Excel'),
    }];
    this.resultType = 'datatable';
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

  private loadFields() {
    this.listFields = [
      {id: 'npp', title: 'Npp', order: '', sort: 1},
      {id: 'patient', title: 'Patient', order: '', sort: 2},
      {id: 'assist-ref-num', title: 'Assistant Ref. Number', order: '', sort: 3},
      {id: 'city', title: 'City', order: '', sort: 4},
      {id: 'doctor-income', title: 'Doctor\'s fees', order: '', sort: 5},
    ];
  }

  onCaseTypeSelected($event: string) {
    if (!this.searcher.filters.caseableTypes.includes($event)) {
      this.searcher.filters.caseableTypes.push($event);
    }
  }

  onDoctorSelected($event: Doctor) {
    if (!this.searcher.filters.doctors.find((doctor) => doctor.id === $event.id)) {
      this.searcher.filters.doctors.push($event);
    }
  }

  onAssistantSelected($event: Assistant) {
    if (!this.searcher.filters.assistants.find((assistant) => assistant.id === $event.id)) {
      this.searcher.filters.assistants.push($event);
    }
  }

  onCitySelected($event: City) {
    if (!this.searcher.filters.cities.find((city) => city.id === $event.id)) {
      this.searcher.filters.cities.push($event);
    }
  }

  onPatientSelected($event: Patient) {
    if (!this.searcher.filters.patients.find((patient) => patient.id === $event.id)) {
      this.searcher.filters.patients.push($event);
    }
  }

  onHandlingTimeRangeChanged($event: string) {
    if ($event.length
      && !this.searcher.filters.handlingTimeRanges.find((handlingTimeRange) => handlingTimeRange === $event)) {
      this.searcher.filters.handlingTimeRanges.push($event);
    }
  }

  onStatusSelected($event: AccidentStatus) {
    if (!this.searcher.filters.accidentStatuses.find((status) => status.id === $event.id)) {
      this.searcher.filters.accidentStatuses.push($event);
    }
  }

  onAccidentTypeSelected($event: AccidentType) {
    if (!this.searcher.filters.accidentTypes.find((type) => type.id === $event.id)) {
      this.searcher.filters.accidentTypes.push($event);
    }
  }

  onVisitTimeRangeChanged($event: string) {
    if ($event.length
      && !this.searcher.filters.visitTimeRanges.find((visitTimeRange) => visitTimeRange === $event)) {
      this.searcher.filters.visitTimeRanges.push($event);
    }
  }

  onDoctorsServiceSelected($event: Service) {
    if (!this.searcher.filters.doctorServices.find((service) => service.id === $event.id)) {
      this.searcher.filters.doctorServices.push($event);
    }
  }

  onDoctorsSurveySelected($event: Survey) {
    if (!this.searcher.filters.doctorSurveys.find((survey) => survey.id === $event.id)) {
      this.searcher.filters.doctorSurveys.push($event);
    }
  }

  onDoctorsDiagnosticSelected($event: Diagnostic) {
    if (!this.searcher.filters.doctorDiagnostics.find((diagnostic) => diagnostic.id === $event.id)) {
      this.searcher.filters.doctorDiagnostics.push($event);
    }
  }

  saveSearcher() {
    const smartSearch = SmartSearch.fromSearcher(this.searcher);
    this.smartSearchService.save(smartSearch).subscribe();
  }

  onSearch() {
    this.searchService.search(this.searcher).subscribe(console.log);
  }

  private static generateSearchTitle(): string {
    const dt = new Date();
    return DateHelper.getUnixDateWithTime(dt);
  }

  onSmartSearchSelected($event: any[]) {
    const smartSearch = SmartSearch.fromData($event);
    this.searcher = Searcher.fromSmartSearch(smartSearch);

    this.selectedFields = [];
    let list = this.listFields;
    this.listFields = [];
    this.searcher.fields.forEach((row) => {
      this.listFields.push(row);
      this.selectedFields.push(row);
      list = list.filter((sf) => sf.id !== row.id );
    });
    list.forEach((row) => {
      this.listFields.push(row);
    });
  }

  deleteSearcher() {
    this._state.notifyDataChanged('confirmDialog',
      {
        header: this.translateService.instant('Delete'),
        message: this.translateService.instant('Are you sure that you want to delete this?'),
        accept: () => {
          const postfix = 'Delete';
          this.startLoader(postfix);
          this.smartSearchService.destroy(this.searcher.id)
            .subscribe({next: () => {
                this.stopLoader(postfix);
                this.clearSearcher();
              }, error: () => {
                this.stopLoader(postfix);
              }});
        },
        icon: 'fa fa-window-close-o red',
      },
    );
  }

  clearSearcher() {
    this.searcher = SearchFormComponent.createSearcher();
  }

  private static createSearcher(): Searcher {
    return new Searcher(0, SearchFormComponent.generateSearchTitle(), 'searcher');
  }

  colOrderClassPrefix(order: string): string {
    let style = '';
    if (order === 'asc') {
      style = '-alpha-asc';
    } else if (order === 'desc') {
      style = '-alpha-desc';
    }
    return style;
  }

  toggleColumnSort(column: SearchField) {
    if (column.order === '') {
      column.order = 'asc';
    } else if (column.order === 'asc') {
      column.order = 'desc';
    } else {
      column.order = '';
    }
    return column.order;
  }

  fieldsReordered() {
    this.updateSearcherFields();
  }

  private reSort(sf: SearchField[]): void {
    let sort = 1;
    sf.map((row) => {
      row.sort = sort++;
    });
  }

  fieldsSelected() {
    this.updateSearcherFields();
  }

  private updateSearcherFields() {
    const fields = [];
    this.listFields.forEach((field) => {
      const found = this.selectedFields.find((row) => row.id === field.id);
      if (found) {
        fields.push(field);
      }
    });
    this.reSort(fields);
    this.searcher.fields = fields;
  }
}
