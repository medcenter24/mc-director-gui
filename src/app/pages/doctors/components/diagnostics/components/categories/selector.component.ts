/*
 * Copyright (c) 2017.
 *
 * @author Alexander Zagovorichev <zagovorichev@gmail.com>
 */

import {Component, Input, Output, EventEmitter} from '@angular/core';

import { Category } from './category';
import { CategoryService } from './category.service';

@Component({
    selector: 'diagnostic-category-selector',
    template: `
        <label for="categories">Category</label>
        <select id="categories" class="form-control" name="category" [(ngModel)]="category" (ngModelChange)="onChange($event)">
            <option [ngValue]="_category" *ngFor="let _category of categories">{{ _category.title }}</option>
        </select>
    `
})
export class CategorySelectorComponent {

    category: Category;

    @Input()
    set category_id(id: number) {
        _.forEach(this.categories, (cat) => {
            if (id === cat.id) {
                this.category = cat;
            }
        });
    }
    @Output() categoryChanged: EventEmitter<Category> = new EventEmitter<Category>();

    categories: Category[] = [];

    constructor (
        private service: CategoryService
    ) { }

    ngOnInit(): void {
        this.service.getCategories().then((data) => {
            this.categories = data;
            if (!this.category && this.categories.length) {
                this.category = this.categories[0];
            }
        });
    }

    onChange(): void {
        this.categoryChanged.emit(this.category);
    }

}

