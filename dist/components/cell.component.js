import { Component } from '@angular/core';
import { NgTableRow } from './row.component';
var NgTableCell = (function () {
    function NgTableCell(parent) {
        this.parent = parent;
    }
    return NgTableCell;
}());
export { NgTableCell };
NgTableCell.decorators = [
    { type: Component, args: [{
                selector: 'ng-table-cell',
                template: "\n  <ng-content></ng-content>\n  ",
                host: { 'class': 'ng-table-cell' }
            },] },
];
/** @nocollapse */
NgTableCell.ctorParameters = function () { return [
    { type: NgTableRow, },
]; };
//# sourceMappingURL=cell.component.js.map