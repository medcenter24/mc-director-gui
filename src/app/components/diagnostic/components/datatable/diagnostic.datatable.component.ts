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

import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalState } from '../../../../global.state';
import { AbstractDatatableController } from '../../../ui/tables/abstract.datatable.controller';
import { DatatableAction, DatatableCol, DatatableComponent, DatatableTransformer } from '../../../ui/datatable';
import { ObjectHelper } from '../../../../helpers/object.helper';
import { LoadableServiceInterface } from '../../../core/loadable';
import { DiagnosticEditorComponent } from '../editor';
import { DiagnosticService } from '../../diagnostic.service';
import { Diagnostic } from '../../diagnostic';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import { Breadcrumb } from '../../../../theme/components/baContentTop/breadcrumb';
import { Disease } from '../../../disease';
import {DatatableRequestBuilder} from '../../../ui/datatable/request/datatable.request.builder';
import {RequestBuilder} from '../../../core/http/request';
import {FilterRequestField, SortRequestField} from '../../../core/http/request/fields';
import {Location} from '@angular/common';

@Component({
  selector: 'nga-diagnostic-datatable',
  templateUrl: './diagnostic.datatable.html',
})
export class DiagnosticDatatableComponent extends AbstractDatatableController {
  protected componentName: string = 'DiagnosticDatatableComponent';

  @ViewChild('diagnosticEditor')
    private diagnosticEditor: DiagnosticEditorComponent;

  @ViewChild('diagnosticDatatableComponent')
    private diagnosticDatatableComponent: DatatableComponent;

  constructor (
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    protected translateService: TranslateService,
    private diagnosticService: DiagnosticService,
    protected datatable: ElementRef,
    private location: Location,
  ) {
    super();
  }

  protected onLangLoaded () {
    super.onLangLoaded();
    const breadcrumbs = [];
    const title = this.translateService.instant('Diagnoses');
    breadcrumbs.push(new Breadcrumb(title, '/pages/doctors/diagnostics', true));
    this._state.notifyDataChanged('menu.activeLink', breadcrumbs);
    this._state.notifyDataChanged('changeTitle', title);
  }

  protected getDatatableComponent (): DatatableComponent {
    return this.diagnosticDatatableComponent;
  }

  protected getTranslateService (): TranslateService {
    return this.translateService;
  }

  getService(): LoadableServiceInterface {
    return this.diagnosticService;
  }

  getEmptyModel(): Object {
    return new Diagnostic();
  }

  getColumns(): DatatableCol[] {
    return [
      new DatatableCol('id', this.translateService.instant('ID')),
      new DatatableCol('title', this.translateService.instant('Title')),
      new DatatableCol('description', this.translateService.instant('Description')),
      new DatatableCol('diseases', this.translateService.instant('Diseases')),
    ];
  }

  protected setModel(model: Object = null): void {
    this.model = model;
    if (this.displayDialog && this.diagnosticEditor) {
      this.diagnosticEditor.editDiagnostic(this.model);
    }
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

  protected hasFilterRow (): boolean {
    return true;
  }

  getRequestBuilder (): DatatableRequestBuilder {
    const requestBuilder = super.getRequestBuilder();

    requestBuilder.setSorter(new RequestBuilder([
      new SortRequestField('id', 'asc'),
    ]));

    requestBuilder.setFilter(new RequestBuilder([
      new FilterRequestField('title', null, FilterRequestField.MATCH_CONTENTS, FilterRequestField.TYPE_TEXT),
      new FilterRequestField('description', null, FilterRequestField.MATCH_CONTENTS, FilterRequestField.TYPE_TEXT),
    ]));

    const urlRequestBuilder = DatatableRequestBuilder.fromUrl(this.location.path(true));
    urlRequestBuilder.propagate(requestBuilder);
    return urlRequestBuilder;
  }

  closeDiagnosticEditor(): void {
    this.displayDialog = false;
    this.deselectAll();
  }

  onDiagnosticChanged(diagnostic: Diagnostic): void {
    let nDiag;
    if (!diagnostic || !this.updateModel(diagnostic)) {
      nDiag = this.getEmptyModel();
      this.refresh();
    } else {
      nDiag = ObjectHelper.clone(diagnostic, this.getEmptyModel());
    }
    this.setModel(nDiag);
    this.closeDiagnosticEditor();
  }

  protected hasCaptionPanel (): boolean {
    return true;
  }

  protected getCaptionActions (): DatatableAction[] {
    return [
      new DatatableAction(this.translateService.instant('Add'), 'fa fa-plus', () => {
        this.setModel(this.getEmptyModel());
        this.displayDialog = true;
      }),
    ];
  }

  getTransformers (): DatatableTransformer[] {
    const transformers = super.getTransformers();
    transformers.push(new DatatableTransformer('title', (val, row) => {
      if (row.status !== 'active') {
        const inactive = this.translateService.instant('Inactive');
        return `<span class="text-danger" title="${inactive}">${val}</span>`;
      }
      return val;
    }));
    transformers.push(new DatatableTransformer('diseases', (val/*, row*/) => {
      if (!val.length) {
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
}
