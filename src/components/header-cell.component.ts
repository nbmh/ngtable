import { Component } from '@angular/core';

@Component({
  selector: 'ng-table-header-cell',
  template: `
  <ng-content></ng-content>
  `,
  host: {'class': 'ng-table-header-cell'}
})
export class NgTableHeaderCell {

}
