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

import {Component, OnInit} from '@angular/core';
import {LoadingComponent} from '../../components/core/components/componentLoader';
import {StatisticsService} from '../../components/statistics/statistics.service';
import {LoggerComponent} from '../../components/core/logger/LoggerComponent';
import {GlobalState} from '../../global.state';
import {TranslateService} from '@ngx-translate/core';
import {Breadcrumb} from '../../theme/components/baContentTop/breadcrumb';
import {ActivatedRoute, Params} from '@angular/router';
import {Location} from '@angular/common';
import {UrlHelper} from '../../helpers/url.helper';
import {ObjectHelper} from '../../helpers/object.helper';

@Component({
  selector: 'nga-search',
  templateUrl: './search.html',
  styleUrls: ['./search.scss'],
})
export class SearchPageComponent extends LoadingComponent implements OnInit {
  protected componentName: string = 'SearchPageComponent';

  query: string = '';
  selectedColumns: Array<string> = [];

  constructor(
    private _statService: StatisticsService,
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    super();
    this.translateService.get('Search').subscribe((text: string) => {
      this._state.notifyDataChanged('changeTitle', text);
      const breadcrumbs = [];
      breadcrumbs.push(new Breadcrumb(text, '/pages/search', true));
      this._state.notifyDataChanged('menu.activeLink', breadcrumbs);
    });
  }

  ngOnInit(): void {
    const url = this.location.path(true);
    UrlHelper.getQueryVariables(url).forEach(obj => {
      ObjectHelper.eachProp(obj, key => {
        if (key === 'q' && obj[key].length) {
          this.query = obj[key];
        }
      });
    });
  }

  onSearch() {
    console.log('search', this.query);
  }
}
