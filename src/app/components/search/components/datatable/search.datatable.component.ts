import {Component} from '@angular/core';
import {AbstractDatatableController} from '../../../ui/tables/abstract.datatable.controller';
import {LoggerComponent} from '../../../core/logger/LoggerComponent';
import {GlobalState} from '../../../../global.state';
import {TranslateService} from '@ngx-translate/core';
import { LoadableServiceInterface } from '../../../core/loadable';
import { DatatableComponent } from '../../../ui/datatable';
import { DatatableCol } from '../../../ui/datatable';

@Component({
  selector: 'nga-search-result-datatable',
  templateUrl: './search.datatable.html',
})
export class SearchDatatableComponent extends AbstractDatatableController {
  protected componentName: string = 'SearchDatatableComponent';

  hasResult: boolean = false;

  constructor(
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    protected translateService: TranslateService,
  ) {
    super();
  }

  protected getColumns(): DatatableCol[] {
    return [];
  }

  protected getDatatableComponent(): DatatableComponent {
    return undefined;
  }

  protected getEmptyModel(): Object {
    return undefined;
  }

  protected getService(): LoadableServiceInterface {
    return undefined;
  }

  protected getTranslateService(): TranslateService {
    return undefined;
  }
}
