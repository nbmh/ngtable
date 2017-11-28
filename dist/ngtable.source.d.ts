import { BehaviorSubject } from 'rxjs/Rx';
import { NgTableSourceResult } from './ngtable.result';
import { INgTableSourceParams } from './ngtable.params';
export declare abstract class NgTableSource {
    protected _range: number;
    protected _rangeOptions: Array<number>;
    protected _params: INgTableSourceParams;
    private _loading;
    protected readonly _dataChange: BehaviorSubject<NgTableSourceResult>;
    constructor();
    readonly loading: boolean;
    protected abstract source(params: INgTableSourceParams): void;
    getData(params: INgTableSourceParams): void;
    protected updateData(result: NgTableSourceResult): void;
    readonly connection: BehaviorSubject<NgTableSourceResult>;
    params: INgTableSourceParams;
    range: number;
    rangeOptions: Array<number>;
}
