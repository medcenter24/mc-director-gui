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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { DashboardPageComponent } from './dashboard.page.component';
import { routing } from './dashboard.page.routing';
import { PopularAppComponent } from './popularApp';
import { PieChart } from './pieChart';
import { Feed } from './feed';
import { Todo } from './todo';
import { CalendarComponent } from './calendar';
import { CalendarService } from './calendar/calendar.service';
import { FeedService } from './feed/feed.service';
import { PieChartService } from './pieChart/pieChart.service';
import { TodoService } from './todo/todo.service';
import { AppTranslationModule } from '../../app.translation.module';
import { StatusColorMapService } from '../../components/accident/components/status';
import { TrafficChartComponent } from '../../components/statistics/trafficChart';
import { StatisticsService } from '../../components/statistics/statistics.service';
import { UiDateYearDropdownModule } from '../../components/ui/date/year/dropdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    AppTranslationModule,
    UiDateYearDropdownModule,
  ],
  declarations: [
    PopularAppComponent,
    PieChart,
    TrafficChartComponent,
    Feed,
    Todo,
    CalendarComponent,
    DashboardPageComponent,
  ],
  providers: [
    CalendarService,
    FeedService,
    PieChartService,
    TodoService,
    StatusColorMapService,
    StatisticsService,
  ],
})
export class DashboardPageModule {}
