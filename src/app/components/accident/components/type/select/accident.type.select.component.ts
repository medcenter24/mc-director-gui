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

import { Component, Output, EventEmitter, Input } from '@angular/core';
import { AccidentType } from '../type';
import { AccidentTypesService } from '../types.service';
import { TranslateService } from '@ngx-translate/core';
import { LoadableComponent } from '../../../../core/components/componentLoader';

@Component({
  selector: 'nga-select-accident-type',
  templateUrl: './accident.type.select.html',
  outputs: ['init', 'loaded'],
})
export class AccidentTypeSelectComponent extends LoadableComponent {

  @Input() set typeId(id: number) {
    this.selectType(id);
  }
  @Output() selected: EventEmitter<AccidentType> = new EventEmitter<AccidentType>();

  isLoaded: boolean = false;
  selectedType: AccidentType = new AccidentType();
  loadedTypes: AccidentType[] = [];
  protected componentName: string = 'SelectAccidentTypeComponent';

  constructor (
    private accidentTypesService: AccidentTypesService,
    private translate: TranslateService,
  ) {
    super();
  }

  private selectType(id: number): void {
    this.translate.get('Insurance').subscribe(() => {
      const postfix = 'Select';
      this.startLoader(postfix);
      this.accidentTypesService.getTypes().then((types: AccidentType[]) => {
        this.stopLoader(postfix);
        this.loadedTypes = types;
        this.loadedTypes.map((v: AccidentType, i: number) => {
          v.trTitle = this.translate.instant(`${v.title} case`);
          if (!i || +v.id === +id) {
            this.selectedType = v;
            this.onChanged();
          }
        });
        const filtered = this.loadedTypes.filter(value => value.id === id);
        if (filtered.length) {
          this.selectedType = filtered.pop();
          this.onChanged();
        }
        this.isLoaded = true;
      }).catch(() => this.stopLoader(postfix));
    });
  }

  onChanged(): void {
    this.selected.emit(this.selectedType);
  }
}
