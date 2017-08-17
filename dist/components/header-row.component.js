import { Component } from '@angular/core';
import { NgTable } from './table.component';
var NgTableHeaderRow = (function () {
    function NgTableHeaderRow(parent) {
        this.parent = parent;
    }
    return NgTableHeaderRow;
}());
export { NgTableHeaderRow };
NgTableHeaderRow.decorators = [
    { type: Component, args: [{
                selector: 'ng-table-header-row',
                template: "\n  <ng-content></ng-content>\n  ",
                host: { 'class': 'ng-table-header-row' }
            },] },
];
/** @nocollapse */
NgTableHeaderRow.ctorParameters = function () { return [
    { type: NgTable, },
]; };
//# sourceMappingURL=header-row.component.js.map