import { Component, Input } from '@angular/core';
var NgTablePaginator = (function () {
    function NgTablePaginator() {
        this._rangeVisible = true;
    }
    Object.defineProperty(NgTablePaginator.prototype, "ngTable", {
        set: function (value) {
            this.table = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTablePaginator.prototype, "rangeVisible", {
        get: function () {
            return this._rangeVisible;
        },
        set: function (status) {
            this._rangeVisible = status;
        },
        enumerable: true,
        configurable: true
    });
    NgTablePaginator.prototype.actionRange = function (e) {
        if (this.table) {
            this.table.range = +e.value;
        }
    };
    return NgTablePaginator;
}());
export { NgTablePaginator };
NgTablePaginator.decorators = [
    { type: Component, args: [{
                selector: 'ng-table-paginator',
                templateUrl: './paginator.component.html',
                styleUrls: ['./paginator.component.scss'],
                host: { 'class': 'ng-table-paginator' }
            },] },
];
/** @nocollapse */
NgTablePaginator.ctorParameters = function () { return []; };
NgTablePaginator.propDecorators = {
    'table': [{ type: Input },],
    'ngTable': [{ type: Input },],
    'rangeVisible': [{ type: Input },],
};
//# sourceMappingURL=paginator.component.js.map