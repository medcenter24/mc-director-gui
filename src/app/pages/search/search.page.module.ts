import {NgModule} from '@angular/core';
import {SearchPageComponent} from './search.page.component';
import { routing } from './search.page.routing';
import {StatisticsService} from '../../components/statistics/statistics.service';
import {AppTranslationModule} from '../../app.translation.module';
import {ButtonModule} from 'primeng/button';
import {NgaModule} from '../../theme/nga.module';
import {FormsModule} from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';
import {SearchFormModule} from '../../components/search/components/form/search.form.module';
import {SearchDatatableModule} from '../../components/search/components/datatable';

@NgModule({
  imports: [
    // FormsModule,
    // CommonModule,
    // NgaModule,
    routing,
    AppTranslationModule,
    ButtonModule,
    NgaModule,
    FormsModule,
    CheckboxModule,
    SearchFormModule,
    SearchDatatableModule,
    // AppTranslationModule,
  ],
  declarations: [SearchPageComponent],
  exports: [SearchPageComponent],
  providers: [
    StatisticsService,
  ],
})
export class SearchPageModule {}
