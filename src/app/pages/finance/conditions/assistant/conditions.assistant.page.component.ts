import { Component } from '@angular/core';
import { LoadingComponent } from '../../../../components/core/components/componentLoader';
import { GlobalState } from '../../../../global.state';
import { TranslateService } from '@ngx-translate/core';
import { LoggerComponent } from '../../../../components/core/logger/LoggerComponent';

@Component({
  selector: 'nga-finance-assistants-page',
  template: `<nga-finance-view-table-assistant></nga-finance-view-table-assistant>`,
})
export class ConditionsAssistantPageComponent extends LoadingComponent {
  protected componentName: string = 'ConditionsAssistantPageComponent';

  constructor (
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    protected translateService: TranslateService,
  ) {
    super();
  }
}
