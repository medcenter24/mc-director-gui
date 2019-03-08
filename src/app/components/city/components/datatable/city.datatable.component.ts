/*
 * Copyright (c) 2018.
 *
 * @author Zagovorychev Olexandr <zagovorichev@gmail.com>
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingComponent } from '../../../core/components/componentLoader';
import { Logger } from 'angular2-logger/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalState } from '../../../../global.state';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { DatatableConfig } from '../../../ui/datatable';
import { DatatableCol } from '../../../ui/datatable';
import { DatatableAction } from '../../../ui/datatable';
import { CitiesService } from '../../cities.service';
import { City } from '../../city';
import { DatatableComponent } from '../../../ui/datatable';

@Component({
  selector: 'nga-city-datatable',
  templateUrl: './city.datatable.html',
})
export class CityDatatableComponent extends LoadingComponent implements OnInit {
  protected componentName: string = 'CityDatatableComponent';

  @ViewChild('datatable')
    private datatable: DatatableComponent;

  displayDialog: boolean;
  langLoaded: boolean = false;
  datatableConfig: DatatableConfig;

  city: City;

  constructor(
    protected loadingBar: SlimLoadingBarService,
    protected _logger: Logger,
    protected _state: GlobalState,
    protected translateService: TranslateService,
    private citiesService: CitiesService,
  ) {
    super();
  }

  ngOnInit() {
    this.translateService.get('Yes').subscribe(() => {
      this.langLoaded = true;
      this.datatableConfig = DatatableConfig.factory({
        dataProvider: (filters: Object) => {
          return this.citiesService.search(filters);
        },
        cols: [
          new DatatableCol('title', this.translateService.instant('Title')),
        ],
        refreshTitle: this.translateService.instant('Refresh'),
        controlPanel: true,
        controlPanelActions: [
          new DatatableAction(this.translateService.instant('Add'), 'fa fa-plus', () => {
            this.showDialogToAdd();
          }),
        ],
        onRowSelect: event => {
          this.onRowSelect(event);
        },
        sortBy: 'title',
      });
    });
  }

  showDialogToAdd() {
    this.setCity(new City());
    this.displayDialog = true;
  }

  private setCity(city: City = null): void {
    this.city = city;
  }

  save() {
    const postfix = 'Save';
    this.startLoader(postfix);
    this.citiesService.save(this.city)
      .then(() => {
        this.stopLoader(postfix);
        this.setCity();
        this.displayDialog = false;
        this.datatable.refresh();
      })
      .catch(() => this.stopLoader(postfix));
  }

  onRowSelect(event) {
    this.setCity(this.cloneCity(event.data));
    this.displayDialog = true;
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
            .then(() => {
              this.stopLoader(postfix);
              this.setCity();
              this.displayDialog = false;
              this.datatable.refresh();
            })
            .catch(() => this.stopLoader(postfix));
        },
        icon: 'fa fa-window-close-o red',
      },
    );
  }
}