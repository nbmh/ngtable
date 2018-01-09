import {Component, Input} from '@angular/core';
import {NgTable} from './table.component';


@Component({
  selector: 'ng-table-paginator',
  template: `
1<div class="ng-table-paginator-page-size" *ngIf="rangeVisible && !table.empty">
  <div class="ng-table-paginator-page-size-label">
    {{label.items_per_page}}
  </div>
  <select class="ng-table-paginator-page-size-select" [(ngModel)]="table.range" (change)="actionRange($event)" [disabled]="table.loading">
    <option *ngFor="let count of table.rangeOptions" value="{{count}}">{{count}}</option>
  </select>
</div>
<div class="ng-table-paginator-page-label" *ngIf="!table.empty">
  {{label.page}} {{table.page}} {{label.of_page}} {{table.totalPages}} |
  {{label.items}} <span *ngIf="table.rows.length > 1">{{table.from}} - {{table.to}}</span>
  <span *ngIf="table.rows.length == 1">{{table.from}}</span>
  {{label.of_items}} {{table.totalRows}}
</div>
<button *ngIf="!table.empty" (click)="table.prev()" [disabled]="!table.hasPrev || table.loading" title="Previous page">⇽</button>
<button *ngIf="!table.empty" (click)="table.next()" [disabled]="!table.hasNext || table.loading" title="Next page">⇾</button>
  `,
  styles: [`
:host(.ng-table-paginator) {
  font-family: Roboto,Helvetica Neue,sans-serif;
  font-size: 12px;
  background: #fff;
  color: rgba(0,0,0,.54);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 56px;
  padding: 0 8px;
}

:host(.ng-table-paginator) /deep/ .ng-table-paginator-page-size {
  display: flex;
  align-items: center;
}

:host(.ng-table-paginator) /deep/ .ng-table-paginator-page-size-label {
  margin: 0 8px 0 0;
}

:host(.ng-table-paginator) /deep/ .ng-table-paginator-page-size-select .mat-select-trigger {
  min-width: 60px;
  font-size: 12px;
}

:host(.ng-table-paginator) /deep/ .ng-table-paginator-page-label {
  margin: 0 32px;
}
  `],
  host: {'class': 'ng-table-paginator'}
})
export class NgTablePaginator {

  @Input() table: NgTable;
  private _rangeVisible: boolean = true;
  private _label: Object = {
    items_per_page: <string> 'Items per page',
    page: <string> 'Page',
    of_page: <string> 'of',
    items: <string> 'Items',
    of_items: <string> 'of',
  };

  get label(): Object {
    return this._label;
  }

  @Input('labels')
  set label(value: Object) {
    this._label = Object.assign({}, this._label, value);
  }

  @Input()
  set ngTable(value: NgTable) {
    this.table = value;
  }

  get rangeVisible(): boolean {
    return this._rangeVisible;
  }

  @Input()
  set rangeVisible(status: boolean) {
    this._rangeVisible = status;
  }

  actionRange(e: any):void  {
    if (this.table) {
      this.table.range = +e.value;
    }
  }

}
