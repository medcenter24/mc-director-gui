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

import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import 'style-loader!./trafficChart.scss';
import { TrafficChartData } from './trafficChart.data';
import { colorHelper } from '../../../theme';
import { LoadableComponent } from '../../core/components/componentLoader';

@Component({
  selector: 'nga-traffic-chart',
  templateUrl: './trafficChart.html',
  outputs: ['init', 'loaded'],
})

export class TrafficChartComponent extends LoadableComponent implements AfterViewInit {

  protected componentName: string = 'TrafficChartComponent';

  infoData: Object[] = [];
  total: number = 0;
  private transformedData: any;
  private chart: any;

  @ViewChild('canvasChart')
    chartElement: ElementRef<HTMLCanvasElement>;

  @Input() prefix: string = '';
  @Input() set setData(data: TrafficChartData[] ) {
    this.transformedData = this.transformTrafficChartData(data);
    if (this.chart) {
      this.chart.destroy();
    }
  }

  ngAfterViewInit(): void {
    this.chart = this._loadDoughnutCharts(this.transformedData);
  }

  private transformTrafficChartData(data: TrafficChartData[]): Object {
    this.infoData = [];
    this.total = 0;
    data.forEach(row => this.total += +row.casesCount);
    let index = 0;
    const dataForSet = [];
    const backgroundColors = [];
    const backgroundHoverColors = [];
    const labels = [];
    data.forEach(row => {
      index++;
      this.infoData.push({
        value: row.casesCount,
        color: TrafficChartComponent.getColor(index),
        highlight: TrafficChartComponent.getColor(index, 15),
        label: row.name,
        percentage: ((row.casesCount / this.total) * 100).toFixed(2),
      });
      dataForSet.push(row.casesCount);
      backgroundColors.push(TrafficChartComponent.getColor(index));
      backgroundHoverColors.push(TrafficChartComponent.getColor(index, 15));
      labels.push(row.name);
    });
    return {
      datasets: [{
        data: dataForSet,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: backgroundHoverColors,
        borderWidth: 1,
      }],
      labels,
    };
  }

  private static getColor(pp: number, weight: number = 0) {
    const colors = [
      '#005562',
      '#0e8174',
      '#6eba8c',
      '#b9f2a1',
      '#10c4b5',
      '#007500',
      '#009100',
      '#00A600',
      '#00BB00',
      '#00DB00',
      '#00EC00',
      '#28FF28',
      '#53FF53',
      '#79FF79',
      '#93FF93',
      '#A8CD1B',
      '#CBE32D',
      '#F9E814',
      '#F7DD16',
      '#FCE016',
      '#F9D616',
      '#FFC61E',
      '#FCB514',
      '#A6FFA6',
      '#BBFFBB',
      '#CEFFCE',
    ];

    return colorHelper.shade( colors.length > pp ? colors[pp - 1] : '#aaaaaa', weight);
  }

  private _loadDoughnutCharts (data): Chart {
    return new Chart(this.chartElement.nativeElement, {
      type: 'doughnut',
      data,
      options: {
        cutoutPercentage: 64,
        responsive: true,
        legend: {
          display: false,
        },
        tooltips: {
          yAlign: 'bottom',
          position: 'average',
        },
      },
    });
  }
}
