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
import { TranslateService } from '@ngx-translate/core';
import { SelectorConfig } from '../../selector.config';
import { SearchableServiceInterface } from '../../../../core/loadable';
import { SelectorProviderMultipleComponent } from '../../provider/multiple';

@Component({
  selector: 'nga-multi-selector',
  templateUrl: './multi.selector.html',
  outputs: ['init', 'loaded'],
})
export class MultiSelectorComponent extends LoadableComponent implements OnInit {
  protected componentName: string = 'MultiSelectorComponent';

  langLoaded: boolean = false;
  config: SelectorConfig;

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
   * Data to show as a selected (should be revertable to the default state?)
   * @type {any[]}
   */
  @Input() preloadedData: any;

  /**
   * Event on cities changed
   * @type {EventEmitter<any>}
   */
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Selector provider component ref
   */
  @ViewChild('selectorComponent')
    selectorComponent: SelectorProviderMultipleComponent;

  constructor (
    protected translateService: TranslateService,
  ) {
    super();
  }

  /**
   * Action on data selected
   * @param event
   * @returns {any[]}
   */
  onSelected(event): void {
    return this.selected.emit(event);
  }

  /**
   * Initialize after the component loading
   */
  ngOnInit() {
    this.translateService.get('Yes').subscribe(() => {
      this.langLoaded = true;
      this.config = SelectorConfig.instance({
        dataProvider: this.service,
        labelField: this.labelField,
        placeholder: this.translateService.instant(this.placeholder),
        preloaded: this.preloadedData,
      });
    });
  }

  /** rewritten to add some unique parameters */
  startLoader(postfix: string = ''): void {
    this.init.emit(`_${this.componentName}${postfix}_${this.getUniquePostfix()}`);
  }

  /** rewritten to add some unique parameters */
  stopLoader(postfix: string = ''): void {
    this.loaded.emit(`_${this.componentName}${postfix}_${this.getUniquePostfix()}`);
  }

  private getUniquePostfix(): string {
    return this.placeholder.toLowerCase().replace(' ', '');
  }

  selectItems(items: any): void {
    this.selectorComponent.selectItems(items);
  }
}
