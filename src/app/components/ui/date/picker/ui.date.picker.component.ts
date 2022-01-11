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
 * Copyright (c) 2020 (original work) MedCenter24.com;
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { Russian } from 'flatpickr/dist/l10n/ru';
import { TranslateService } from '@ngx-translate/core';
import { Spanish } from 'flatpickr/dist/l10n/es';
import { ObjectHelper } from '../../../../helpers/object.helper';
import { DateHelper } from '../../../../helpers/date.helper';

@Component({
  selector: 'nga-ui-date-picker',
  template: `
    <div class="p-inputgroup">
      <ng2-flatpickr
        *ngIf="initialized"
        [config]="datePickerOptions"
        [(ngModel)]="pickedDate"
        pInputText></ng2-flatpickr>
      <button pButton type="button" icon="pi pi-search" class="p-button-warn" (click)="onSearch()"></button>
    </div>
  `,
})
export class UiDatePickerComponent {
  visible: boolean = false;
  datePickerOptions: FlatpickrOptions = {
    dateFormat: DateHelper.defaultFormat,
  };
  pickedDate: any;
  initialized: boolean = false;

  @Input() set value(val: string) {
    if (val && val.length) {
      const dates = [];
      let defaultDate: Date | string = '';
      if (val.includes( '>' )) {
        val.split( '>' ).forEach( ( sDate: string, k: number ) => {
          dates.push( DateHelper.getDate( sDate ) );
          defaultDate += k ? ' — ' : '';
          defaultDate += DateHelper.toEuropeFormat( sDate );
        } );
      } else {
        const dt = DateHelper.getDate( val );
        dates.push( dt );
        defaultDate = dt;
      }
      if (defaultDate) {
        this.datePickerOptions[ 'defaultDate' ] = defaultDate;
      }
      this.pickedDate = dates;
    }
    this.initialized = true;
  }

  @Input() set config(datePickerConf: Object) {
    ObjectHelper.eachProp(datePickerConf, (prop) => {
      this.datePickerOptions[prop] = datePickerConf[prop];
    });
  }

  @Output() changed: EventEmitter<string> = new EventEmitter<string>();

  constructor (
    private translateService: TranslateService,
  ) {
    const lang = translateService.currentLang ? translateService.currentLang : translateService.getDefaultLang();
    switch (lang) {
      case 'ru':
        this.datePickerOptions.locale = Russian;
        break;
      case 'es':
        this.datePickerOptions.locale = Spanish;
        break;
      default:
        this.datePickerOptions.locale = null;
    }
  }

  onSearch(): void {
    let val = '';
    if (this.pickedDate && this.pickedDate.length) {
      val = DateHelper.getUnixDate( this.pickedDate[ 0 ] );
      if (this.pickedDate.length > 1) {
        const to = DateHelper.getUnixDate( this.pickedDate[ 1 ] );
        val += `>${to}`;
      }
    }
    this.changed.emit(val);
  }
}
