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
import {LoadingComponent} from '../../../../core/components/componentLoader';
import {Searcher} from '../../form/models/searcher';
import {LoggerComponent} from '../../../../core/logger/LoggerComponent';
import {GlobalState} from '../../../../../global.state';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'nga-searcher-filters',
  templateUrl: './searcher.filters.html',
  styleUrls: ['./searcher.filters.scss'],
})
export class SearcherFiltersComponent extends LoadingComponent {
  protected componentName: string = 'SearcherFiltersComponent';

  @Input() searcher: Searcher;

  constructor(
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    protected translateService: TranslateService,
  ) {
    super();
  }
}
