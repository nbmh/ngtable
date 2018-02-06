import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {
  NgTableAfterConnectEvent,
  NgTableBeforeConnectEvent,
  NgTableDestroyEvent,
  NgTableInitEvent,
  NgTableRangeEvent,
  NgTableSourceUpdateEvent
} from '../ngtable.events';
import {NgTableSourceResult} from '../ngtable.result';
import {NgTableSource} from '../ngtable.source';


@Component({
  selector: 'ng-table',
  template: `
  <ng-content></ng-content>
  `,
  styles: [`
:host(.ng-table) {
  background: #fff;
  overflow: auto;
  display: table;
  width: 100%;
}

:host(.ng-table) /deep/ .ng-table-header-row,
:host(.ng-table) /deep/ .ng-table-row {
  display: table-row;
}

:host(.ng-table) /deep/ .ng-table-header-cell,
:host(.ng-table) /deep/ .ng-table-cell {
  border-bottom-color: rgba(0, 0, 0, .12);
  border-bottom-width: 1px;
  border-bottom-style: solid;
  padding: 12px;
}

:host(.ng-table) /deep/ .ng-table-header-cell::before,
:host(.ng-table) /deep/ .ng-table-cell::before {
  content: "";
  min-height: 48px;
}

:host(.ng-table) /deep/ .ng-table-header-cell {
  font-size: 12px;
  font-weight: 500;
  color: rgba(0, 0, 0, .54);
  display: table-cell;
  white-space: nowrap;
}

:host(.ng-table) /deep/ .ng-table-cell {
  font-size: 14px;
  color: rgba(0,0,0,.87);
  display: table-cell;
}

:host(.ng-table) /deep/ .ng-table-icon {
  width: 40px;
  height: 40px;
}

:host(.ng-table-striped) /deep/ .ng-table-row:nth-of-type(odd) {
  background-color: #f9f9f9;
}

:host(.ng-table-striped.ng-table-hover) /deep/ .ng-table-row:hover {
  background-color: #f5f5f5;
}
  `],
  host: {'class': 'ng-table'}
})
export class NgTable implements OnInit, AfterViewInit, OnDestroy {

  private _dataSourceSubscriber: any;

  private _rows: Array<any> = [];
  private _totalRows: number = 0;
  private _page: number = 1;
  private _totalPages: number = 0;
  private _from: number = 0;
  private _to: number = 0;
  private _moreRange: number = 10;
  private _dataSource: NgTableSource;
  private _initialized: boolean = false;
  private _queryPage: string = 'page';
  private _querySubscriber: any;

  @Output('init') initEmitter: EventEmitter<NgTableInitEvent> = new EventEmitter<NgTableInitEvent>();
  @Output('destroy') destroyEmitter: EventEmitter<NgTableDestroyEvent> = new EventEmitter<NgTableDestroyEvent>();
  @Output('beforeConnect') beforeConnectEmitter: EventEmitter<NgTableBeforeConnectEvent> = new EventEmitter<NgTableBeforeConnectEvent>();
  @Output('sourceUpdate') sourceUpdateEmitter: EventEmitter<NgTableSourceUpdateEvent> = new EventEmitter<NgTableSourceUpdateEvent>();
  @Output('afterConnect') afterConnectEmitter: EventEmitter<NgTableAfterConnectEvent> = new EventEmitter<NgTableAfterConnectEvent>();
  @Output('rangeChange') rangeChangeEmitter: EventEmitter<NgTableRangeEvent> = new EventEmitter<NgTableRangeEvent>();

  constructor() {

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.initEmitter.emit(new NgTableInitEvent(this));

    // TODO: Change to parse params from window.location. RouterModule screws with lazy loading
    /*this._querySubscriber = this.activeRoute.queryParams.debounceTime(10).subscribe(params => {
      this._initialized = true;
      this._page = params[this._queryPage] ? +params[this._queryPage] : 1;

      this.requestData();
    });*/
    this._initialized = true;
    this._page = 1;

    this.requestData();
    //=================
  }

  ngOnDestroy() {
    if (this._dataSourceSubscriber) {
      this._dataSourceSubscriber.unsubscribe();
      this._dataSourceSubscriber = null;
    }

    this._querySubscriber.unsubscribe();

    this.destroyEmitter.emit(new NgTableDestroyEvent(this));
  }

  @Input()
  set dataSource(source: NgTableSource) {
    this._dataSource = source;

    if (this._dataSourceSubscriber) {
      this._dataSourceSubscriber.unsubscribe();
    }

    this._dataSource.sourceUpdate.subscribe((e: NgTableSourceUpdateEvent) => {
      this.sourceUpdateEmitter.emit(e);
    });

    this._dataSourceSubscriber = this._dataSource.connection.subscribe((result: NgTableSourceResult) => {
      if (result) {
        this.calculate(result.data, result.totalRows);
        let event: NgTableAfterConnectEvent = new NgTableAfterConnectEvent(this, result);
        this.afterConnectEmitter.emit(event);
        this._dataSource.afterConnect.emit(event);
      }
    });
  }

  protected calculate(rows: any[], totalRows: number) {
    this._rows = rows;
    this._totalRows = totalRows;
    this._totalPages = Math.ceil(this._totalRows / this._dataSource.range);

    if (this._page > this._totalPages) {
      this._page = 1;
    }

    this._from = ((this._page - 1) * this._dataSource.range) + 1;
    this._to = this._from + this._dataSource.range - 1;

    if (this._to > this._totalRows) {
      this._to = this._totalRows;
    }
  }

  protected requestData(): void {
    if (!this._dataSource.loading) {
      this._dataSource.params.offset = (this._page - 1) * this._dataSource.range;

      let event: NgTableBeforeConnectEvent = new NgTableBeforeConnectEvent(this, this._dataSource.params);

      this.beforeConnectEmitter.emit(event);
      this._dataSource.beforeConnect.emit(event);

      this._dataSource.getData(this._dataSource.params);
    }
  }

  removeRow(row: any): NgTable {
    let index: number = this._rows.indexOf(row);
    if (index > -1) {
      this._rows.splice(index, 1);
    }

    this.calculate(this._rows, this.totalRows - 1);

    return this;
  }

  updateRow(row: any): NgTable {
    let index: number = this._rows.indexOf(row);
    if (index > -1) {
      this._rows.splice(index, 1, row);
    }

    return this;
  }

  addRow(row: any): NgTable {
    this._rows.push(row);

    this.calculate(this._rows, this.totalRows + 1);

    return this;
  }

  get rows(): Array<any> {
    return this._rows;
  }

  @Input()
  set queryPage(name: string) {
    this._queryPage = name;
  }

  get page(): number {
    return this._page;
  }

  @Input()
  set page(index: number) {
    if (!this._dataSource.loading) {
      this._page = +index;

      if (this._page < 1) {
        this._page = 1;
      }

      if (this._page > this._totalPages) {
        this._page = this._totalPages;

        if (this._page < 1) {
          this._page = 1;
        }
      }

      this.requestData();
    }
  }

  get totalPages(): number {
    return this._totalPages;
  }

  get totalRows(): number {
    return this._totalRows;
  }

  get from(): number{
    return this._from;
  }

  get to(): number {
    return this._to;
  }

  get range(): number {
    return this._dataSource.range;
  }

  @Input()
  set range(value: number) {
    if (!this._dataSource.loading) {
      this._dataSource.range = +value;
      this.rangeChangeEmitter.emit(new NgTableRangeEvent(this, this.range, this.rangeOptions));
    }
  }

  get moreRange(): number {
    return this._moreRange;
  }

  @Input()
  set moreRange(value: number) {
    this._moreRange = value;
  }

  get rangeOptions(): Array<number> {
    return this._dataSource.rangeOptions;
  }

  @Input()
  set rangeOptions(value: Array<number>) {
    this._dataSource.rangeOptions = value;
  }

  get initialized(): boolean {
    return this._initialized;
  }

  get loading(): boolean {
    return this._dataSource.loading;
  }

  get empty(): boolean {
    return this._totalRows == 0;
  }

  refresh(): NgTable {
    this.page = this._page;
    return this;
  }

  more(): NgTable {
    if (!this._dataSource.loading) {
      this._page = 1;
      this.range = this.range + this._moreRange;
      this.requestData();
    }
    return this;
  }

  prev(): NgTable {
    this._page--;

    if (this._page < 1) {
      this._page = 1;
    }

    this.page = this._page;

    return this;
  }

  next(): NgTable {
    this._page++;

    let pagesMax: number = this.totalPages;

    if (this._page > pagesMax) {
      this._page = pagesMax;
    }

    this.page = this._page;

    return this;
  }

  get hasPrev(): boolean {
    return this._page > 1;
  }

  get hasNext(): boolean {
    return this._page < this._totalPages;
  }

  get isFirst(): boolean {
    return this._page == 1;
  }

  get isLast(): boolean {
    return this._page == this._totalPages;
  }

}
