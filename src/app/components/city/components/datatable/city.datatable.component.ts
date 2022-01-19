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
import { TranslateService } from '@ngx-translate/core';
import { GlobalState } from '../../../../global.state';
import { DatatableConfig } from '../../../ui/datatable';
import { DatatableCol } from '../../../ui/datatable';
import { DatatableAction } from '../../../ui/datatable';
import { CitiesService } from '../../cities.service';
import { City } from '../../city';
import { DatatableComponent } from '../../../ui/datatable';
import { RegionService } from '../../../region';
import { AutocompleterComponent } from '../../../ui/selector/components/autocompleter';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import { AbstractDatatableController } from '../../../ui/tables/abstract.datatable.controller';
import { LoadableServiceInterface } from '../../../core/loadable';
import { Breadcrumb } from '../../../../theme/components/baContentTop/breadcrumb';

@Component({
  selector: 'nga-city-datatable',
  templateUrl: './city.datatable.html',
})
export class CityDatatableComponent extends AbstractDatatableController {
  protected componentName: string = 'CityDatatableComponent';

  @ViewChild('cityDatatableComponent')
    private cityDatatableComponent: DatatableComponent;

  @ViewChild('regionAutocompleterComponent')
    private regionAutocompleterComponent: AutocompleterComponent;

  displayDialog: boolean;
  langLoaded: boolean = false;
  datatableConfig: DatatableConfig;
  city: City;

  constructor(
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    protected translateService: TranslateService,
    private citiesService: CitiesService,
    public regionService: RegionService,
  ) {
    super();
  }

  protected onLangLoaded () {
    super.onLangLoaded();
    const breadcrumbs = [];
    const title = this.translateService.instant('Cities');
    breadcrumbs.push(new Breadcrumb(title, '/pages/geo/cities', true));
    this._state.notifyDataChanged('menu.activeLink', breadcrumbs);
    this._state.notifyDataChanged('changeTitle', title);
  }

  protected getService (): LoadableServiceInterface {
    return this.citiesService;
  }

  protected getTranslateService (): TranslateService {
    return this.translateService;
  }

  protected getEmptyModel (): Object {
    return new City();
  }

  protected getDatatableComponent (): DatatableComponent {
    return this.cityDatatableComponent;
  }

  protected getColumns (): DatatableCol[] {
    return [
      new DatatableCol('title', this.translateService.instant('Title')),
      new DatatableCol('regionTitle', this.translateService.instant('Region')),
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
    this.setCity(new City());
    this.setAutocompleterRegion(0);
    this.displayDialog = true;
  }

  private setCity(city: City = null): void {
    this.city = city;
  }

  save() {
    const postfix = 'Save';
    this.startLoader(postfix);
    this.citiesService.save(this.city)
      .subscribe({next: () => {
        this.stopLoader(postfix);
        this.setCity();
        this.displayDialog = false;
        this.cityDatatableComponent.refresh();
      }, error: () => this.stopLoader(postfix) });
  }

  onRowSelect(event) {
    this.setCity(this.cloneCity(event.data));
    this.setAutocompleterRegion(event.data.id);
    this.displayDialog = true;
  }

  private setAutocompleterRegion(regionId: number): void {
    if (this.regionAutocompleterComponent) {
      this.regionAutocompleterComponent.selectItems(regionId);
    }
  }

  cloneCity(c: City): City {
    const city = new City();
    for (const prop of Object.keys(c)) {
      city[prop] = c[prop];
    }
    return city;
  }

  delete() {
    this._state.notifyDataChanged('confirmDialog',
      {
        header: this.translateService.instant('Delete'),
        message: this.translateService.instant('Are you sure that you want to delete the city?'),
        accept: () => {
          const postfix = 'Delete';
          this.startLoader(postfix);
          this.citiesService.destroy(this.city)
            .subscribe({next: () => {
              this.stopLoader(postfix);
              this.setCity();
              this.displayDialog = false;
              this.cityDatatableComponent.refresh();
            }, error: () => this.stopLoader(postfix)});
        },
        icon: 'fa fa-window-close-o red',
      },
    );
  }
}
