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

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { LoadableComponent } from '../../../../../core/components/componentLoader';
import { AccidentScenario } from '../../scenario';
import 'style-loader!./line.scss';
import { CasesService } from '../../../../../case/cases.service';
import { LoggerComponent } from '../../../../../core/logger/LoggerComponent';

@Component({
  selector: 'nga-accident-scenario',
  templateUrl: './line.html',
  encapsulation: ViewEncapsulation.None,
  outputs: ['init', 'loaded'],
})
export class AccidentScenarioLineComponent extends LoadableComponent implements OnInit {

  @Input() accidentId: number = 0;

  isLoaded: boolean = false;
  steps: AccidentScenario[] = [];

  protected componentName: string = 'AccidentScenarioComponent';

  constructor (private caseService: CasesService,
               private _logger: LoggerComponent) {
    super();
  }

  ngOnInit () {
    this.reload();
  }

  /**
   * Quick reload for the save method or update
   */
  reload(): void {
    this.startLoader();
    this.caseService.getScenario(this.accidentId).then((scenario: AccidentScenario[]) => {
      this.stopLoader();
      this.steps = scenario;
      this.isLoaded = true;
    }).catch((err) => {
      this.stopLoader();
      this._logger.error(err);
    });
  }
}
