import { Component, Input } from '@angular/core';
import { NgTable } from './table.component';
import { MdSelectChange } from '@angular/material';

@Component({
  selector: 'ng-table-paginator',
  template: `
<div class="ng-table-paginator-page-size" *ngIf="rangeVisible && !table.empty">
  <div class="ng-table-paginator-page-size-label">
    Items per page
  </div>
  <md-select class="ng-table-paginator-page-size-select" [(ngModel)]="table.range" (change)="actionRange($event)" [disabled]="table.loading">
    <md-option *ngFor="let count of table.rangeOptions" [value]="count">
      {{count}}
    </md-option>
  </md-select>
</div>
<div class="ng-table-paginator-page-label" *ngIf="!table.empty">
  Page {{table.page}} of {{table.totalPages}} |
  Items <span *ngIf="table.rows.length > 1">{{table.from}} - {{table.to}}</span>
  <span *ngIf="table.rows.length == 1">{{table.from}}</span>
  of {{table.totalRows}}
</div>
<button md-icon-button *ngIf="!table.empty" (click)="table.prev()" [disabled]="!table.hasPrev || table.loading" mdTooltip="Previous page"><md-icon class="material-icons">keyboard_arrow_left</md-icon></button>
<button md-icon-button *ngIf="!table.empty" (click)="table.next()" [disabled]="!table.hasNext || table.loading" mdTooltip="Next page"><md-icon class="material-icons">keyboard_arrow_right</md-icon></button>
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

  actionRange(e: MdSelectChange):void  {
    if (this.table) {
      this.table.range = +e.value;
    }
  }

}
