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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import { Survey } from '../../survey';
import { CasesService } from '../../../case/cases.service';
import { LoadableComponent } from '../../../core/components/componentLoader';
import {SurveyService} from '../../survey.service';

@Component({
  selector: 'nga-surveys-selector',
  templateUrl: 'survey.selector.html',
})
export class SurveysSelectorComponent extends LoadableComponent implements OnInit {

  @Input() caseId: number = 0;
  @Input() isStaticForm: boolean = false;
  @Output() priceChanged: EventEmitter<number> = new EventEmitter<number>();
  @Output() changed: EventEmitter<Survey[]> = new EventEmitter<Survey[]>();
  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  isLoaded: boolean = false;
  caseSurveys: Survey[] = [];
  protected componentName: string = 'SurveysSelectorComponent';

  constructor (
    private casesService: CasesService,
    private _logger: LoggerComponent,
    public surveysService: SurveyService,
  ) {
    super();
  }

  ngOnInit () {
    this.casesService.getCaseSurveys(this.caseId)
      .subscribe(surveys => {
        this.caseSurveys = surveys;
        this.onSurveysChanged();
        this.isLoaded = true;
      });
  }

  onDelete (survey: Survey): void {
    if (this.hasSurvey(survey)) {
      this.caseSurveys = this.caseSurveys.filter(function (el) {
        return el.id !== survey.id;
      });
      this.onSurveysChanged();
    }
  }

  onSurveysChanged(): void {
    this.reSort(this.caseSurveys);
    this.changed.emit(this.caseSurveys);
  }

  private hasSurvey (survey: Survey): boolean {
    const result = this.caseSurveys.find(function (el) {
      return el.id === survey.id;
    });

    return !!result;
  }

  onSurveySelected($event: Survey) {
    if (!this.hasSurvey($event)) {
      this.caseSurveys = [...this.caseSurveys, $event];
      this.onSurveysChanged();
    }
  }

  private reSort(sf: Survey[]): void {
    let sort = 1;
    sf.map((row) => {
      row.sort = sort++;
    });
  }
}
