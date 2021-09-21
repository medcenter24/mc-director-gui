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

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import { Survey } from '../../survey';
import { CasesService } from '../../../case/cases.service';
import { LoadableComponent } from '../../../core/components/componentLoader';
import { SurveySelectComponent } from '../select/survey.select.component';

@Component({
  selector: 'nga-surveys-selector',
  templateUrl: 'selector.html',
  outputs: ['init', 'loaded'],
})
export class SurveysSelectorComponent extends LoadableComponent implements OnInit {

  @Input() caseId: number = 0;
  @Output() priceChanged: EventEmitter<number> = new EventEmitter<number>();
  @Output() changed: EventEmitter<Survey[]> = new EventEmitter<Survey[]>();

  @ViewChild('selectSurveys')
    private selectSurveysComponent: SurveySelectComponent;

  isLoaded: boolean = false;
  caseSurveys: Survey[] = [];
  protected componentName: string = 'SurveysSelectorComponent';

  constructor (
    private casesService: CasesService,
    private _logger: LoggerComponent,
  ) {
    super();
  }

  ngOnInit () {
    this.isLoaded = true;
  }

  onDelete (survey: Survey): void {
    if (this.hasSurvey(survey)) {
      this.caseSurveys = this.caseSurveys.filter(function (el) {
        return el.id !== survey.id;
      });
      this.selectSurveysComponent.reloadChosenSurveys(this.caseSurveys);
      this.changed.emit(this.caseSurveys);
    }
  }

  onSurveysChanged(): void {
    this.changed.emit(this.caseSurveys);
  }

  onSelectSurveysLoaded(name: string): void {
    this.stopLoader(name);
    if (this.caseId) {
      const postfix = 'SelectSurveysLoaded';
      this.startLoader(postfix);
      this.casesService.getCaseSurveys(this.caseId).then(surveys => {
        this.stopLoader(postfix);
        this.caseSurveys = surveys;
        this.selectSurveysComponent.reloadChosenSurveys(this.caseSurveys);
        this.changed.emit(this.caseSurveys);
      }).catch((err) => {
        this.stopLoader(postfix);
        this._logger.error(err);
      });
    }
  }

  onSelectSurveysInit(name: string): void {
    this.startLoader(name);
  }

  private hasSurvey (survey: Survey): boolean {
    const result = this.caseSurveys.find(function (el) {
      return el.id === survey.id;
    });

    return !!result;
  }
}
