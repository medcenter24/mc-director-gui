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
import { LoadableComponent } from '../../../../core/components/componentLoader';
import { AutoCompleteComponent } from '../../../autosuggest';
import { AutoCompleteSrcConfig } from '../../../autosuggest/src';
import { TranslateService } from '@ngx-translate/core';
import { SearchableServiceInterface } from '../../../../core/loadable';
import { SearchFilter } from '../../../../core/loadable/search.filter';

@Component({
  selector: 'nga-autocompleter',
  templateUrl: './autocompleter.html',
})
export class AutocompleterComponent extends LoadableComponent implements OnInit {
  protected componentName: string = 'AutocompleterComponent';

  /**
   * Service to getting data
   */
  @Input() service: SearchableServiceInterface;

  /**
   * Field from the data to use it as a label in selector
   */
  @Input() labelField: string = 'title';

  /**
   * Placeholder for the empty selector
   * @type {string}
   */
  @Input() placeholder: string = '';

  /**
   * Data to show as a selected (should be rewritable to the default state?)
   * @type {any[]}
   */
  @Input() preloadedData: any;

  /**
   * @example
   * 'static' or 'loadable'
   */
  @Input() providerType: string = 'static';

  /**
   * Selected options
   * @type {EventEmitter<any>}
   */
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();

  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Direct access to the child element
   */
  @ViewChild('autocompleter')
    private autocompleter: AutoCompleteComponent;

  langLoaded: boolean = false;
  autoCompleteConfig: AutoCompleteSrcConfig;

  constructor (
    protected translateService: TranslateService,
  ) {
    super();
  }

  ngOnInit() {
    this.translateService.get('Yes').subscribe(() => {
      this.langLoaded = true;
      this.autoCompleteConfig = AutoCompleteSrcConfig.instance({
        dataProvider: (filters: SearchFilter) => {
          return this.service.search(filters);
        },
        fieldKey: this.labelField,
        preloaded: this.preloadedData,
        placeholder: this.translateService.instant(this.placeholder),
        provider: this.providerType,
      });
    });
  }

  selectItems(items: Object|Object[], fieldName: string = null): void {
    if (this.autocompleter) {
      this.autocompleter.selectItems(items, fieldName);
    }
  }

  onChanged(event): void {
    this.selected.emit(event);
  }
}
