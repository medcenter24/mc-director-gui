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

import { Component, Input, OnInit } from '@angular/core';
import { LoadableComponent } from '../../../../core/components/componentLoader';
import { Accident } from '../../../accident';
import { CasesService } from '../../../../case/cases.service';
import { AccidentHistory } from '../history';
import { DateHelper } from '../../../../../helpers/date.helper';
import { layoutPaths } from '../../../../../theme';

@Component({
  selector: 'nga-accident-history',
  templateUrl: './history.html',
  outputs: ['init', 'loaded'],
})
export class AccidentHistoryComponent extends LoadableComponent implements OnInit {

  protected componentName: string = 'AccidentHistoryComponent';

  @Input() accident: Accident;

  history: AccidentHistory[];
  noPhoto: string = '';

  constructor(private caseService: CasesService) {
    super();
    this.noPhoto = `${layoutPaths.images.profile}no-photo.png`;
  }

  ngOnInit() {
    this.startLoader();
    this.caseService.getHistory(this.accident).then(response => {
      this.stopLoader();
      response.map((row) => {
        row.createdFormatted = DateHelper.toEuropeFormatWithTime(row.createdAt);
        return row;
      });
      this.history = response;
    }).catch(() => this.stopLoader());
  }
}
