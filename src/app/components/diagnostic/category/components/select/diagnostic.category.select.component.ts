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

import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AbstractAutoCompleteController } from '../../../../ui/autocompleter';
import { DiagnosticCategoryService } from '../../category.service';

@Component({
  selector: 'nga-diagnostic-category-select',
  templateUrl: '../../../../ui/autocompleter/autocompleter.tpl.html',
})
export class DiagnosticCategorySelectComponent extends AbstractAutoCompleteController {
  protected componentName: string = 'DiagnosticCategorySelectComponent';

  constructor(
    private service: DiagnosticCategoryService,
    protected translateService: TranslateService,
  ) {
    super(translateService);
  }

  getService() {
    return this.service;
  }

  getFieldKey(): string {
    return 'title';
  }
}
