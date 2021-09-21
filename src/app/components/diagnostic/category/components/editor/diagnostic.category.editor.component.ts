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

import { Component, Input, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { DiagnosticCategory } from '../../category';
import { DiagnosticCategoryService } from '../../category.service';
import { LoadableComponent } from '../../../../core/components/componentLoader';
import { AutocompleterComponent } from '../../../../ui/selector/components/autocompleter';

@Component({
  selector: 'nga-diagnostic-category-editor',
  templateUrl: './diagnostic.category.editor.html',
  outputs: ['init', 'loaded'],
})
export class DiagnosticCategoryEditorComponent extends LoadableComponent implements AfterViewInit {
  protected componentName: string = 'DiagnosticCategoryEditorComponent';

  category: DiagnosticCategory = new DiagnosticCategory();

  @Input()
    set categoryId (id: number) {
      this.loadCategoryById(id);
    }

  @Output() updated: EventEmitter<DiagnosticCategory> = new EventEmitter<DiagnosticCategory>();

  @ViewChild('diagnosticCategoryAutoCompleter')
    private categorySelectComponent: AutocompleterComponent;

  ngAfterViewInit () {
    this.selectCategory(this.category);
  }

  constructor (
    private service: DiagnosticCategoryService,
    public diagnosticCategoryService: DiagnosticCategoryService,
  ) {
    super();
  }

  selectCategory(category: DiagnosticCategory): void {
    if (category.id) {
      this.categorySelectComponent.selectItems(category.id);
    }
  }

  onSubmit (): void {
    const postfix = 'SaveDiagnosticCategory';
    this.startLoader(postfix);
    this.service.save(this.category).then((category: DiagnosticCategory) => {
      this.stopLoader(postfix);
      this.category = category;
      this.updated.emit(category);
    }).catch(() => this.stopLoader(postfix));
  }

  onCategoryChange (categoryId): void {
    if (this.category.id !== categoryId) {
      this.loadCategoryById(categoryId);
    }
  }

  onCreateCategory (): void {
    this.setEmptyCategory();
  }

  private setEmptyCategory (): void {
    this.category = new DiagnosticCategory(0, '');
  }

  loadCategoryById (id: number): void {
    id = +id;
    if (id) {
      const postfix = 'LoadCategory';
      this.startLoader(postfix);
      this.service.getCategory(id).then((category) => {
        this.stopLoader(postfix);
        this.category = category;
        this.selectCategory(this.category);
      }).catch(() => {
        this.stopLoader(postfix);
      });
    } else {
      this.category = new DiagnosticCategory();
    }
  }
}
