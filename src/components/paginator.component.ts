import { Component, Input } from '@angular/core';
import { NgTable } from './table.component';
import { MdSelectChange } from '@angular/material';

@Component({
  selector: 'ng-table-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
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
