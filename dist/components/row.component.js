import { Component } from '@angular/core';
import { NgTable } from './table.component';
var NgTableRow = (function () {
    function NgTableRow(parent) {
        this.parent = parent;
    }
    return NgTableRow;
}());
export { NgTableRow };
NgTableRow.decorators = [
    { type: Component, args: [{
                selector: 'ng-table-row',
                template: "\n  <ng-content></ng-content>\n  ",
                host: { 'class': 'ng-table-row' }
            },] },
];
/** @nocollapse */
NgTableRow.ctorParameters = function () { return [
    { type: NgTable, },
]; };
//# sourceMappingURL=row.component.js.map