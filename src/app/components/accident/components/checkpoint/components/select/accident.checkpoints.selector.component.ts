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
import { AccidentCheckpoint } from '../../checkpoint';
import { AccidentCheckpointsService } from '../../checkpoints.service';
import { LoadableComponent } from '../../../../../core/components/componentLoader';

@Component({
  selector: 'nga-checkpoints-selector',
  templateUrl: './select.html',
})
export class AccidentCheckpointsSelectorComponent extends LoadableComponent implements OnInit {

  @Input() selectedCheckpoints: number[] = [];
  @Output() change: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  checkpoints: AccidentCheckpoint[] = [];
  isLoaded: boolean = false;

  protected componentName: string = 'AccidentCheckpointsSelectorComponent';

  constructor (private accidentCheckpointsService: AccidentCheckpointsService) { super(); }

  ngOnInit () {
    this.startLoader();
    this.isLoaded = false;
    const obs = this.accidentCheckpointsService.search([]);
    obs.subscribe(response => {
      this.stopLoader();
      this.checkpoints = response.data as AccidentCheckpoint[];
      this.isLoaded = true;
    });
    obs.subscribe({error: this.stopLoader});
  }

  onChange(): void {
    this.change.emit(this.selectedCheckpoints);
  }
}
