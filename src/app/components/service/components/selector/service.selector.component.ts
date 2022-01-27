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
import { Service } from '../../service';
import { CasesService } from '../../../case/cases.service';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import { LoadableComponent } from '../../../core/components/componentLoader';
import { SelectServicesComponent } from '../select';

// todo move that to accident or case folder and for service selector use autocompleter|multiselect
@Component({
  selector: 'nga-services-selector',
  templateUrl: 'selector.html',
})
export class ServiceSelectorComponent extends LoadableComponent implements OnInit {

  @Input() caseId: number = 0;
  @Output() changedServices: EventEmitter<Service[]> = new EventEmitter<Service[]>();
  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('selectServices')
    private selectServicesComponent: SelectServicesComponent;

  isLoaded: boolean = false;
  caseServices: Service[] = [];
  protected componentName: string = 'ServicesSelectorComponent';

  constructor (
    private casesService: CasesService,
    private _logger: LoggerComponent,
  ) {
    super();
  }

  ngOnInit () {
    this.isLoaded = true;
  }

  onDelete (service: Service): void {
    if (this.hasService(service)) {
      this.caseServices = this.caseServices.filter(function (el) {
        return el.id !== service.id;
      });
      this.selectServicesComponent.reloadChosenServices(this.caseServices);
      this.onServicesChanged();
    }
  }

  onServicesChanged(): void {
    this.changedServices.emit(this.caseServices);
  }

  onSelectServicesLoaded(name: string): void {
    this.stopLoader(name);
    if (this.caseId) {
      this.startLoader();
      this.casesService.getCaseServices(this.caseId).subscribe({next: services => {
        this.stopLoader();
        this.caseServices = services;
        this.selectServicesComponent.reloadChosenServices(this.caseServices);
        this.onServicesChanged();
      }, error: (err) => {
        this.stopLoader();
        this._logger.error(err);
      }});
    }
  }

  onSelectServicesInit(name: string): void {
    this.startLoader(name);
  }

  private hasService (service: Service): boolean {
    const result = this.caseServices.find(function (el) {
      return el.id === service.id;
    });

    return !!result;
  }
}
