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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CalendarService } from './calendar.service';
import { TranslateService } from '@ngx-translate/core';
import { StatusColorMapService } from '../../../components/accident/components/status';
import ruLocale from '@fullcalendar/core/locales/ru';
import enLocale from '@fullcalendar/core/locales/en-gb';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'nga-calendar',
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class CalendarComponent implements OnInit {

  calendarConfiguration: any = false;
  private _calendar: Object;
  private eventsTimerId: any = false;

  constructor(
    private _calendarService: CalendarService,
    private _translateService: TranslateService,
    private _statusColorService: StatusColorMapService,
    ) {
  }

  ngOnInit() {
    let statistics = [];

    this._translateService.get('Today').subscribe(() => {
      this.calendarConfiguration = {
        headerToolbar: {
          left: 'prevYear,prev,next,nextYear today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        },
        locales: [enLocale, ruLocale, esLocale],
        locale: this._translateService.currentLang,
        initialDate: new Date(),
        selectable: true,
        selectMirror: true,
        editable: false,
        dayMaxEventRows: 1,
        eventTimeFormat: { hour12: false, hour: '2-digit', minute: '2-digit' },
        events: (params, callback) => {
          // prevent loading of the results too many times
          if (this.eventsTimerId) {
            clearTimeout(this.eventsTimerId);
          }

          this.eventsTimerId = setTimeout(() => {
            this._calendarService
              .loadEvents(params.startStr, params.endStr)
              .subscribe(events => {
                statistics = [];
                this.eventsTimerId = false;
                callback(events);
              });
          }, 1000);
        },
        eventDataTransform: (event) => {
          return {
            id: event.id,
            title: event.title,
            allDay: false,
            start: event.start,
            end: event.end,
            editable: false,
            color: this._statusColorService.getColorByStatus(event.statusTitle),
            status: event.status,
            textColor: '#fff',
          };
        },
      };
    });
  }

  onCalendarReady(calendar): void {
    this._calendar = calendar;
  }
}
