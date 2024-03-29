import {NgModule} from '@angular/core';
import {SearchPageComponent} from './search.page.component';
import { routing } from './search.page.routing';
import {StatisticsService} from '../../components/statistics/statistics.service';
import {AppTranslationModule} from '../../app.translation.module';
import {ButtonModule} from 'primeng/button';
import {NgaModule} from '../../theme/nga.module';
import {FormsModule} from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';
import {SearchFormModule} from '../../components/search/components/form';
import {SearchResultModule} from '../../components/search/components/result';

@NgModule({
  imports: [
    routing,
    AppTranslationModule,
    ButtonModule,
    NgaModule,
    FormsModule,
    CheckboxModule,
    SearchFormModule,
    SearchResultModule,
  ],
  declarations: [SearchPageComponent],
  exports: [SearchPageComponent],
  providers: [StatisticsService],
})
export class SearchPageModule {}
