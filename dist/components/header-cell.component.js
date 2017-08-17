import { Component } from '@angular/core';
import { NgTableHeaderRow } from './header-row.component';
var NgTableHeaderCell = (function () {
    function NgTableHeaderCell(parent) {
        this.parent = parent;
    }
    return NgTableHeaderCell;
}());
export { NgTableHeaderCell };
NgTableHeaderCell.decorators = [
    { type: Component, args: [{
                selector: 'ng-table-header-cell',
                template: "\n  <ng-content></ng-content>\n  ",
                host: { 'class': 'ng-table-header-cell' }
            },] },
];
/** @nocollapse */
NgTableHeaderCell.ctorParameters = function () { return [
    { type: NgTableHeaderRow, },
]; };
//# sourceMappingURL=header-cell.component.js.map