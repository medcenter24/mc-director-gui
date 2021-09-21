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

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LoadableComponent } from '../../../core/components/componentLoader';
import { Accident } from '../../accident';
import { CasesService } from '../../../case/cases.service';
import { Commentary } from '../../../comment/commentary';
import { CommentsComponent } from '../../../comment/components/comments.component';
import { DateHelper } from '../../../../helpers/date.helper';

@Component({
  selector: 'nga-accident-chat',
  templateUrl: './chat.html',
  outputs: ['init', 'loaded'],
})
export class AccidentChatComponent extends LoadableComponent implements OnInit {

  protected componentName: string = 'AccidentChatComponent';

  @Input() accident: Accident;

  @ViewChild('commentariesComponent')
    private commentariesComponent: CommentsComponent;

  comments: Commentary[] = [];

  constructor(private caseService: CasesService, private dateHelper: DateHelper) {
    super();
  }

  ngOnInit() {
    this.startLoader();
    this.caseService.getCommentaries(this.accident).then(response => {
      this.stopLoader();
      response.map((row) => {
        row.createdAt = DateHelper.toEuropeFormatWithTime(row.createdAt);
        return row;
      });
      this.comments = response;
    }).catch(() => this.stopLoader());
  }

  createCommentary(text: string) {
    const actName = 'CreateComment';
    this.startLoader(actName);
    this.caseService.createComment(this.accident, text).then(comment => {
      this.stopLoader(actName);
      this.commentariesComponent.applyComment(comment);
    }).catch(() => this.stopLoader(actName));
  }
}
