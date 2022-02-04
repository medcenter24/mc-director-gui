import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {LoadingComponent} from "../../../../../../../../core/components/componentLoader";
import {LoggerComponent} from "../../../../../../../../core/logger/LoggerComponent";
import {GlobalState} from "../../../../../../../../../global.state";
import {PartInterface} from "../../part.interface";
import {FvtRowInterface} from "../../../rows/components/fvt.row.interface";
import {FvtRowsDirective} from "./fvt.rows.directive";

@Component({
  selector: 'nga-fvt-column-add',
  template: `<div class="flex-table row" role="rowgroup" aria-label="fvtBody">
    <ng-container fvtRows></ng-container>
  </div>`,
})
export class FvtTbodyComponent extends LoadingComponent implements PartInterface, AfterViewInit {
  protected componentName: string = 'FvtTbodyComponent';

  @ViewChild(FvtRowsDirective, {static: true}) fvtRows!: FvtRowsDirective;

  private initialized = false;
  private rows: Object = {};
  private lastIndex: number = -1;

  constructor (
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
  ) {
    super();
  }

  ngAfterViewInit() {
    this.initializeRows();
  }

  addRow(component: FvtRowInterface): Promise<any> {
    this.lastIndex++;
    const id = this.lastIndex;
    return new Promise<any>((resolve, reject) => {
      this.rows[id] = {component, resolve, reject};
      this.draw();
    });
  }

  private initializeRows() {
    this.initialized = true;
    this.draw();
  }

  private draw() {
    if (!this.initialized) {
      return;
    }
    for (const rowId in this.rows) {
      let row = this.rows[rowId];
      if (!row.hasOwnProperty('ref')) {
        row['ref'] = this.fvtRows.viewContainerRef.createComponent<any>(row.component);
      }
      row.resolve(row.ref);
    }
  }
}
