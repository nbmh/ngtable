import { Injectable } from '@angular/core';
import { NgTableSource } from './ngtable.source';
import { INgTableSourceParams } from './ngtable.params';

export class NgTableSourceResult {

  private _data: Array<{}>;
  private _totalRows: number = 0;

  constructor(data: Array<any>, totalRows: number) {
    this._data = data;
    this._totalRows = totalRows;
  }

  get data(): Array<any> {
    return this._data;
  }

  get totalRows(): number {
    return this._totalRows;
  }

  static create(rows: Array<any>, totalRows: number) {
    return new NgTableSourceResult(rows, totalRows);
  }

  static singlePage(source: NgTableSource, rows: Array<any>): NgTableSourceResult {
    let list: Array<any> = [];
    let index: number = 0;
    let params: INgTableSourceParams = source.params;

    rows.forEach(row => {
      if (index >= params.offset && index < params.offset + source.range) {
        list.push(row);
      }
      index++;
    });

    return new NgTableSourceResult(list, rows.length);
  }

}
