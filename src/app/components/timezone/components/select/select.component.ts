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
import { LoadableComponent } from '../../../core/components/componentLoader';
import { TimezoneService } from '../../timezone.service';

@Component({
  selector: 'nga-select-timezone',
  templateUrl: './select.html',
})
export class TimezoneSelectComponent extends LoadableComponent implements OnInit {

  @Input() timezone: string;
  @Output() change: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  timezones: string[] = [];
  filteredTimezones: string[] = [];
  protected componentName: string = 'TimezoneSelectComponent';

  constructor (
    private timezoneService: TimezoneService,
  ) {
    super();
  }

  ngOnInit () {
    this.timezones = this.timezoneService.getTimezones();
  }

  filterTimezones (event): void {
    this.filteredTimezones = [];
    for (const tz of this.timezones) {
      if (tz.toLowerCase().indexOf(event.query.toLowerCase()) !== -1) {
        this.filteredTimezones.push(tz);
      }
    }
  }

  onChanged(event): void {
    this.change.emit(event);
  }
}
