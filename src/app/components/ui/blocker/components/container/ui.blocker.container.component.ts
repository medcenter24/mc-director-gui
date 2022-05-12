/*
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2022 (original work) MedCenter24.com;
 */

import { Component, Input } from "@angular/core";

@Component({
  selector: 'nga-blocker',
  template: `
    <ng-container *ngIf="blocked">
      <div class="ui-blocker">
        <i class="fa fa-lock fa-5x" style="position: absolute; top: 50%; left: 50%;"></i>
      </div>
    </ng-container>
  `,
  styleUrls: ['./ui.blocker.scss'],
})
export class UiBlockerContainerComponent {

  @Input() blocked: boolean = false;

  constructor (
  ) {
  }
}
