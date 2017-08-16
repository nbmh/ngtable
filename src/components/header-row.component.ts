import { Component } from '@angular/core';

@Component({
  selector: 'ng-table-header-row',
  template: `
  <ng-content></ng-content>
  `,
  host: {'class': 'ng-table-header-row'}
})
export class NgTableHeaderRow {

}
