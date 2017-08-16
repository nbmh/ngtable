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
                template: "\n<div class=\"ng-table-paginator-page-size\" *ngIf=\"rangeVisible && !table.empty\">\n  <div class=\"ng-table-paginator-page-size-label\">\n    Items per page\n  </div>\n  <md-select class=\"ng-table-paginator-page-size-select\" [(ngModel)]=\"table.range\" (change)=\"actionRange($event)\" [disabled]=\"table.loading\">\n    <md-option *ngFor=\"let count of table.rangeOptions\" [value]=\"count\">\n      {{count}}\n    </md-option>\n  </md-select>\n</div>\n<div class=\"ng-table-paginator-page-label\" *ngIf=\"!table.empty\">\n  Page {{table.page}} of {{table.totalPages}} |\n  Items <span *ngIf=\"table.rows.length > 1\">{{table.from}} - {{table.to}}</span>\n  <span *ngIf=\"table.rows.length == 1\">{{table.from}}</span>\n  of {{table.totalRows}}\n</div>\n<button md-icon-button *ngIf=\"!table.empty\" (click)=\"table.prev()\" [disabled]=\"!table.hasPrev || table.loading\" mdTooltip=\"Previous page\"><md-icon class=\"material-icons\">keyboard_arrow_left</md-icon></button>\n<button md-icon-button *ngIf=\"!table.empty\" (click)=\"table.next()\" [disabled]=\"!table.hasNext || table.loading\" mdTooltip=\"Next page\"><md-icon class=\"material-icons\">keyboard_arrow_right</md-icon></button>\n  ",
                styles: ["\n:host(.ng-table-paginator) /deep/ {\n  font-family: Roboto,Helvetica Neue,sans-serif;\n  font-size: 12px;\n  background: #fff;\n  color: rgba(0,0,0,.54);\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  min-height: 56px;\n  padding: 0 8px;\n\n  .ng-table-paginator-page-size {\n    display: flex;\n    align-items: center;\n\n    .ng-table-paginator-page-size-label {\n      margin: 0 8px 0 0;\n    }\n\n    .ng-table-paginator-page-size-select {\n\n      .mat-select-trigger {\n        min-width: 60px;\n        font-size: 12px;\n      }\n    }\n  }\n\n  .ng-table-paginator-page-label {\n    margin: 0 32px;\n  }\n}\n  "],
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