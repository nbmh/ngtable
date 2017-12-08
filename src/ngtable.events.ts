import {NgTable} from './components/table.component';
import {INgTableSourceParams} from './ngtable.params';
import {NgTableSourceResult} from './ngtable.result';
import {NgTableSource} from './ngtable.source';


export class NgTableInitEvent {

  private _table: NgTable;

  constructor(table: NgTable) {
    this._table = table;
  }

  get table(): NgTable {
    return this._table;
  }

}

export class NgTableDestroyEvent {

  private _table: NgTable;

  constructor(table: NgTable) {
    this._table = table;
  }

  get table(): NgTable {
    return this._table;
  }

}

export class NgTableBeforeConnectEvent {

  private _table: NgTable;
  private _params: INgTableSourceParams;

  constructor(table: NgTable, params: INgTableSourceParams) {
    this._table = table;
    this._params = params;
  }

  get table(): NgTable {
    return this._table;
  }

  get params(): INgTableSourceParams {
    return this._params;
  }

}

export class NgTableAfterConnectEvent {

  private _table: NgTable;
  private _result: NgTableSourceResult;

  constructor(table: NgTable, result: NgTableSourceResult) {
    this._table = table;
    this._result = result;
  }

  get table(): NgTable {
    return this._table;
  }

  get result(): NgTableSourceResult {
    return this._result;
  }

}

export class NgTableRangeEvent {

  private _table: NgTable;
  private _range: number;
  private _options: number[];

  constructor(table: NgTable, range: number, options: number[]) {
    this._table = table;
    this._range = range;
    this._options = options;
  }

  get table(): NgTable {
    return this._table;
  }

  get range(): number {
    return this._range;
  }

  get options(): number[] {
    return this._options;
  }

}

export class NgTableSourceUpdateEvent {

  private _source: NgTableSource;
  private _result: NgTableSourceResult;

  constructor(source: NgTableSource, result: NgTableSourceResult) {
    this._source = source;
    this._result = result;
  }

  get source(): NgTableSource {
    return this._source;
  }

  get result(): NgTableSourceResult {
    return this._result;
  }

}
