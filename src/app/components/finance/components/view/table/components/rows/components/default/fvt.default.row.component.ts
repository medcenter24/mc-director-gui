import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {LoadingComponent} from "../../../../../../../../core/components/componentLoader";
import {LoggerComponent} from "../../../../../../../../core/logger/LoggerComponent";
import {GlobalState} from "../../../../../../../../../global.state";
import {FvtRowInterface} from "../fvt.row.interface";
import {FvtColsDirective} from "./fvt.cols.directive";
import {FvtColInterface} from "../../../cols/fvt.col.interface";

@Component({
  selector: 'nga-fvt-default-row',
  template: `
    <div class="flex-table row" role="rowgroup"><ng-template fvtCols></ng-template></div>
  `,
})
export class FvtDefaultRowComponent extends LoadingComponent implements FvtRowInterface, AfterViewInit {
  protected componentName: string = 'FvtDefaultRowComponent';

  @ViewChild(FvtColsDirective, {static: true}) fvtCols!: FvtColsDirective;

  private initialized = false;
  private cols: Object = {};
  private lastIndex: number = -1;

  constructor (
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
  ) {
    super();
  }

  ngAfterViewInit() {
    this.initializeCols();
  }

  private initializeCols() {
    this.initialized = true;
    this.draw();
  }

  addCol(component: FvtColInterface): Promise<any> {
    this.lastIndex++;
    const id = this.lastIndex;
    return new Promise<any>((resolve, reject) => {
      this.cols[id] = {component, resolve, reject};
      this.draw();
    });
  }

  private draw() {
    if (!this.initialized) {
      return;
    }
    for (const colId in this.cols) {
      let col = this.cols[colId];
      if (!col.hasOwnProperty('ref')) {
        col['ref'] = this.fvtCols.viewContainerRef.createComponent<any>(col.component);
      }
      col.resolve(col.ref);
    }
  }
}
