import { BehaviorSubject } from 'rxjs/Rx';
import { NgTableSourceResult } from './ngtable.result';
import { INgTableSourceParams } from './ngtable.params';

export abstract class NgTableSource {

  private _range: number = null;
  private _rangeOptions: Array<number> = [5, 10, 20, 50];
  private _params: INgTableSourceParams = null;
  private _loading: boolean = false;
  private _dataChange: BehaviorSubject<NgTableSourceResult> = new BehaviorSubject<NgTableSourceResult>(null);

  constructor() {

  }

  get loading(): boolean {
    return this._loading;
  }

  protected abstract source(params: INgTableSourceParams): void;

  getData(params: INgTableSourceParams): void {
    this._loading = true;
    this.source(params);
  }

  protected updateData(result: NgTableSourceResult) {
    this._loading = false;
    this._dataChange.next(result);
  }

  get connection(): BehaviorSubject<NgTableSourceResult> {
    return this._dataChange;
  }

  get params(): INgTableSourceParams {
    return this._params;
  }

  set params(value: INgTableSourceParams) {
    let wasSet: any = this._params != null;

    this._params = value;

    if (!this._loading && wasSet) {
      this.getData(this.params);
    }
  }

  get range(): number {
    return this._range || 10;
  }

  set range(value: number) {
    let wasSet: any = this._range != null;

    this._range = value;

    if (!this._loading && wasSet) {
      this.getData(this.params);
    }
  }

  get rangeOptions(): Array<number> {
    return this._rangeOptions;
  }

  set rangeOptions(options: Array<number>) {
    this._rangeOptions = options;
  }

}
