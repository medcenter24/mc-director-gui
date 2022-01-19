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

import { Injectable } from '@angular/core';
import { TrafficChartData } from './trafficChart/trafficChart.data';
import { HttpService } from '../core/http/http.service';
import { YearsList } from './years/yearsList';
import {Observable} from 'rxjs';

@Injectable()
export class StatisticsService extends HttpService {

  protected getPrefix (): string {
    return 'director/statistics';
  }

  /**
   * Loading doctors statistics
   * @returns {Observable<any>}
   */
  loadDoctorsTraffic(year: string = ''): Observable<TrafficChartData[]> {
    const obs = this.get('doctorsTraffic', { year });
    let s;
    const obsTransformed = new Observable<TrafficChartData[]>(subscriber => s = subscriber);
    obs.subscribe(response => {
      if (response && response.data) {
        s.next(response.data as TrafficChartData[]);
      }
    });
    return obsTransformed;
  }

  /**
   * Loading assistants stats
   * @param year
   */
  loadAssistantsTraffic(year: string = ''): Observable<TrafficChartData[]> {
    const obs = this.get('assistantsTraffic', { year });
    let s;
    const obsTransformed = new Observable<TrafficChartData[]>(subscriber => s = subscriber);
    obs.subscribe(response => s.next(response.data as TrafficChartData[]));
    return obsTransformed;
  }

  /**
   * Loading valid years
   */
  loadYears(): Observable<YearsList[]> {
    const obs = this.get('years');
    let s;
    const obsTransformed = new Observable<YearsList[]>(subscriber => s = subscriber);
    obs.subscribe(response => s.next(response.data as YearsList[]));
    return obsTransformed;
  }
}
