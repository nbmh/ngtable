import { Component } from '@angular/core';

@Component({
  selector: 'ng-table-cell',
  template: `
  <ng-content></ng-content>
  `,
  host: {'class': 'ng-table-cell'}
})
export class NgTableCell {

}
