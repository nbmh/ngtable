import { NgTableSource } from './ngtable.source';
export declare class NgTableSourceResult {
    private _data;
    private _totalRows;
    constructor(data: Array<any>, totalRows: number);
    readonly data: Array<any>;
    readonly totalRows: number;
    static create(rows: Array<any>, totalRows: number): NgTableSourceResult;
    static singlePage(source: NgTableSource, rows: Array<any>): NgTableSourceResult;
}
