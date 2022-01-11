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
import { TranslateService } from '@ngx-translate/core';
import { LoadableComponent } from '../../../core/components/componentLoader';

@Component({
  selector: 'nga-ui-status-select',
  template: `<p-dropdown *ngIf="statuses.length" [options]="statuses"
                        [(ngModel)]="status"
                        [placeholder]="'Status' | translate"
                        appendTo="body"
                        (onChange)="onChange($event)"
      ></p-dropdown>`,
})
export class UiStatusSelectComponent extends LoadableComponent implements OnInit {

  protected componentName: string = 'UiStatusSelectComponent';

  @Input() status: string = 'new';
  @Output() selected: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  statuses: any[] = [];

  constructor(
    public translateService: TranslateService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.startLoader();
    this.translateService.get('Yes').subscribe(() => {
      this.stopLoader();
      this.statuses = [
        { label: this.translateService.instant('New'), value: 'new' },
        { label: this.translateService.instant('Sent'), value: 'sent' },
        { label: this.translateService.instant('Paid'), value: 'paid' },
      ];
    });
  }

  onChange(event): void {
    this.selected.emit(event.value);
  }

}

