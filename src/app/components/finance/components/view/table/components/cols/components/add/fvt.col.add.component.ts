import {FvtColInterface} from '../../fvt.col.interface';
import {ChangeDetectorRef, Component, EventEmitter, Output} from "@angular/core";
import {LoadingComponent} from "../../../../../../../../core/components/componentLoader";
import {LoggerComponent} from "../../../../../../../../core/logger/LoggerComponent";
import {GlobalState} from "../../../../../../../../../global.state";

@Component({
  selector: 'nga-fvt-col-add',
  template: `
  <div class="flex-row" role="cell">
    <button
      pButton
      pRipple
      type="button"
      icon="pi pi-plus"
      class="p-button-rounded p-button-text"
      (click)="addLocations()"
    ></button>
  </div>`,
})
export class FvtColAddComponent extends LoadingComponent implements FvtColInterface {
  protected componentName: string = 'FvtColAddComponent';

  @Output() protected click: EventEmitter<string> = new EventEmitter<string>();

  colspan: number = 1;

  constructor (
    protected _logger: LoggerComponent,
    protected _state: GlobalState,
    private _changeDetectionRef: ChangeDetectorRef,
  ) {
    super();
  }

  addLocations() {
    this.click.emit('');
  }

  setColspan(cs: number): void {
    this.colspan = cs;
    this._changeDetectionRef.detectChanges();
  }
}
