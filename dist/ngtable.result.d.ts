import { NgTableSource } from './ngtable.source';
export declare class NgTableSourceResult {
    protected _data: Array<any>;
    protected _totalRows: number;
    protected _additionalData: any;
    constructor(_data: Array<any>, _totalRows?: number, _additionalData?: any);
    readonly data: Array<any>;
    readonly totalRows: number;
    readonly additionalData: number;
    static create(rows: Array<any>, totalRows: number, additionalData?: any): NgTableSourceResult;
    static singlePage(source: NgTableSource, rows: Array<any>, additionalData?: any): NgTableSourceResult;
}
