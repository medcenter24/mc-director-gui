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
import { SelectItem } from 'primeng/api';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import { Survey } from '../../survey';
import { SurveyService } from '../../survey.service';
import { LoadableComponent } from '../../../core/components/componentLoader';
import {
  FilterRequestField,
  PaginationLimitRequestField,
  PaginationOffsetRequestField,
  SortRequestField,
} from '../../../core/http/request/fields';

@Component({
  selector: 'nga-select-surveys',
  templateUrl: './select.html',
  outputs: ['init', 'loaded'],
})
export class SurveySelectComponent extends LoadableComponent implements OnInit {

  @Output() chosenSurveysChange: EventEmitter<Survey[]> = new EventEmitter<Survey[]>();
  @Input() chosenSurveys: Survey[] = [];

  isLoaded: boolean = false;
  dataSurveys: SelectItem[] = [];
  selectedSurveys: string[] = [];
  surveys: Survey[] = [];
  protected componentName: string = 'SelectSurveysComponent';

  constructor (
    private surveysService: SurveyService,
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
    this.surveysService.getSurveys(statusFilter).then(surveys => {
      this.stopLoader();

      this.surveys = surveys;
      this.dataSurveys = surveys.map(x => {
        return {
          label: `${x.title}`,
          value: `${x.id}`,
        };
      });

      if (!this.selectedSurveys) {
        // to show placeholder
        this.selectedSurveys = [];
      }

      this.isLoaded = true;
    }).catch((err) => {
      this.stopLoader();
      this._logger.error(err);
    });
  }

   onChanged(event): void {
     const surveys = this.surveys.filter(function (survey) {
       return event.value.indexOf(`${survey.id}`) !== -1;
     });

     this.chosenSurveysChange.emit(surveys);
   }

   reloadChosenSurveys(surveys: Survey[]): void {
     surveys.forEach((survey: Survey) => {
       const el = {
         label: survey.title,
         value: survey.id,
       };

       if (!this.dataSurveys.find(obj => +obj.value === +survey.id)) {
         this.dataSurveys.push(el);
         this.surveys.push(survey);
       }
     });

     this.chosenSurveys = surveys;
     this.selectedSurveys = this.chosenSurveys.length ? this.chosenSurveys.map(x => `${x.id}`) : [];
   }
}
