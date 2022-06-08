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
import { Service } from '../../service';
import { CasesService } from '../../../case/cases.service';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import { LoadableComponent } from '../../../core/components/componentLoader';
import {ServicesService} from '../../services.service';

@Component({
  selector: 'nga-services-selector',
  templateUrl: 'service.selector.html',
})
export class ServiceSelectorComponent extends LoadableComponent implements OnInit {

  @Input() caseId: number = 0;
  @Input() isStaticForm: boolean = false;
  @Output() changedServices: EventEmitter<Service[]> = new EventEmitter<Service[]>();
  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  isLoaded: boolean = false;
  caseServices: Service[] = [];
  protected componentName: string = 'ServicesSelectorComponent';

  constructor (
    private casesService: CasesService,
    private _logger: LoggerComponent,
    public servicesService: ServicesService,
  ) {
    super();
  }

  ngOnInit () {
      this.casesService.getCaseServices(this.caseId)
        .subscribe(services => {
          this.caseServices = services;
          this.onServicesChanged();
          this.isLoaded = true;
        });
  }

  onDelete (service: Service): void {
    if (this.hasService(service)) {
      this.caseServices = this.caseServices.filter(function (el) {
        return el.id !== service.id;
      });
      this.onServicesChanged();
    }
  }

  onServicesChanged(): void {
    this.reSort(this.caseServices);
    this.changedServices.emit(this.caseServices);
  }

  private hasService (service: Service): boolean {
    const result = this.caseServices.find(function (el) {
      return el.id === service.id;
    });

    return !!result;
  }

  onServiceSelected($event: Service) {
    if (!this.hasService($event)) {
      this.caseServices = [...this.caseServices, $event];
      this.onServicesChanged();
    }
  }

  private reSort(sf: Service[]): void {
    let sort = 1;
    sf.map((row) => {
      row.sort = sort++;
    });
  }
}
