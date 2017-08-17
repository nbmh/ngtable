import { Component } from '@angular/core';
import { NgTable } from './table.component';

@Component({
  selector: 'ng-table-header-row',
  template: `
  <ng-content></ng-content>
  `,
  host: {'class': 'ng-table-header-row'}
})
export class NgTableHeaderRow {

  constructor(private parent: NgTable) {

  }

}
