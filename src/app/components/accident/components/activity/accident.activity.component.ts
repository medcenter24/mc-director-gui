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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadableComponent } from '../../../core/components/componentLoader';
import { Accident } from '../../accident';

@Component({
  selector: 'nga-accident-activity',
  templateUrl: './activity.html',
  styleUrls: ['./activity.scss'],
})
export class AccidentActivityComponent extends LoadableComponent implements OnInit {

  protected componentName: string = 'CaseActivityComponent';

  @Input() accident: Accident;
  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  selectedTab = null;
  tabs: any[] = [
    { id: 1, name: 'Comments' },
    { id: 2, name: 'History' },
  ];

  constructor () {
    super();
  }

  ngOnInit () {
    this.selectedTab = this.tabs[0];
  }

  selectTab(tab: any): void {
    let id = 0;
    if (typeof tab === 'number' && tab >= 0) {
      this.selectedTab = this.tabs[tab];
      id = tab;
    } else
      if (typeof tab === 'object') {
        const pos = this.tabs.findIndex(x => x.id === tab.id);
        if (pos) {
          id = pos;
        }
      }
    this.selectedTab = this.tabs[id];
  }
}
