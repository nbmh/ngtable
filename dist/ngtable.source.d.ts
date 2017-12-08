import { EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { NgTableAfterConnectEvent, NgTableBeforeConnectEvent, NgTableSourceUpdateEvent } from './ngtable.events';
import { INgTableSourceParams } from './ngtable.params';
import { NgTableSourceResult } from './ngtable.result';
export declare abstract class NgTableSource {
    protected _range: number;
    protected _rangeOptions: Array<number>;
    protected _params: INgTableSourceParams;
    private _loading;
    protected readonly _sourceUpdate: BehaviorSubject<NgTableSourceResult>;
    readonly sourceUpdate: EventEmitter<NgTableSourceUpdateEvent>;
    readonly beforeConnect: EventEmitter<NgTableBeforeConnectEvent>;
    readonly afterConnect: EventEmitter<NgTableAfterConnectEvent>;
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
