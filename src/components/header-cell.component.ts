import { Component } from '@angular/core';
import { NgTableHeaderRow } from './header-row.component';

@Component({
  selector: 'ng-table-header-cell',
  template: `
  <ng-content></ng-content>
  `,
  host: {'class': 'ng-table-header-cell'}
})
export class NgTableHeaderCell {

  constructor(private parent: NgTableHeaderRow) {

  }

}
