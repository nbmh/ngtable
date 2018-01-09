import {Component, Input} from '@angular/core';
import {NgTable} from './table.component';


@Component({
  selector: 'ng-table-more',
  template: `
    <button class="ng-table-more-button" *ngIf="table.rows.length<table.totalRows" (click)="table.more()" title="Load more">More</button>
  `,
  styles: [`
:host(.ng-table-more) {
  font-family: Roboto,Helvetica Neue,sans-serif;
  font-size: 12px;
  background: #fff;
  color: rgba(0,0,0,.54);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
}

:host(.ng-table-more) /deep/ .ng-table-more-button {
  width: 100%;
}
  `],
  host: {'class': 'ng-table-more'}
})
export class NgTableMore {

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
