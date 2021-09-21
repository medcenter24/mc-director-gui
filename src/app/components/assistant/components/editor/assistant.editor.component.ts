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

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LoadableComponent } from '../../../core/components/componentLoader';
import { Assistant } from '../../assistant';
import { AssistantsService } from '../../assistant.service';
import { GlobalState } from '../../../../global.state';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'nga-assistant-editor',
  templateUrl: './editor.html',
  outputs: ['init', 'loaded'],
})
export class AssistantEditorComponent extends LoadableComponent {
  protected componentName: string = 'AssistantEditorComponent';

  @Input() assistant: Assistant;
  @Output() assistantSaved: EventEmitter<Assistant> = new EventEmitter<Assistant>();

  constructor(
    private service: AssistantsService,
    private _state: GlobalState,
    private translate: TranslateService,
  ) {
    super();
  }

  onSubmit(): void {
    const postfix = 'Delete';
    this.startLoader(postfix);
    this.service.save(this.assistant).then(() => {
      this.stopLoader(postfix);
      this.assistantSaved.emit(this.assistant);
    }).catch(() => this.stopLoader(postfix));
  }

  onDelete(): void {
    this._state.notifyDataChanged('confirmDialog',
      {
        header: this.translate.instant('Delete'),
        message: this.translate.instant('Are you sure that you want to delete this assistant company?'),
        acceptVisible: true,
        accept: () => {
          const postfix = 'Delete';
          this.startLoader(postfix);
          this.service.destroy(this.assistant)
            .then(() => {
              this.assistantSaved.emit(this.assistant);
              this.assistant = null;
              this.stopLoader(postfix);
            })
            .catch(() => this.stopLoader(postfix));
        },
        icon: 'fa fa-window-close-o red',
      },
    );
  }
}
