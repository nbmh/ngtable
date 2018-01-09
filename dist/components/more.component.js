import { Component, Input } from '@angular/core';
var NgTableMore = (function () {
    function NgTableMore() {
        this._rangeVisible = true;
        this._label = {
            items_per_page: 'Items per page',
            page: 'Page',
            of_page: 'of',
            items: 'Items',
            of_items: 'of',
        };
    }
    Object.defineProperty(NgTableMore.prototype, "label", {
        get: function () {
            return this._label;
        },
        set: function (value) {
            this._label = Object.assign({}, this._label, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTableMore.prototype, "ngTable", {
        set: function (value) {
            this.table = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTableMore.prototype, "rangeVisible", {
        get: function () {
            return this._rangeVisible;
        },
        set: function (status) {
            this._rangeVisible = status;
        },
        enumerable: true,
        configurable: true
    });
    NgTableMore.prototype.actionRange = function (e) {
        if (this.table) {
            this.table.range = +e.value;
        }
    };
    return NgTableMore;
}());
export { NgTableMore };
NgTableMore.decorators = [
    { type: Component, args: [{
                selector: 'ng-table-more',
                template: "\n    <button class=\"ng-table-more-button\" *ngIf=\"table.rows.length<table.totalRows\" (click)=\"table.more()\" title=\"Load more\">More</button>\n  ",
                styles: ["\n:host(.ng-table-more) {\n  font-family: Roboto,Helvetica Neue,sans-serif;\n  font-size: 12px;\n  background: #fff;\n  color: rgba(0,0,0,.54);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 56px;\n}\n\n:host(.ng-table-more) /deep/ .ng-table-more-button {\n  width: 100%;\n}\n  "],
                host: { 'class': 'ng-table-more' }
            },] },
];
/** @nocollapse */
NgTableMore.ctorParameters = function () { return []; };
NgTableMore.propDecorators = {
    'table': [{ type: Input },],
    'label': [{ type: Input, args: ['labels',] },],
    'ngTable': [{ type: Input },],
    'rangeVisible': [{ type: Input },],
};
//# sourceMappingURL=more.component.js.map