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

import {Component} from '@angular/core';
import {LoadingComponent} from '../../components/core/components/componentLoader';
import {StatisticsService} from '../../components/statistics/statistics.service';
import {LoggerComponent} from '../../components/core/logger/LoggerComponent';
import {GlobalState} from '../../global.state';
import {TranslateService} from '@ngx-translate/core';
import {Breadcrumb} from '../../theme/components/baContentTop/breadcrumb';
import {SearchResult} from '../../components/search/components/form/models/search.result';

@Component({
  selector: 'nga-search',
  templateUrl: './search.html',
  styleUrls: ['./search.scss'],
})
export class SearchPageComponent extends LoadingComponent {
  protected componentName: string = 'SearchPageComponent';

  public result: SearchResult = null;

  constructor(
    private _statService: StatisticsService,
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    private translateService: TranslateService,
  ) {
    super();
    this.translateService.get('Search').subscribe((text: string) => {
      this._state.notifyDataChanged('changeTitle', text);
      const breadcrumbs = [];
      breadcrumbs.push(new Breadcrumb(text, '/pages/search', true));
      this._state.notifyDataChanged('menu.activeLink', breadcrumbs);
    });
  }

  onFound(searchResult: SearchResult): void {
    this.result = searchResult;
  }
}
