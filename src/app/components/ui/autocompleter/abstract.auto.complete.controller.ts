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

import { EventEmitter, Injectable, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoadableComponent } from '../../core/components/componentLoader';
import { AutoCompleteSrcConfig } from '../autosuggest/src';
import { AutoCompleteComponent } from '../autosuggest';

// template can't be inherited so it has no sense to declare abstract Component
@Injectable()
export abstract class AbstractAutoCompleteController extends LoadableComponent implements OnInit {

  preloaded: Object[]|Object = [];
  @Input()
    set selectPreloaded(preloaded: Object|Object[]) {
      // we need to use both - if hasn't loaded yet - use config otherwise use component updater
      this.preloaded = preloaded;
      this.selectItems(this.preloaded);
    }

  @Output() selected: EventEmitter<Object> = new EventEmitter<Object>();

  @ViewChild('autocompleter')
    autocompleter: AutoCompleteComponent;

  langLoaded: boolean = false;
  autoCompleteConfig: AutoCompleteSrcConfig;

  protected constructor (
    protected translateService: TranslateService,
  ) {
    super();
  }

  /**
   * Get model's data provider
   */
  abstract getService();

  /**
   * Key of the field to show in the selector
   * @returns {string}
   */
  abstract getFieldKey(): string;

  /**
   * Default state for the auto completer
   * If defined then reset should use this value as default for the completer
   * and empty needs to make it blank
   * @returns {any}
   */
  getPreloadedData(): any {
    return this.preloaded;
  }

  /**
   * Can be 'loadable' if autocompleter can manage a lot of data
   */
  protected getProviderType(): string {
    return 'static';
  }

  ngOnInit() {
    this.translateService.get('Yes').subscribe(() => {
      this.langLoaded = true;
      this.autoCompleteConfig = AutoCompleteSrcConfig.instance({
        dataProvider: (filters: Object) => {
          return this.getService().search(filters);
        },
        fieldKey: this.getFieldKey(),
        preloaded: this.getPreloadedData(),
        provider: this.getProviderType(),
      });
    });
  }

  selectItems(items: any): void {
    if (this.autocompleter) {
      this.autocompleter.selectItems(items);
    }
  }

  onChanged(event): void {
    this.selected.emit(event);
  }
}
