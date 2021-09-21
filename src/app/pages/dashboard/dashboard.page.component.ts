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

import { Component, OnInit } from '@angular/core';
import { TrafficChartData } from '../../components/statistics/trafficChart/trafficChart.data';
import { LoadingComponent } from '../../components/core/components/componentLoader';
import { StatisticsService } from '../../components/statistics/statistics.service';
import { GlobalState } from '../../global.state';
import { LoggerComponent } from '../../components/core/logger/LoggerComponent';
import { YearsList } from '../../components/statistics/years/yearsList';
import { TranslateService } from '@ngx-translate/core';
import { Breadcrumb } from '../../theme/components/baContentTop/breadcrumb';

@Component({
  selector: 'nga-dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html',
})
export class DashboardPageComponent extends LoadingComponent implements OnInit {

  protected componentName: string = 'DashboardComponent';

  doctorActivities: TrafficChartData[] = [];
  assistantActivities: TrafficChartData[] = [];
  years: any[] = [];
  currentDocYear: string = '';
  currentAssistYear: string = '';

  /**
   * if we need to hide all dashboard items
   * for example on the first loading
   * @type {boolean}
   */
  hidden: boolean = true;

  constructor(
    private _statService: StatisticsService,
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    private translateService: TranslateService,
  ) {
    super();
    this.translateService.get('Dashboard').subscribe((text: string) => {
      this._state.notifyDataChanged('changeTitle', text);
    });
  }

  ngOnInit(): void {
    this.translateService.get('Dashboard').subscribe((trans) => {
      const breadcrumbs = [];
      const title = trans;
      breadcrumbs.push(new Breadcrumb(title, '/pages/dashboard', true));
      this._state.notifyDataChanged('menu.activeLink', breadcrumbs);
      this._state.notifyDataChanged('changeTitle', title);
    });

    const year = `${(new Date()).getFullYear()}`;
    this.currentDocYear = year;
    this.currentAssistYear = year;
    this.loadDoctorsTraffic();
    this.loadAssistantTraffic();
    this.loadActiveYears();
  }

  protected onComponentsLoadingCompleted(): void {
    this.hidden = false;
  }

  private loadDoctorsTraffic(): void {
    const loadingName = 'LoadingDoctorsTraffic';
    this.startLoader(loadingName);
    this._statService.loadDoctorsTraffic(this.currentDocYear).then(
      (trafficData: TrafficChartData[]) => {
        this.stopLoader(loadingName);
        this.doctorActivities = trafficData;
      }).catch(() => this.stopLoader(loadingName));
  }

  private loadAssistantTraffic(): void {
    const loadingName = 'LoadingAssistantsTraffic';
    this.startLoader(loadingName);
    this._statService.loadAssistantsTraffic(this.currentAssistYear).then(
      (trafficData: TrafficChartData[]) => {
        this.stopLoader(loadingName);
        this.assistantActivities = trafficData;
      }).catch(() => this.stopLoader(loadingName));
  }

  private loadActiveYears(): void {
    const loadingName = 'LoadingYears';
    this.startLoader( loadingName );
    this._statService.loadYears()
      .then(
        ( years: YearsList[] ) => {
          this.stopLoader( loadingName );
          years.forEach((y: YearsList) => this.years.push({ label: y.year, value: y.year }));
        } )
      .catch( () => this.stopLoader( loadingName ) );
  }

  onDoctorYearChanged(year: string): void {
    this.currentDocYear = year;
    this.loadDoctorsTraffic();
  }

  onAssistYearChanged(year: string): void {
    this.currentAssistYear = year;
    this.loadAssistantTraffic();
  }
}
