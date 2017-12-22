import {EventEmitter} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {NgTableAfterConnectEvent, NgTableBeforeConnectEvent, NgTableSourceUpdateEvent} from './ngtable.events';
import {INgTableSourceParams} from './ngtable.params';
import {NgTableSourceResult} from './ngtable.result';


export abstract class NgTableSource {

  protected _range: number = null;
  protected _rangeOptions: Array<number> = [5, 10, 20, 50];
  protected _params: INgTableSourceParams = null;
  private _loading: boolean = false;
  protected readonly _sourceUpdate: BehaviorSubject<NgTableSourceResult> = new BehaviorSubject<NgTableSourceResult>(null);
  public readonly sourceUpdate: EventEmitter<NgTableSourceUpdateEvent> = new EventEmitter<NgTableSourceUpdateEvent>();
  public readonly beforeConnect: EventEmitter<NgTableBeforeConnectEvent> = new EventEmitter<NgTableBeforeConnectEvent>();
  public readonly afterConnect: EventEmitter<NgTableAfterConnectEvent> = new EventEmitter<NgTableAfterConnectEvent>();

  constructor() {

  }

  public get loading(): boolean {
    return this._loading;
  }

  protected abstract source(params: INgTableSourceParams): void;

  public getData(params: INgTableSourceParams): void {
    this._loading = true;
    this.source(params);
  }

  protected updateData(result: NgTableSourceResult) {
    this._loading = false;
    this._sourceUpdate.next(result);
    this.sourceUpdate.emit(new NgTableSourceUpdateEvent(this, result));
  }

  public get connection(): BehaviorSubject<NgTableSourceResult> {
    return this._sourceUpdate;
  }

  public get params(): INgTableSourceParams {
    return this._params;
  }

  public set params(value: INgTableSourceParams) {
    let wasSet: any = this._params != null;

    this._params = value;

    if (!this._loading && wasSet) {
      this.getData(this.params);
    }
  }

  public get range(): number {
    return this._range || 10;
  }

  public set range(value: number) {
    let wasSet: any = this._range != null;

    this._range = value;

    if (!this._loading && wasSet) {
      this.getData(this.params);
    }
  }

  public get rangeOptions(): Array<number> {
    return this._rangeOptions;
  }

  public set rangeOptions(options: Array<number>) {
    this._rangeOptions = options;
  }

}
