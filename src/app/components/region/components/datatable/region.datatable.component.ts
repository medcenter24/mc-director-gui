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
 * Copyright (c) 2019 (original work) MedCenter24.com;
 */

import { Component, ViewChild } from '@angular/core';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import { TranslateService } from '@ngx-translate/core';
import { GlobalState } from '../../../../global.state';
import { DatatableConfig } from '../../../ui/datatable';
import { DatatableCol } from '../../../ui/datatable';
import { DatatableAction } from '../../../ui/datatable';
import { RegionService } from '../../region.service';
import { Region } from '../../region';
import { DatatableComponent } from '../../../ui/datatable';
import { CountryService } from '../../../country';
import { AutocompleterComponent } from '../../../ui/selector/components/autocompleter';
import { AbstractDatatableController } from '../../../ui/tables/abstract.datatable.controller';
import { Breadcrumb } from '../../../../theme/components/baContentTop/breadcrumb';
import { LoadableServiceInterface } from '../../../core/loadable';

@Component({
  selector: 'nga-region-datatable',
  templateUrl: './region.datatable.html',
})
export class RegionDatatableComponent extends AbstractDatatableController {
  protected componentName: string = 'RegionDatatableComponent';

  @ViewChild('datatable')
    private datatable: DatatableComponent;

  @ViewChild('countryAutocompleterComponent')
    private countryAutocompleterComponent: AutocompleterComponent;

  displayDialog: boolean;
  langLoaded: boolean = false;
  datatableConfig: DatatableConfig;

  region: Region;

  constructor(
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    protected translateService: TranslateService,
    private regionService: RegionService,
    public countryService: CountryService,
  ) {
    super();
  }

  protected onLangLoaded () {
    super.onLangLoaded();
    const breadcrumbs = [];
    const title = this.translateService.instant('Regions');
    breadcrumbs.push(new Breadcrumb(title, '/pages/geo/regions', true));
    this._state.notifyDataChanged('menu.activeLink', breadcrumbs);
    this._state.notifyDataChanged('changeTitle', title);
  }

  protected getService (): LoadableServiceInterface {
    return this.regionService;
  }

  protected getDatatableComponent (): DatatableComponent {
    return this.datatable;
  }

  protected getTranslateService (): TranslateService {
    return this.translateService;
  }

  protected getEmptyModel (): Object {
    return new Region();
  }

  protected getColumns (): DatatableCol[] {
    return [
      new DatatableCol('title', this.translateService.instant('Title')),
      new DatatableCol('countryTitle', this.translateService.instant('Country')),
    ];
  }

  protected hasControlPanel (): boolean {
    return true;
  }

  protected getControlPanelActions (): DatatableAction[] {
    return [
      new DatatableAction(this.translateService.instant('Add'), 'fa fa-plus', () => {
        this.showDialogToAdd();
      }),
    ];
  }

  showDialogToAdd() {
    this.setRegion(new Region());
    this.setAutocompleterCountry(0);
    this.displayDialog = true;
  }

  private setRegion(region: Region = null): void {
    this.region = region;
  }

  save() {
    const postfix = 'Save';
    this.startLoader(postfix);
    this.regionService.save(this.region)
      .subscribe({next: () => {
        this.stopLoader(postfix);
        this.setRegion();
        this.displayDialog = false;
        this.datatable.refresh();
      }, error: () => this.stopLoader(postfix)});
  }

  onRowSelect(event) {
    this.setRegion(this.cloneRegion(event.data));
    this.setAutocompleterCountry(event.data.id);
    this.displayDialog = true;
  }

  private setAutocompleterCountry(countryId: number): void {
    if (this.countryAutocompleterComponent) {
      this.countryAutocompleterComponent.selectItems(countryId);
    }
  }

  cloneRegion( c: Region): Region {
    const region = new Region();
    for (const prop of Object.keys(c)) {
      region[prop] = c[prop];
    }
    return region;
  }

  delete() {
    this._state.notifyDataChanged('confirmDialog',
      {
        header: this.translateService.instant('Delete'),
        message: this.translateService.instant('Are you sure that you want to delete region?'),
        accept: () => {
          const postfix = 'Delete';
          this.startLoader(postfix);
          this.regionService.destroy(this.region)
            .subscribe({next: () => {
              this.stopLoader(postfix);
              this.setRegion();
              this.displayDialog = false;
              this.datatable.refresh();
            }, error: () => this.stopLoader(postfix)});
        },
        icon: 'fa fa-window-close-o red',
      },
    );
  }
}
