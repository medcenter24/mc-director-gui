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

import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { ServicesService } from '../../services.service';
import { SelectItem } from 'primeng/api';
import { Service } from '../../service';
import { LoggerComponent } from '../../../core/logger/LoggerComponent';
import { LoadableComponent } from '../../../core/components/componentLoader';
import {
  FilterRequestField,
  PaginationLimitRequestField,
  PaginationOffsetRequestField,
  SortRequestField,
} from '../../../core/http/request/fields';

@Component({
  selector: 'nga-select-services',
  templateUrl: './select.html',
})
export class SelectServicesComponent extends LoadableComponent implements OnInit {

  @Output() chosenServicesChange: EventEmitter<Service[]> = new EventEmitter<Service[]>();
  @Input() chosenServices: Service[] = [];

  isLoaded: boolean = false;
  dataServices: SelectItem[] = [];
  selectedServices: string[] = [];
  services: Service[] = [];
  protected componentName: string = 'SelectServicesComponent';

  constructor (
    private servicesService: ServicesService,
    private _logger: LoggerComponent,
  ) {
    super();
  }

  ngOnInit () {
    this.startLoader();
    const statusFilter = {
      'filter': {
        'fields': [
          new FilterRequestField('status', 'active', FilterRequestField.MATCH_EQ),
        ],
      },
      'sorter': {
        'fields': [
          new SortRequestField('title'),
          new SortRequestField('id'),
        ],
      },
      'paginator': {
        'fields': [
          new PaginationLimitRequestField('500'),
          new PaginationOffsetRequestField('0'),
        ],
      },
    };
    this.servicesService.getServices(statusFilter).then(services => {
      this.stopLoader();

      this.services = services;
      this.dataServices = services.map(x => {
        return {
          label: `${x.title}`,
          value: `${x.id}`,
        };
      });

      if (!this.selectedServices.length) {
        // to show placeholder
        this.selectedServices = [];
      }
      this.isLoaded = true;
    }).catch((err) => {
      this.stopLoader();
      this._logger.error(err);
    });
  }

   onChanged(event): void {
     const services = this.services.filter(function (service) {
       return event.value.indexOf(`${service.id}`) !== -1;
     });

     this.chosenServicesChange.emit(services);
   }

   reloadChosenServices(services: Service[]): void {

     // selected services should be in the services list
     services.forEach((service: Service) => {
       const el = {
         label: service.title,
         value: `${service.id}`,
       };
       if (!this.dataServices.find(obj => +obj.value === +service.id)) {
         this.dataServices.push(el);
         this.services.push(service);
       }
     });

     this.chosenServices = services;
     this.selectedServices = this.chosenServices.length ? this.chosenServices.map(x => `${x.id}`) : [];
   }
}
