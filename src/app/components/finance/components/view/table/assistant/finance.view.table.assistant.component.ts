import {AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ViewChild} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {LoadingComponent} from '../../../../../core/components/componentLoader';
import {LoggerComponent} from '../../../../../core/logger/LoggerComponent';
import {GlobalState} from '../../../../../../global.state';
import {FvtBodyDirective} from './fvt.body.directive';
import {FvtTbodyComponent} from "../components/parts/components/tbody";
import {FvtDefaultRowComponent} from "../components/rows/components/default";
import {FvtColAddComponent} from "../components/cols/components/add/fvt.col.add.component";

@Component({
  selector: 'nga-finance-view-table-assistant',
  template: `<div class="fvt-table-container" role="table" aria-label="Finance View Table">
    <ng-template fvtBody></ng-template>
  </div>`,
  styleUrls: [`./finance.view.table.assistant.scss`],
})
export class FinanceViewTableAssistantComponent extends LoadingComponent implements AfterViewInit {
  protected componentName: string = 'FinanceViewTableAssistantComponent';

  @ViewChild(FvtBodyDirective, {static: true}) fvtBody!: FvtBodyDirective;

  constructor (
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    protected translateService: TranslateService,
    private resolver: ComponentFactoryResolver
  ) {
    super();
  }

  ngAfterViewInit() {
    this.initializeTable();
  }

  private initializeTable() {
    const bodyRef = this.createBody();
    const rowFoundation = this.createRow(bodyRef);

    rowFoundation.then((rowRef: ComponentRef<any>) => {
      this.createAddCol(rowRef).then((colRef: ComponentRef<any>) => {
        colRef.instance.setColspan(99);
        colRef.instance.click.subscribe(() => {
          console.log(1)

          const newRow = this.createRow(bodyRef);
          newRow.then((newRowRef: ComponentRef<any>) => {
            this.createAddCol(newRowRef).then((newColRef: ComponentRef<any>) => {
              newColRef.instance.click.subscribe(() => console.log(2))
            });
          });

        });
      });
    });
  }

  private createBody(): ComponentRef<any> {
    const factoryBody = this.resolver.resolveComponentFactory(FvtTbodyComponent);
    return this.fvtBody.viewContainerRef.createComponent<any>(factoryBody);
  }

  private createRow(bodyRef: ComponentRef<any>): Promise<any> {
    const factoryRow = this.resolver.resolveComponentFactory(FvtDefaultRowComponent)
    return bodyRef.instance.addRow(factoryRow);
  }

  private createAddCol(rowRef: ComponentRef<any>): Promise<any> {
    const factoryCol = this.resolver.resolveComponentFactory(FvtColAddComponent)
    return rowRef.instance.addCol(factoryCol);
  }
}
