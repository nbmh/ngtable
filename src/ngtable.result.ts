import {INgTableSourceParams} from './ngtable.params';
import {NgTableSource} from './ngtable.source';


export class NgTableSourceResult {

  constructor(protected _data: Array<any>, protected _totalRows: number = 0, protected _additionalData?: any) {

  }

  get data(): Array<any> {
    return this._data;
  }

  get totalRows(): number {
    return this._totalRows;
  }

  get additionalData(): number {
    return this._additionalData;
  }

  static create(rows: Array<any>, totalRows: number, additionalData?: any) {
    return new NgTableSourceResult(rows, totalRows, additionalData);
  }

  static singlePage(source: NgTableSource, rows: Array<any>, additionalData?: any): NgTableSourceResult {
    let list: Array<any> = [];
    let index: number = 0;
    let params: INgTableSourceParams = source.params;

    rows.forEach(row => {
      if (index >= params.offset && index < params.offset + source.range) {
        list.push(row);
      }
      index++;
    });

    return new NgTableSourceResult(list, rows.length, additionalData);
  }

}
