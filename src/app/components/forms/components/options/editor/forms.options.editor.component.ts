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
import { TranslateService } from '@ngx-translate/core';
import { FormOption } from '../form.option';
import { FormOptionService } from '../form.option.service';

@Component({
  selector: 'nga-forms-options-editor',
  templateUrl: './forms.options.editor.html',
})
export class FormsOptionsEditorComponent implements OnInit {

  /**
   * Type which determine possible parameters
   * @type {string}
   */
  @Input() formableType: string = '';

  /**
   * Variables that I can mark as used in template
   */
  usedVars: FormOption[] = [];

  /**
   * Selected parameter
   * @type {EventEmitter<string>}
   */
  @Output() selected: EventEmitter<FormOption> = new EventEmitter<FormOption>();

  /**
   * All parameters for the current form
   */
  @Output() formOptionsLoaded: EventEmitter<FormOption[]> = new EventEmitter<FormOption[]>();

  parameters: FormOption[] = [];

  constructor(
    public translateService: TranslateService,
    private formOptionService: FormOptionService,
  ) {}

  ngOnInit(): void {
    this.formOptionService.getOptions('accident')
      .subscribe(data => {
        this.parameters = data;
        this.formOptionsLoaded.emit(this.parameters);
      });
  }

  // do not allow to change variables because they could be used in template
  onAddParameter(param: FormOption): void {
    this.selected.emit(param);
  }

  updateUsedVars(vars: FormOption[]): void {
    this.usedVars = vars;
  }
}
