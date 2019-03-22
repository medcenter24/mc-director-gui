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
import { LoadableComponent } from '../../../../../core/components/componentLoader/LoadableComponent';

@Component({
  selector: 'nga-checkpoints-selector',
  templateUrl: './select.html',
})
export class AccidentCheckpointsSelectorComponent extends LoadableComponent implements OnInit {

  @Input() selectedCheckpoints: number[] = [];
  @Output() change: EventEmitter<number[]> = new EventEmitter<number[]>();

  checkpoints: AccidentCheckpoint[] = [];
  isLoaded: boolean = false;

  protected componentName: string = 'AccidentCheckpointsSelectorComponent';

  constructor (private accidentCheckpointsService: AccidentCheckpointsService) { super(); }

  ngOnInit () {
    this.startLoader();
    this.isLoaded = false;
    this.accidentCheckpointsService.getCheckpoints().then(checkpoints => {
      this.stopLoader();
      this.checkpoints = checkpoints;
      this.isLoaded = true;
    }).catch(() => this.stopLoader());
  }

  onChange(): void {
    this.change.emit(this.selectedCheckpoints);
  }
}
