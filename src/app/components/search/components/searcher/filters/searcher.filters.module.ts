import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppTranslationModule} from '../../../../../app.translation.module';
import {SearcherFiltersComponent} from './searcher.filters.component';

@NgModule({
  imports: [
    CommonModule,
    AppTranslationModule,
  ],
  declarations: [
    SearcherFiltersComponent,
  ],
  exports: [
    SearcherFiltersComponent,
  ],
})
export class SearcherFiltersModule {}
