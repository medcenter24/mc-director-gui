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
 * Copyright (c) 2022 (original work) MedCenter24.com;
 */

import {Component, Input} from '@angular/core';
import {LoadingComponent} from '../../../core/components/componentLoader';
import {LoggerComponent} from '../../../core/logger/LoggerComponent';
import {GlobalState} from '../../../../global.state';
import {TranslateService} from '@ngx-translate/core';
import {SearchResult} from '../form/models/search.result';
import {SearchFields} from '../form/models/search.fields';

@Component({
  selector: 'nga-search-result',
  templateUrl: './search.result.html',
})
export class SearchResultComponent extends LoadingComponent {
  protected componentName: string = 'SearchResultComponent';

  @Input() set resultData(result: SearchResult) {
    this.setResultData(result);
  }

  result: SearchResult = null;

  constructor(
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    protected translateService: TranslateService,
    public searchFields: SearchFields,
  ) {
    super();
  }

  private setResultData(result: SearchResult) {
    this.result = result;
  }
}
