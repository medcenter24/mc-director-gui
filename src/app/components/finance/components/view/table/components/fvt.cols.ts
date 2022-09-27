import {FvtColInterface} from './cols/fvt.col.interface';

export class FvtCols {
  cols: Array<FvtColInterface> = [];

  add(column: FvtColInterface) {
    this.cols.push(column);
  }
}
