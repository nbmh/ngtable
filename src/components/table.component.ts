import { Component, Input, Output, OnInit, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgTableSource } from '../ngtable.source';
import { INgTableSourceParams } from '../ngtable.params';
import { NgTableSourceResult } from '../ngtable.result';
import { NgTableInitEvent, NgTableRangeEvent, NgTableBeforeConnectEvent, NgTableAfterConnectEvent, NgTableDestroyEvent } from '../ngtable.events';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'ng-table',
  template: `
  <ng-content></ng-content>
  `,
  styles: [`
:host(.ng-table) {
  background: #fff;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

:host(.ng-table) /deep/ .ng-table-header-row,
:host(.ng-table) /deep/ .ng-table-row {
  border-bottom-color: rgba(0, 0, 0, .12);
  display: flex;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  align-items: center;
  min-height: 48px;
  padding: 0 12px;
}

:host(.ng-table) /deep/ .ng-table-header-cell {
  font-size: 12px;
  font-weight: 500;
  color: rgba(0, 0, 0, .54);
  flex: 1;
}

:host(.ng-table) /deep/ .ng-table-cell {
  font-size: 14px;
  color: rgba(0,0,0,.87);
  flex: 1;
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
  private _dataSource: NgTableSource;
  private _initialized: boolean = false;
  private _queryPage: string = 'page';
  private _querySubscriber: any;

  @Output('init') initEmitter: EventEmitter<NgTableInitEvent> = new EventEmitter<NgTableInitEvent>();
  @Output('destroy') destroyEmitter: EventEmitter<NgTableDestroyEvent> = new EventEmitter<NgTableDestroyEvent>();
  @Output('beforeConnect') beforeConnectEmitter: EventEmitter<NgTableBeforeConnectEvent> = new EventEmitter<NgTableBeforeConnectEvent>();
  @Output('afterConnect') afterConnectEmitter: EventEmitter<NgTableAfterConnectEvent> = new EventEmitter<NgTableAfterConnectEvent>();
  @Output('rangeChange') rangeChangeEmitter: EventEmitter<NgTableRangeEvent> = new EventEmitter<NgTableRangeEvent>();

  constructor(private activeRoute: ActivatedRoute) {

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.initEmitter.emit(new NgTableInitEvent(this));

    this._querySubscriber = this.activeRoute.queryParams.debounceTime(10).subscribe(params => {
      this._initialized = true;
      this._page = params[this._queryPage] ? +params[this._queryPage] : 1;

      this.requestData();
    });
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

    this._dataSourceSubscriber = this._dataSource.connection.subscribe((result: NgTableSourceResult) => {
      if (result) {
        this._rows = result.data;
        this._totalRows = result.totalRows;
        this._totalPages = Math.ceil(this._totalRows / this._dataSource.range);

        if (this._page > this._totalPages) {
          this._page = 1;
        }

        this._from = ((this._page - 1) * this._dataSource.range) + 1;
        this._to = this._from + this._dataSource.range - 1;

        if (this._to > this._totalRows) {
          this._to = this._totalRows;
        }

        this.afterConnectEmitter.emit(new NgTableAfterConnectEvent(this, result));
      }
    });
  }

  protected requestData(): void {
    if (!this._dataSource.loading) {
      this._dataSource.params.offset = (this._page - 1) * this._dataSource.range;

      this.beforeConnectEmitter.emit(new NgTableBeforeConnectEvent(this, this._dataSource.params));

      this._dataSource.getData(this._dataSource.params);
    }
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
