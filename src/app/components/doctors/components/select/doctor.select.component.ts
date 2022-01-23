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

import { Component, EventEmitter, Output } from '@angular/core';
import { DoctorsService } from '../../doctors.service';
import { AbstractAutoCompleteController } from '../../../ui/autocompleter';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'nga-select-doctor',
  templateUrl: '../../../ui/autocompleter/autocompleter.tpl.html',
})
export class DoctorSelectComponent extends AbstractAutoCompleteController {
  protected componentName: string = 'DoctorSelectComponent';

  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private service: DoctorsService,
    protected translateService: TranslateService,
  ) {
    super(translateService);
  }

  getService() {
    return this.service;
  }

  getFieldKey(): string {
    return 'name';
  }
}
