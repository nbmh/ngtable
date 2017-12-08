import { NgTable } from './components/table.component';
import { INgTableSourceParams } from './ngtable.params';
import { NgTableSourceResult } from './ngtable.result';
import { NgTableSource } from './ngtable.source';
export declare class NgTableInitEvent {
    private _table;
    constructor(table: NgTable);
    readonly table: NgTable;
}
export declare class NgTableDestroyEvent {
    private _table;
    constructor(table: NgTable);
    readonly table: NgTable;
}
export declare class NgTableBeforeConnectEvent {
    private _table;
    private _params;
    constructor(table: NgTable, params: INgTableSourceParams);
    readonly table: NgTable;
    readonly params: INgTableSourceParams;
}
export declare class NgTableAfterConnectEvent {
    private _table;
    private _result;
    constructor(table: NgTable, result: NgTableSourceResult);
    readonly table: NgTable;
    readonly result: NgTableSourceResult;
}
export declare class NgTableRangeEvent {
    private _table;
    private _range;
    private _options;
    constructor(table: NgTable, range: number, options: number[]);
    readonly table: NgTable;
    readonly range: number;
    readonly options: number[];
}
export declare class NgTableSourceUpdateEvent {
    private _source;
    private _result;
    constructor(source: NgTableSource, result: NgTableSourceResult);
    readonly source: NgTableSource;
    readonly result: NgTableSourceResult;
}
