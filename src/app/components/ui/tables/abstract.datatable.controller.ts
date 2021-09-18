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

import { Injectable, OnInit } from '@angular/core';
import {
  DatatableAction,
  DatatableCol, DatatableComponent,
  DatatableConfig, DatatableTransformer,
} from '../datatable';
import { TranslateService } from '@ngx-translate/core';
import { LoadingComponent } from '../../core/components/componentLoader';
import { ObjectHelper } from '../../../helpers/object.helper';
import { LoadableServiceInterface } from '../../core/loadable';
import { DatatableRequestBuilder } from '../datatable/request/datatable.request.builder';
import { DatatableDataProvider } from '../datatable/entities';

@Injectable()
export abstract class AbstractDatatableController extends LoadingComponent implements OnInit {
  displayDialog: boolean;
  langLoaded: boolean = false;
  datatableConfig: DatatableConfig;

  /**
   * class which describe the model
   */
  model: any;

  protected abstract getTranslateService(): TranslateService;
  protected abstract getDatatableComponent(): DatatableComponent;
  protected abstract getService(): LoadableServiceInterface;
  protected abstract getColumns(): DatatableCol[];
  protected abstract getEmptyModel(): Object;

  private datatableDataProvider: DatatableDataProvider;

  protected getRequestBuilder(): DatatableRequestBuilder {
    return new DatatableRequestBuilder();
  }

  protected getControlPanelActions(): DatatableAction[] {
    return [];
  }

  /**
   * @return {DatatableTransformer[]}
   */
  protected getTransformers(): DatatableTransformer[] {
    return [];
  }

  protected getDatatableDataProvider(): DatatableDataProvider {
    if (!this.datatableDataProvider) {
      this.datatableDataProvider = new DatatableDataProvider(
        this.datatableConfig,
        this.getService(),
      );
    }
    return this.datatableDataProvider;
  }

  /**
   * after the language was loaded, but datatable is not initialized
   */
  protected onLangLoaded() {
  }

  protected hasControlPanel(): boolean {
    return false;
  }

  ngOnInit() {
    this.getTranslateService().get('Yes').subscribe(() => {
      this.langLoaded = true;
      this.onLangLoaded();
      this.datatableConfig = DatatableConfig.factory({
        dataProvider: this.getDatatableDataProvider(),
        cols: this.getColumns(),
        refreshTitle: this.getTranslateService().instant('Refresh'),
        controlPanel: this.hasControlPanel(),
        controlPanelActions: this.getControlPanelActions(),
        captionPanel: this.hasCaptionPanel(),
        captionPanelActions: this.getCaptionActions(),
        onRowSelect: event => {
          this.onRowSelect(event);
        },
        transformers: this.getTransformers(),
        requestBuilder: this.getRequestBuilder(),
        hasFilterRow: this.hasFilterRow(),
      });
      this.onDatatableConfigInitialized();
    });
  }

  protected onDatatableConfigInitialized(): void {
  }

  protected hasFilterRow(): boolean {
    return false;
  }

  protected hasCaptionPanel(): boolean {
    return false;
  }

  protected getCaptionActions(): DatatableAction[] {
    return [];
  }

  protected setModel(model: Object = null): void {
    this.model = model;
  }

  save() {
    const postfix = 'Save';
    this.startLoader(postfix);
    this.getService().save(this.model)
      .then((model: Object) => {
        this.displayDialog = false;
        if (!this.model.id) {
          // refresh on adding
          this.refresh();
        } else {
          this.updateModel(model);
        }
        // to close popup
        this.setModel();
        this.stopLoader(postfix);
      })
      .catch(e => {
        console.error(e);
        this.stopLoader(postfix);
      });
  }

  protected onRowSelect(event) {
    if (this.model && event.data && this.model.id === event.data.id && this.displayDialog) {
      // do nothing, already opened
    } else {
      this.setModel(this.cloneModel(event.data));
      this.displayDialog = true;
    }
  }

  protected cloneModel(model: Object): Object {
    const cloned = this.getEmptyModel();
    ObjectHelper.clone(model, cloned);
    return cloned;
  }

  protected refresh(): void {
    this.getDatatableComponent().refresh();
  }

  protected updateModel(model: Object): boolean {
    return this.getDatatableComponent().updateModel(model);
  }

  protected delete(): void {
    const postfix = 'Delete';
    this.startLoader(postfix);
    this.getService().destroy(this.model)
      .then(() => {
        this.stopLoader(postfix);
        this.setModel();
        this.displayDialog = false;
        this.getDatatableComponent().refresh();
      })
      .catch(() => this.stopLoader(postfix));
  }

  deselectAll(): void {
    this.getDatatableComponent().deselectAll();
  }
}
