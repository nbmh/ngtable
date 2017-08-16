import { Component } from '@angular/core';

@Component({
  selector: 'ng-table-row',
  template: `
  <ng-content></ng-content>
  `,
  host: {'class': 'ng-table-row'}
})
export class NgTableRow {

}
