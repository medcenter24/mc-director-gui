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

import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {
  AutoCompleteLoadableProvider,
  AutoCompleteSrcConfig,
  AutoCompleteStaticProvider,
} from './src';

@Component({
  selector: 'nga-auto-complete',
  templateUrl: './auto.complete.html',
})
export class AutoCompleteComponent {

  selected: Object = {};

  /**
   * Data Provider for the auto completer
   */
  provider: AutoCompleteStaticProvider | AutoCompleteLoadableProvider;

  /**
   * Configuration
   */
  conf: AutoCompleteSrcConfig;

  @Input() set config(conf: AutoCompleteSrcConfig) {
    // init conf
    this.conf = conf;
    // reload data provider
    this.provider = conf.provider === 'static'
      ? new AutoCompleteStaticProvider(conf, this._changeDetectionRef)
      : new AutoCompleteLoadableProvider(conf);
    if (this.provider.selected) {
      this.selected = this.provider.selected;
    }
  }

  @Output() changed: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
  ) {}

  onSelect (): void {
    this.provider.selected = this.selected;
    this.changed.emit(this.selected);
  }

  selectItems(items: any, fieldName: string = null): void {
    this.provider.selectItems(items, fieldName).subscribe(res => this.selected = res);
  }
}
