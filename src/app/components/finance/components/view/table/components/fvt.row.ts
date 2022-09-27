import {FvtCols} from './fvt.cols';
import {FvtColInterface} from './cols/fvt.col.interface';

export class FvtRow {
  fvtCols: Array<FvtCols> = [];
  id: number;

  constructor(id: number = 0) {
    this.id = id;
  }

  addColumn(column: FvtColInterface, rowIndex: number = 0): void {
    if (typeof this.fvtCols[rowIndex] === 'undefined') {
      this.fvtCols[rowIndex] = new FvtCols();
    }
    this.fvtCols[rowIndex].add(column);
  }
}
