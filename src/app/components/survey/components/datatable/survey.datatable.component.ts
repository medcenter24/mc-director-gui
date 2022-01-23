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

import { Component, ViewChild } from '@angular/core';
import { AbstractDatatableController } from '../../../ui/tables/abstract.datatable.controller';
import { GlobalState } from '../../../../global.state';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import { TranslateService } from '@ngx-translate/core';
import { SurveyService } from '../../survey.service';
import { LoadableServiceInterface } from '../../../core/loadable';
import { Survey } from '../../survey';
import { DatatableAction, DatatableCol, DatatableComponent, DatatableTransformer } from '../../../ui/datatable';
import { ConfirmationService } from 'primeng/api';
import { Breadcrumb } from '../../../../theme/components/baContentTop/breadcrumb';
import { DatatableRequestBuilder } from '../../../ui/datatable/request/datatable.request.builder';
import { RequestBuilder } from '../../../core/http/request';
import { FilterRequestField, SortRequestField } from '../../../core/http/request/fields';
import { Disease, DiseaseService } from '../../../disease';

@Component({
  selector: 'nga-survey-datatable',
  templateUrl: './survey.datatable.html',
})
export class SurveyDatatableComponent extends AbstractDatatableController {
  protected componentName: string = 'SurveyDatatableComponent';

  isActive: boolean = true;

  @ViewChild('surveyDatatableComponent')
    private surveyDatatableComponent: DatatableComponent;

  constructor (
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    protected translateService: TranslateService,
    private surveyService: SurveyService,
    private confirmationService: ConfirmationService,
    public diseaseService: DiseaseService,
  ) {
    super();
  }

  protected onLangLoaded () {
    super.onLangLoaded();
    const breadcrumbs = [];
    const title = this.translateService.instant('Surveys');
    breadcrumbs.push(new Breadcrumb(title, '/pages/doctors/surveys', true));
    this._state.notifyDataChanged('menu.activeLink', breadcrumbs);
    this._state.notifyDataChanged('changeTitle', title);
  }

  protected getTranslateService (): TranslateService {
    return this.translateService;
  }

  protected getDatatableComponent (): DatatableComponent {
    return this.surveyDatatableComponent;
  }

  getService(): LoadableServiceInterface {
    return this.surveyService;
  }

  getEmptyModel(): Object {
    return new Survey();
  }

  getColumns(): DatatableCol[] {
    return [
      new DatatableCol('title', this.translateService.instant('Title')),
      new DatatableCol('description', this.translateService.instant('Description')),
      new DatatableCol('status', this.translateService.instant('Status')),
      new DatatableCol('diseases', this.translateService.instant('Diseases')),
      new DatatableCol('type', this.translateService.instant('Created By')),
    ];
  }

  protected hasControlPanel (): boolean {
    return true;
  }

  protected getControlPanelActions (): DatatableAction[] {
    return [
      new DatatableAction(this.translateService.instant('Add'), 'fa fa-plus', () => {
        this.setModel(this.getEmptyModel());
        this.displayDialog = true;
      }),
    ];
  }

  confirmDelete(): void {
    this.confirmationService.confirm({
      message: this.translateService.instant('Are you sure that you want to perform this action?'),
      accept: () => {
        this.delete();
      },
    });
  }

  protected hasFilterRow (): boolean {
    return true;
  }

  protected getRequestBuilder (): DatatableRequestBuilder {
    const requestBuilder = super.getRequestBuilder();

    requestBuilder.setSorter(new RequestBuilder([
      new SortRequestField('title'),
      new SortRequestField('status'),
    ]));

    requestBuilder.setFilter(new RequestBuilder([
      new FilterRequestField('title', null, FilterRequestField.MATCH_CONTENTS, FilterRequestField.TYPE_TEXT),
    ]));

    return requestBuilder;
  }

  protected setModel ( model: Object = null ): void {
    this.isActive = model && model.hasOwnProperty('status') && model['status'] === 'active';
    super.setModel( model );
  }

  getTransformers (): DatatableTransformer[] {
    const transformers = super.getTransformers();
    transformers.push(new DatatableTransformer('type', (val) => {
      return this.translateService.instant(val);
    }));
    transformers.push(new DatatableTransformer('status', (val) => {
      return this.translateService.instant(val);
    }));
    transformers.push(new DatatableTransformer('title', (val, row) => {
      if (row.status !== 'active') {
        const inactive = this.translateService.instant('Inactive');
        return `<span class="text-muted font-weight-bold" title="${inactive}">${val}</span>`;
      }
      return val;
    }));
    transformers.push(new DatatableTransformer('diseases', (val/*, row*/) => {
      if (!val || !val.length) {
        const noDiseasesMsg = this.translateService.instant('no_diseases_assigned');
        return `<span class="text-muted">${noDiseasesMsg}</span>`;
      } else {
        const diseaseList = [];
        val.forEach((v: Disease) => diseaseList.push(v.title));
        return diseaseList.join(', ');
      }
    }));
    return transformers;
  }

  save () {
    this.model.status = this.isActive ? 'active' : 'disabled';
    super.save();
  }

  diseasesChanged(event): void {
    this.model.diseases = event;
  }
}
