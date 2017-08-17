import { Component } from '@angular/core';
import { NgTableRow } from './row.component';

@Component({
  selector: 'ng-table-cell',
  template: `
  <ng-content></ng-content>
  `,
  host: {'class': 'ng-table-cell'}
})
export class NgTableCell {

  constructor(private parent: NgTableRow) {

  }

}
