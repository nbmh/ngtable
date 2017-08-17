import { Component } from '@angular/core';
import { NgTable } from './table.component';

@Component({
  selector: 'ng-table-row',
  template: `
  <ng-content></ng-content>
  `,
  host: {'class': 'ng-table-row'}
})
export class NgTableRow {

  constructor(private parent: NgTable) {

  }
  
}
