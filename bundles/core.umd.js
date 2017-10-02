(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('@angular/flex-layout'), require('@angular/forms'), require('@angular/platform-browser'), require('@angular/platform-browser/animations'), require('@angular/router'), require('hammerjs'), require('@angular/material'), require('rxjs/Rx')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/common', '@angular/core', '@angular/flex-layout', '@angular/forms', '@angular/platform-browser', '@angular/platform-browser/animations', '@angular/router', 'hammerjs', '@angular/material', 'rxjs/Rx'], factory) :
	(factory((global.ngtable = {}),global._angular_common,global.ng.core,global._angular_flexLayout,global._angular_forms,global._angular_platformBrowser,global._angular_platformBrowser_animations,global._angular_router,null,global._angular_material,global.rxjs_Rx));
}(this, (function (exports,_angular_common,_angular_core,_angular_flexLayout,_angular_forms,_angular_platformBrowser,_angular_platformBrowser_animations,_angular_router,hammerjs,_angular_material,rxjs_Rx) { 'use strict';

var NgTableInitEvent = (function () {
    function NgTableInitEvent(table) {
        this._table = table;
    }
    Object.defineProperty(NgTableInitEvent.prototype, "table", {
        get: function () {
            return this._table;
        },
        enumerable: true,
        configurable: true
    });
    return NgTableInitEvent;
}());
var NgTableDestroyEvent = (function () {
    function NgTableDestroyEvent(table) {
        this._table = table;
    }
    Object.defineProperty(NgTableDestroyEvent.prototype, "table", {
        get: function () {
            return this._table;
        },
        enumerable: true,
        configurable: true
    });
    return NgTableDestroyEvent;
}());
var NgTableBeforeConnectEvent = (function () {
    function NgTableBeforeConnectEvent(table, params) {
        this._table = table;
        this._params = params;
    }
    Object.defineProperty(NgTableBeforeConnectEvent.prototype, "table", {
        get: function () {
            return this._table;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTableBeforeConnectEvent.prototype, "params", {
        get: function () {
            return this._params;
        },
        enumerable: true,
        configurable: true
    });
    return NgTableBeforeConnectEvent;
}());
var NgTableAfterConnectEvent = (function () {
    function NgTableAfterConnectEvent(table, result) {
        this._table = table;
        this._result = result;
    }
    Object.defineProperty(NgTableAfterConnectEvent.prototype, "table", {
        get: function () {
            return this._table;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTableAfterConnectEvent.prototype, "result", {
        get: function () {
            return this._result;
        },
        enumerable: true,
        configurable: true
    });
    return NgTableAfterConnectEvent;
}());
var NgTableRangeEvent = (function () {
    function NgTableRangeEvent(table, range, options) {
        this._table = table;
        this._range = range;
        this._options = options;
    }
    Object.defineProperty(NgTableRangeEvent.prototype, "table", {
        get: function () {
            return this._table;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTableRangeEvent.prototype, "range", {
        get: function () {
            return this._range;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTableRangeEvent.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    return NgTableRangeEvent;
}());

var NgTable = (function () {
    function NgTable(activeRoute) {
        this.activeRoute = activeRoute;
        this._rows = [];
        this._totalRows = 0;
        this._page = 1;
        this._totalPages = 0;
        this._from = 0;
        this._to = 0;
        this._initialized = false;
        this._queryPage = 'page';
        this.initEmitter = new _angular_core.EventEmitter();
        this.destroyEmitter = new _angular_core.EventEmitter();
        this.beforeConnectEmitter = new _angular_core.EventEmitter();
        this.afterConnectEmitter = new _angular_core.EventEmitter();
        this.rangeChangeEmitter = new _angular_core.EventEmitter();
    }
    NgTable.prototype.ngOnInit = function () {
    };
    NgTable.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.initEmitter.emit(new NgTableInitEvent(this));
        this._querySubscriber = this.activeRoute.queryParams.debounceTime(10).subscribe(function (params) {
            _this._initialized = true;
            _this._page = params[_this._queryPage] ? +params[_this._queryPage] : 1;
            _this.requestData();
        });
    };
    NgTable.prototype.ngOnDestroy = function () {
        if (this._dataSourceSubscriber) {
            this._dataSourceSubscriber.unsubscribe();
            this._dataSourceSubscriber = null;
        }
        this._querySubscriber.unsubscribe();
        this.destroyEmitter.emit(new NgTableDestroyEvent(this));
    };
    Object.defineProperty(NgTable.prototype, "dataSource", {
        set: function (source) {
            var _this = this;
            this._dataSource = source;
            if (this._dataSourceSubscriber) {
                this._dataSourceSubscriber.unsubscribe();
            }
            this._dataSourceSubscriber = this._dataSource.connection.subscribe(function (result) {
                if (result) {
                    _this.calculate(result.data, result.totalRows);
                    _this.afterConnectEmitter.emit(new NgTableAfterConnectEvent(_this, result));
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    NgTable.prototype.calculate = function (rows, totalRows) {
        this._rows = rows;
        this._totalRows = totalRows;
        this._totalPages = Math.ceil(this._totalRows / this._dataSource.range);
        if (this._page > this._totalPages) {
            this._page = 1;
        }
        this._from = ((this._page - 1) * this._dataSource.range) + 1;
        this._to = this._from + this._dataSource.range - 1;
        if (this._to > this._totalRows) {
            this._to = this._totalRows;
        }
    };
    NgTable.prototype.requestData = function () {
        if (!this._dataSource.loading) {
            this._dataSource.params.offset = (this._page - 1) * this._dataSource.range;
            this.beforeConnectEmitter.emit(new NgTableBeforeConnectEvent(this, this._dataSource.params));
            this._dataSource.getData(this._dataSource.params);
        }
    };
    NgTable.prototype.removeRow = function (row) {
        var index = this._rows.indexOf(row);
        if (index > -1) {
            this._rows.splice(index, 1);
        }
        this.calculate(this._rows, this.totalRows - 1);
        return this;
    };
    NgTable.prototype.updateRow = function (row) {
        var index = this._rows.indexOf(row);
        if (index > -1) {
            this._rows.splice(index, 1, row);
        }
        return this;
    };
    NgTable.prototype.addRow = function (row) {
        this._rows.push(row);
        this.calculate(this._rows, this.totalRows + 1);
        return this;
    };
    Object.defineProperty(NgTable.prototype, "rows", {
        get: function () {
            return this._rows;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTable.prototype, "queryPage", {
        set: function (name) {
            this._queryPage = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTable.prototype, "page", {
        get: function () {
            return this._page;
        },
        set: function (index) {
            if (!this._dataSource.loading) {
                this._page = +index;
                if (this._page < 1) {
                    this._page = 1;
                }
                if (this._page > this._totalPages) {
                    this._page = this._totalPages;
                    if (this._page < 1) {
                        this._page = 1;
                    }
                }
                this.requestData();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTable.prototype, "totalPages", {
        get: function () {
            return this._totalPages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTable.prototype, "totalRows", {
        get: function () {
            return this._totalRows;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTable.prototype, "from", {
        get: function () {
            return this._from;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTable.prototype, "to", {
        get: function () {
            return this._to;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTable.prototype, "range", {
        get: function () {
            return this._dataSource.range;
        },
        set: function (value) {
            if (!this._dataSource.loading) {
                this._dataSource.range = +value;
                this.rangeChangeEmitter.emit(new NgTableRangeEvent(this, this.range, this.rangeOptions));
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTable.prototype, "rangeOptions", {
        get: function () {
            return this._dataSource.rangeOptions;
        },
        set: function (value) {
            this._dataSource.rangeOptions = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTable.prototype, "initialized", {
        get: function () {
            return this._initialized;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTable.prototype, "loading", {
        get: function () {
            return this._dataSource.loading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTable.prototype, "empty", {
        get: function () {
            return this._totalRows == 0;
        },
        enumerable: true,
        configurable: true
    });
    NgTable.prototype.refresh = function () {
        this.page = this._page;
        return this;
    };
    NgTable.prototype.prev = function () {
        this._page--;
        if (this._page < 1) {
            this._page = 1;
        }
        this.page = this._page;
        return this;
    };
    NgTable.prototype.next = function () {
        this._page++;
        var pagesMax = this.totalPages;
        if (this._page > pagesMax) {
            this._page = pagesMax;
        }
        this.page = this._page;
        return this;
    };
    Object.defineProperty(NgTable.prototype, "hasPrev", {
        get: function () {
            return this._page > 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTable.prototype, "hasNext", {
        get: function () {
            return this._page < this._totalPages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTable.prototype, "isFirst", {
        get: function () {
            return this._page == 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTable.prototype, "isLast", {
        get: function () {
            return this._page == this._totalPages;
        },
        enumerable: true,
        configurable: true
    });
    return NgTable;
}());
NgTable.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ng-table',
                template: "\n  <ng-content></ng-content>\n  ",
                styles: ["\n:host(.ng-table) {\n  background: #fff;\n  overflow: auto;\n  display: flex;\n  flex-direction: column;\n}\n\n:host(.ng-table) /deep/ .ng-table-header-row,\n:host(.ng-table) /deep/ .ng-table-row {\n  border-bottom-color: rgba(0, 0, 0, .12);\n  display: flex;\n  border-bottom-width: 1px;\n  border-bottom-style: solid;\n  align-items: center;\n  min-height: 48px;\n  padding: 0 12px;\n}\n\n:host(.ng-table) /deep/ .ng-table-header-cell {\n  font-size: 12px;\n  font-weight: 500;\n  color: rgba(0, 0, 0, .54);\n  flex: 1;\n}\n\n:host(.ng-table) /deep/ .ng-table-cell {\n  font-size: 14px;\n  color: rgba(0,0,0,.87);\n  flex: 1;\n}\n\n:host(.ng-table) /deep/ .ng-table-icon {\n  width: 40px;\n  height: 40px;\n}\n\n:host(.ng-table-striped) /deep/ .ng-table-row:nth-of-type(odd) {\n  background-color: #f9f9f9;\n}\n\n:host(.ng-table-striped.ng-table-hover) /deep/ .ng-table-row:hover {\n  background-color: #f5f5f5;\n}\n  "],
                host: { 'class': 'ng-table' }
            },] },
];
/** @nocollapse */
NgTable.ctorParameters = function () { return [
    { type: _angular_router.ActivatedRoute, },
]; };
NgTable.propDecorators = {
    'initEmitter': [{ type: _angular_core.Output, args: ['init',] },],
    'destroyEmitter': [{ type: _angular_core.Output, args: ['destroy',] },],
    'beforeConnectEmitter': [{ type: _angular_core.Output, args: ['beforeConnect',] },],
    'afterConnectEmitter': [{ type: _angular_core.Output, args: ['afterConnect',] },],
    'rangeChangeEmitter': [{ type: _angular_core.Output, args: ['rangeChange',] },],
    'dataSource': [{ type: _angular_core.Input },],
    'queryPage': [{ type: _angular_core.Input },],
    'page': [{ type: _angular_core.Input },],
    'range': [{ type: _angular_core.Input },],
    'rangeOptions': [{ type: _angular_core.Input },],
};

var NgTableRow = (function () {
    function NgTableRow(parent) {
        this.parent = parent;
    }
    return NgTableRow;
}());
NgTableRow.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ng-table-row',
                template: "\n  <ng-content></ng-content>\n  ",
                host: { 'class': 'ng-table-row' }
            },] },
];
/** @nocollapse */
NgTableRow.ctorParameters = function () { return [
    { type: NgTable, },
]; };

var NgTableCell = (function () {
    function NgTableCell(parent) {
        this.parent = parent;
    }
    return NgTableCell;
}());
NgTableCell.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ng-table-cell',
                template: "\n  <ng-content></ng-content>\n  ",
                host: { 'class': 'ng-table-cell' }
            },] },
];
/** @nocollapse */
NgTableCell.ctorParameters = function () { return [
    { type: NgTableRow, },
]; };

var NgTableHeaderRow = (function () {
    function NgTableHeaderRow(parent) {
        this.parent = parent;
    }
    return NgTableHeaderRow;
}());
NgTableHeaderRow.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ng-table-header-row',
                template: "\n  <ng-content></ng-content>\n  ",
                host: { 'class': 'ng-table-header-row' }
            },] },
];
/** @nocollapse */
NgTableHeaderRow.ctorParameters = function () { return [
    { type: NgTable, },
]; };

var NgTableHeaderCell = (function () {
    function NgTableHeaderCell(parent) {
        this.parent = parent;
    }
    return NgTableHeaderCell;
}());
NgTableHeaderCell.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ng-table-header-cell',
                template: "\n  <ng-content></ng-content>\n  ",
                host: { 'class': 'ng-table-header-cell' }
            },] },
];
/** @nocollapse */
NgTableHeaderCell.ctorParameters = function () { return [
    { type: NgTableHeaderRow, },
]; };

var NgTablePaginator = (function () {
    function NgTablePaginator() {
        this._rangeVisible = true;
        this._label = {
            items_per_page: 'Items per page',
            page: 'Page',
            of_page: 'of',
            items: 'Items',
            of_items: 'of',
        };
    }
    Object.defineProperty(NgTablePaginator.prototype, "label", {
        get: function () {
            return this._label;
        },
        set: function (value) {
            this._label = Object.assign({}, this._label, value);
        },
        enumerable: true,
        configurable: true
    });
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
NgTablePaginator.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ng-table-paginator',
                template: "\n<div class=\"ng-table-paginator-page-size\" *ngIf=\"rangeVisible && !table.empty\">\n  <div class=\"ng-table-paginator-page-size-label\">\n    {{label.items_per_page}}\n  </div>\n  <md-select class=\"ng-table-paginator-page-size-select\" [(ngModel)]=\"table.range\" (change)=\"actionRange($event)\" [disabled]=\"table.loading\">\n    <md-option *ngFor=\"let count of table.rangeOptions\" [value]=\"count\">\n      {{count}}\n    </md-option>\n  </md-select>\n</div>\n<div class=\"ng-table-paginator-page-label\" *ngIf=\"!table.empty\">\n  {{label.page}} {{table.page}} {{label.of_page}} {{table.totalPages}} |\n  {{label.items}} <span *ngIf=\"table.rows.length > 1\">{{table.from}} - {{table.to}}</span>\n  <span *ngIf=\"table.rows.length == 1\">{{table.from}}</span>\n  {{label.of_items}} {{table.totalRows}}\n</div>\n<button md-icon-button *ngIf=\"!table.empty\" (click)=\"table.prev()\" [disabled]=\"!table.hasPrev || table.loading\" mdTooltip=\"Previous page\"><md-icon class=\"material-icons\">navigate_before</md-icon></button>\n<button md-icon-button *ngIf=\"!table.empty\" (click)=\"table.next()\" [disabled]=\"!table.hasNext || table.loading\" mdTooltip=\"Next page\"><md-icon class=\"material-icons\">navigate_next</md-icon></button>\n  ",
                styles: ["\n:host(.ng-table-paginator) {\n  font-family: Roboto,Helvetica Neue,sans-serif;\n  font-size: 12px;\n  background: #fff;\n  color: rgba(0,0,0,.54);\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  min-height: 56px;\n  padding: 0 8px;\n}\n\n:host(.ng-table-paginator) /deep/ .ng-table-paginator-page-size {\n  display: flex;\n  align-items: center;\n}\n\n:host(.ng-table-paginator) /deep/ .ng-table-paginator-page-size-label {\n  margin: 0 8px 0 0;\n}\n\n:host(.ng-table-paginator) /deep/ .ng-table-paginator-page-size-select .mat-select-trigger {\n  min-width: 60px;\n  font-size: 12px;\n}\n\n:host(.ng-table-paginator) /deep/ .ng-table-paginator-page-label {\n  margin: 0 32px;\n}\n  "],
                host: { 'class': 'ng-table-paginator' }
            },] },
];
/** @nocollapse */
NgTablePaginator.ctorParameters = function () { return []; };
NgTablePaginator.propDecorators = {
    'table': [{ type: _angular_core.Input },],
    'label': [{ type: _angular_core.Input, args: ['labels',] },],
    'ngTable': [{ type: _angular_core.Input },],
    'rangeVisible': [{ type: _angular_core.Input },],
};

var NgTableSource = (function () {
    function NgTableSource() {
        this._range = null;
        this._rangeOptions = [5, 10, 20, 50];
        this._params = null;
        this._loading = false;
        this._dataChange = new rxjs_Rx.BehaviorSubject(null);
    }
    Object.defineProperty(NgTableSource.prototype, "loading", {
        get: function () {
            return this._loading;
        },
        enumerable: true,
        configurable: true
    });
    NgTableSource.prototype.getData = function (params) {
        this._loading = true;
        this.source(params);
    };
    NgTableSource.prototype.updateData = function (result) {
        this._loading = false;
        this._dataChange.next(result);
    };
    Object.defineProperty(NgTableSource.prototype, "connection", {
        get: function () {
            return this._dataChange;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTableSource.prototype, "params", {
        get: function () {
            return this._params;
        },
        set: function (value) {
            var wasSet = this._params != null;
            this._params = value;
            if (!this._loading && wasSet) {
                this.getData(this.params);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTableSource.prototype, "range", {
        get: function () {
            return this._range || 10;
        },
        set: function (value) {
            var wasSet = this._range != null;
            this._range = value;
            if (!this._loading && wasSet) {
                this.getData(this.params);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTableSource.prototype, "rangeOptions", {
        get: function () {
            return this._rangeOptions;
        },
        set: function (options) {
            this._rangeOptions = options;
        },
        enumerable: true,
        configurable: true
    });
    return NgTableSource;
}());

var NgTableSourceResult = (function () {
    function NgTableSourceResult(data, totalRows) {
        this._totalRows = 0;
        this._data = data;
        this._totalRows = totalRows;
    }
    Object.defineProperty(NgTableSourceResult.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTableSourceResult.prototype, "totalRows", {
        get: function () {
            return this._totalRows;
        },
        enumerable: true,
        configurable: true
    });
    NgTableSourceResult.create = function (rows, totalRows) {
        return new NgTableSourceResult(rows, totalRows);
    };
    NgTableSourceResult.singlePage = function (source, rows) {
        var list = [];
        var index = 0;
        var params = source.params;
        rows.forEach(function (row) {
            if (index >= params.offset && index < params.offset + source.range) {
                list.push(row);
            }
            index++;
        });
        return new NgTableSourceResult(list, rows.length);
    };
    return NgTableSourceResult;
}());

var routes = [];
var NgTableRoutingModule = (function () {
    function NgTableRoutingModule() {
    }
    return NgTableRoutingModule;
}());
NgTableRoutingModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [_angular_router.RouterModule.forRoot(routes)],
                exports: [_angular_router.RouterModule]
            },] },
];
/** @nocollapse */
NgTableRoutingModule.ctorParameters = function () { return []; };
var NgTableModule = (function () {
    function NgTableModule() {
    }
    return NgTableModule;
}());
NgTableModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    _angular_platformBrowser.BrowserModule,
                    _angular_platformBrowser_animations.BrowserAnimationsModule,
                    _angular_common.CommonModule,
                    _angular_forms.FormsModule,
                    _angular_flexLayout.FlexLayoutModule,
                    NgTableRoutingModule,
                    _angular_material.MdSelectModule,
                    _angular_material.MdButtonModule
                ],
                declarations: [
                    NgTable,
                    NgTableHeaderRow,
                    NgTableHeaderCell,
                    NgTableRow,
                    NgTableCell,
                    NgTablePaginator
                ],
                providers: [],
                exports: [
                    NgTable,
                    NgTableHeaderRow,
                    NgTableHeaderCell,
                    NgTableRow,
                    NgTableCell,
                    NgTablePaginator
                ]
            },] },
];
/** @nocollapse */
NgTableModule.ctorParameters = function () { return []; };

exports.NgTableRoutingModule = NgTableRoutingModule;
exports.NgTableModule = NgTableModule;
exports.NgTableInitEvent = NgTableInitEvent;
exports.NgTableDestroyEvent = NgTableDestroyEvent;
exports.NgTableBeforeConnectEvent = NgTableBeforeConnectEvent;
exports.NgTableAfterConnectEvent = NgTableAfterConnectEvent;
exports.NgTableRangeEvent = NgTableRangeEvent;
exports.NgTableSource = NgTableSource;
exports.NgTableSourceResult = NgTableSourceResult;
exports.NgTable = NgTable;
exports.NgTableHeaderRow = NgTableHeaderRow;
exports.NgTableHeaderCell = NgTableHeaderCell;
exports.NgTableRow = NgTableRow;
exports.NgTableCell = NgTableCell;
exports.NgTablePaginator = NgTablePaginator;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS51bWQuanMiLCJzb3VyY2VzIjpbIi4uL2Rpc3Qvbmd0YWJsZS5ldmVudHMuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50LmpzIiwiLi4vZGlzdC9jb21wb25lbnRzL3Jvdy5jb21wb25lbnQuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvY2VsbC5jb21wb25lbnQuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvaGVhZGVyLXJvdy5jb21wb25lbnQuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvaGVhZGVyLWNlbGwuY29tcG9uZW50LmpzIiwiLi4vZGlzdC9jb21wb25lbnRzL3BhZ2luYXRvci5jb21wb25lbnQuanMiLCIuLi9kaXN0L25ndGFibGUuc291cmNlLmpzIiwiLi4vZGlzdC9uZ3RhYmxlLnJlc3VsdC5qcyIsIi4uL2Rpc3QvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBOZ1RhYmxlSW5pdEV2ZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlSW5pdEV2ZW50KHRhYmxlKSB7XG4gICAgICAgIHRoaXMuX3RhYmxlID0gdGFibGU7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlSW5pdEV2ZW50LnByb3RvdHlwZSwgXCJ0YWJsZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gTmdUYWJsZUluaXRFdmVudDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlSW5pdEV2ZW50IH07XG52YXIgTmdUYWJsZURlc3Ryb3lFdmVudCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZURlc3Ryb3lFdmVudCh0YWJsZSkge1xuICAgICAgICB0aGlzLl90YWJsZSA9IHRhYmxlO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZURlc3Ryb3lFdmVudC5wcm90b3R5cGUsIFwidGFibGVcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90YWJsZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVEZXN0cm95RXZlbnQ7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZURlc3Ryb3lFdmVudCB9O1xudmFyIE5nVGFibGVCZWZvcmVDb25uZWN0RXZlbnQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVCZWZvcmVDb25uZWN0RXZlbnQodGFibGUsIHBhcmFtcykge1xuICAgICAgICB0aGlzLl90YWJsZSA9IHRhYmxlO1xuICAgICAgICB0aGlzLl9wYXJhbXMgPSBwYXJhbXM7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlQmVmb3JlQ29ubmVjdEV2ZW50LnByb3RvdHlwZSwgXCJ0YWJsZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZUJlZm9yZUNvbm5lY3RFdmVudC5wcm90b3R5cGUsIFwicGFyYW1zXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFyYW1zO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gTmdUYWJsZUJlZm9yZUNvbm5lY3RFdmVudDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlQmVmb3JlQ29ubmVjdEV2ZW50IH07XG52YXIgTmdUYWJsZUFmdGVyQ29ubmVjdEV2ZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQodGFibGUsIHJlc3VsdCkge1xuICAgICAgICB0aGlzLl90YWJsZSA9IHRhYmxlO1xuICAgICAgICB0aGlzLl9yZXN1bHQgPSByZXN1bHQ7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQucHJvdG90eXBlLCBcInRhYmxlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFibGU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQucHJvdG90eXBlLCBcInJlc3VsdFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VsdDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVBZnRlckNvbm5lY3RFdmVudDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQgfTtcbnZhciBOZ1RhYmxlUmFuZ2VFdmVudCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZVJhbmdlRXZlbnQodGFibGUsIHJhbmdlLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX3RhYmxlID0gdGFibGU7XG4gICAgICAgIHRoaXMuX3JhbmdlID0gcmFuZ2U7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVJhbmdlRXZlbnQucHJvdG90eXBlLCBcInRhYmxlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFibGU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlUmFuZ2VFdmVudC5wcm90b3R5cGUsIFwicmFuZ2VcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yYW5nZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVSYW5nZUV2ZW50LnByb3RvdHlwZSwgXCJvcHRpb25zXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVSYW5nZUV2ZW50O1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVSYW5nZUV2ZW50IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1uZ3RhYmxlLmV2ZW50cy5qcy5tYXAiLCJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgTmdUYWJsZUluaXRFdmVudCwgTmdUYWJsZVJhbmdlRXZlbnQsIE5nVGFibGVCZWZvcmVDb25uZWN0RXZlbnQsIE5nVGFibGVBZnRlckNvbm5lY3RFdmVudCwgTmdUYWJsZURlc3Ryb3lFdmVudCB9IGZyb20gJy4uL25ndGFibGUuZXZlbnRzJztcbnZhciBOZ1RhYmxlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlKGFjdGl2ZVJvdXRlKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlUm91dGUgPSBhY3RpdmVSb3V0ZTtcbiAgICAgICAgdGhpcy5fcm93cyA9IFtdO1xuICAgICAgICB0aGlzLl90b3RhbFJvd3MgPSAwO1xuICAgICAgICB0aGlzLl9wYWdlID0gMTtcbiAgICAgICAgdGhpcy5fdG90YWxQYWdlcyA9IDA7XG4gICAgICAgIHRoaXMuX2Zyb20gPSAwO1xuICAgICAgICB0aGlzLl90byA9IDA7XG4gICAgICAgIHRoaXMuX2luaXRpYWxpemVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3F1ZXJ5UGFnZSA9ICdwYWdlJztcbiAgICAgICAgdGhpcy5pbml0RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5kZXN0cm95RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5iZWZvcmVDb25uZWN0RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5hZnRlckNvbm5lY3RFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLnJhbmdlQ2hhbmdlRW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICB9XG4gICAgTmdUYWJsZS5wcm90b3R5cGUubmdPbkluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgfTtcbiAgICBOZ1RhYmxlLnByb3RvdHlwZS5uZ0FmdGVyVmlld0luaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuaW5pdEVtaXR0ZXIuZW1pdChuZXcgTmdUYWJsZUluaXRFdmVudCh0aGlzKSk7XG4gICAgICAgIHRoaXMuX3F1ZXJ5U3Vic2NyaWJlciA9IHRoaXMuYWN0aXZlUm91dGUucXVlcnlQYXJhbXMuZGVib3VuY2VUaW1lKDEwKS5zdWJzY3JpYmUoZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgX3RoaXMuX2luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgICAgIF90aGlzLl9wYWdlID0gcGFyYW1zW190aGlzLl9xdWVyeVBhZ2VdID8gK3BhcmFtc1tfdGhpcy5fcXVlcnlQYWdlXSA6IDE7XG4gICAgICAgICAgICBfdGhpcy5yZXF1ZXN0RGF0YSgpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5nVGFibGUucHJvdG90eXBlLm5nT25EZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fZGF0YVNvdXJjZVN1YnNjcmliZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2RhdGFTb3VyY2VTdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlU3Vic2NyaWJlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcXVlcnlTdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHRoaXMuZGVzdHJveUVtaXR0ZXIuZW1pdChuZXcgTmdUYWJsZURlc3Ryb3lFdmVudCh0aGlzKSk7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiZGF0YVNvdXJjZVwiLCB7XG4gICAgICAgIHNldDogZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuX2RhdGFTb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgICAgICBpZiAodGhpcy5fZGF0YVNvdXJjZVN1YnNjcmliZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlU3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZVN1YnNjcmliZXIgPSB0aGlzLl9kYXRhU291cmNlLmNvbm5lY3Rpb24uc3Vic2NyaWJlKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmNhbGN1bGF0ZShyZXN1bHQuZGF0YSwgcmVzdWx0LnRvdGFsUm93cyk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmFmdGVyQ29ubmVjdEVtaXR0ZXIuZW1pdChuZXcgTmdUYWJsZUFmdGVyQ29ubmVjdEV2ZW50KF90aGlzLCByZXN1bHQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTmdUYWJsZS5wcm90b3R5cGUuY2FsY3VsYXRlID0gZnVuY3Rpb24gKHJvd3MsIHRvdGFsUm93cykge1xuICAgICAgICB0aGlzLl9yb3dzID0gcm93cztcbiAgICAgICAgdGhpcy5fdG90YWxSb3dzID0gdG90YWxSb3dzO1xuICAgICAgICB0aGlzLl90b3RhbFBhZ2VzID0gTWF0aC5jZWlsKHRoaXMuX3RvdGFsUm93cyAvIHRoaXMuX2RhdGFTb3VyY2UucmFuZ2UpO1xuICAgICAgICBpZiAodGhpcy5fcGFnZSA+IHRoaXMuX3RvdGFsUGFnZXMpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhZ2UgPSAxO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2Zyb20gPSAoKHRoaXMuX3BhZ2UgLSAxKSAqIHRoaXMuX2RhdGFTb3VyY2UucmFuZ2UpICsgMTtcbiAgICAgICAgdGhpcy5fdG8gPSB0aGlzLl9mcm9tICsgdGhpcy5fZGF0YVNvdXJjZS5yYW5nZSAtIDE7XG4gICAgICAgIGlmICh0aGlzLl90byA+IHRoaXMuX3RvdGFsUm93cykge1xuICAgICAgICAgICAgdGhpcy5fdG8gPSB0aGlzLl90b3RhbFJvd3M7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE5nVGFibGUucHJvdG90eXBlLnJlcXVlc3REYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2RhdGFTb3VyY2UubG9hZGluZykge1xuICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZS5wYXJhbXMub2Zmc2V0ID0gKHRoaXMuX3BhZ2UgLSAxKSAqIHRoaXMuX2RhdGFTb3VyY2UucmFuZ2U7XG4gICAgICAgICAgICB0aGlzLmJlZm9yZUNvbm5lY3RFbWl0dGVyLmVtaXQobmV3IE5nVGFibGVCZWZvcmVDb25uZWN0RXZlbnQodGhpcywgdGhpcy5fZGF0YVNvdXJjZS5wYXJhbXMpKTtcbiAgICAgICAgICAgIHRoaXMuX2RhdGFTb3VyY2UuZ2V0RGF0YSh0aGlzLl9kYXRhU291cmNlLnBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE5nVGFibGUucHJvdG90eXBlLnJlbW92ZVJvdyA9IGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5fcm93cy5pbmRleE9mKHJvdyk7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9yb3dzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYWxjdWxhdGUodGhpcy5fcm93cywgdGhpcy50b3RhbFJvd3MgLSAxKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOZ1RhYmxlLnByb3RvdHlwZS51cGRhdGVSb3cgPSBmdW5jdGlvbiAocm93KSB7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuX3Jvd3MuaW5kZXhPZihyb3cpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5fcm93cy5zcGxpY2UoaW5kZXgsIDEsIHJvdyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOZ1RhYmxlLnByb3RvdHlwZS5hZGRSb3cgPSBmdW5jdGlvbiAocm93KSB7XG4gICAgICAgIHRoaXMuX3Jvd3MucHVzaChyb3cpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZSh0aGlzLl9yb3dzLCB0aGlzLnRvdGFsUm93cyArIDEpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJyb3dzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcm93cztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcInF1ZXJ5UGFnZVwiLCB7XG4gICAgICAgIHNldDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3F1ZXJ5UGFnZSA9IG5hbWU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJwYWdlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFnZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fZGF0YVNvdXJjZS5sb2FkaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGFnZSA9ICtpbmRleDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fcGFnZSA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFnZSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9wYWdlID4gdGhpcy5fdG90YWxQYWdlcykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYWdlID0gdGhpcy5fdG90YWxQYWdlcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3BhZ2UgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYWdlID0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3REYXRhKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJ0b3RhbFBhZ2VzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG90YWxQYWdlcztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcInRvdGFsUm93c1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvdGFsUm93cztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcImZyb21cIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mcm9tO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwidG9cIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90bztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcInJhbmdlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVNvdXJjZS5yYW5nZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fZGF0YVNvdXJjZS5sb2FkaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZS5yYW5nZSA9ICt2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnJhbmdlQ2hhbmdlRW1pdHRlci5lbWl0KG5ldyBOZ1RhYmxlUmFuZ2VFdmVudCh0aGlzLCB0aGlzLnJhbmdlLCB0aGlzLnJhbmdlT3B0aW9ucykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwicmFuZ2VPcHRpb25zXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVNvdXJjZS5yYW5nZU9wdGlvbnM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlLnJhbmdlT3B0aW9ucyA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiaW5pdGlhbGl6ZWRcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbml0aWFsaXplZDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcImxvYWRpbmdcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhU291cmNlLmxvYWRpbmc7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJlbXB0eVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvdGFsUm93cyA9PSAwO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBOZ1RhYmxlLnByb3RvdHlwZS5yZWZyZXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnBhZ2UgPSB0aGlzLl9wYWdlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE5nVGFibGUucHJvdG90eXBlLnByZXYgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3BhZ2UtLTtcbiAgICAgICAgaWYgKHRoaXMuX3BhZ2UgPCAxKSB7XG4gICAgICAgICAgICB0aGlzLl9wYWdlID0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhZ2UgPSB0aGlzLl9wYWdlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE5nVGFibGUucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3BhZ2UrKztcbiAgICAgICAgdmFyIHBhZ2VzTWF4ID0gdGhpcy50b3RhbFBhZ2VzO1xuICAgICAgICBpZiAodGhpcy5fcGFnZSA+IHBhZ2VzTWF4KSB7XG4gICAgICAgICAgICB0aGlzLl9wYWdlID0gcGFnZXNNYXg7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYWdlID0gdGhpcy5fcGFnZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiaGFzUHJldlwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2UgPiAxO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiaGFzTmV4dFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2UgPCB0aGlzLl90b3RhbFBhZ2VzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiaXNGaXJzdFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2UgPT0gMTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcImlzTGFzdFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2UgPT0gdGhpcy5fdG90YWxQYWdlcztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGU7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZSB9O1xuTmdUYWJsZS5kZWNvcmF0b3JzID0gW1xuICAgIHsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnbmctdGFibGUnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBcIlxcbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxcbiAgXCIsXG4gICAgICAgICAgICAgICAgc3R5bGVzOiBbXCJcXG46aG9zdCgubmctdGFibGUpIHtcXG4gIGJhY2tncm91bmQ6ICNmZmY7XFxuICBvdmVyZmxvdzogYXV0bztcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUpIC9kZWVwLyAubmctdGFibGUtaGVhZGVyLXJvdyxcXG46aG9zdCgubmctdGFibGUpIC9kZWVwLyAubmctdGFibGUtcm93IHtcXG4gIGJvcmRlci1ib3R0b20tY29sb3I6IHJnYmEoMCwgMCwgMCwgLjEyKTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBib3JkZXItYm90dG9tLXdpZHRoOiAxcHg7XFxuICBib3JkZXItYm90dG9tLXN0eWxlOiBzb2xpZDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBtaW4taGVpZ2h0OiA0OHB4O1xcbiAgcGFkZGluZzogMCAxMnB4O1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUpIC9kZWVwLyAubmctdGFibGUtaGVhZGVyLWNlbGwge1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbiAgZm9udC13ZWlnaHQ6IDUwMDtcXG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC41NCk7XFxuICBmbGV4OiAxO1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUpIC9kZWVwLyAubmctdGFibGUtY2VsbCB7XFxuICBmb250LXNpemU6IDE0cHg7XFxuICBjb2xvcjogcmdiYSgwLDAsMCwuODcpO1xcbiAgZmxleDogMTtcXG59XFxuXFxuOmhvc3QoLm5nLXRhYmxlKSAvZGVlcC8gLm5nLXRhYmxlLWljb24ge1xcbiAgd2lkdGg6IDQwcHg7XFxuICBoZWlnaHQ6IDQwcHg7XFxufVxcblxcbjpob3N0KC5uZy10YWJsZS1zdHJpcGVkKSAvZGVlcC8gLm5nLXRhYmxlLXJvdzpudGgtb2YtdHlwZShvZGQpIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmOWY5Zjk7XFxufVxcblxcbjpob3N0KC5uZy10YWJsZS1zdHJpcGVkLm5nLXRhYmxlLWhvdmVyKSAvZGVlcC8gLm5nLXRhYmxlLXJvdzpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjVmNWY1O1xcbn1cXG4gIFwiXSxcbiAgICAgICAgICAgICAgICBob3N0OiB7ICdjbGFzcyc6ICduZy10YWJsZScgfVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlLmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW1xuICAgIHsgdHlwZTogQWN0aXZhdGVkUm91dGUsIH0sXG5dOyB9O1xuTmdUYWJsZS5wcm9wRGVjb3JhdG9ycyA9IHtcbiAgICAnaW5pdEVtaXR0ZXInOiBbeyB0eXBlOiBPdXRwdXQsIGFyZ3M6IFsnaW5pdCcsXSB9LF0sXG4gICAgJ2Rlc3Ryb3lFbWl0dGVyJzogW3sgdHlwZTogT3V0cHV0LCBhcmdzOiBbJ2Rlc3Ryb3knLF0gfSxdLFxuICAgICdiZWZvcmVDb25uZWN0RW1pdHRlcic6IFt7IHR5cGU6IE91dHB1dCwgYXJnczogWydiZWZvcmVDb25uZWN0JyxdIH0sXSxcbiAgICAnYWZ0ZXJDb25uZWN0RW1pdHRlcic6IFt7IHR5cGU6IE91dHB1dCwgYXJnczogWydhZnRlckNvbm5lY3QnLF0gfSxdLFxuICAgICdyYW5nZUNoYW5nZUVtaXR0ZXInOiBbeyB0eXBlOiBPdXRwdXQsIGFyZ3M6IFsncmFuZ2VDaGFuZ2UnLF0gfSxdLFxuICAgICdkYXRhU291cmNlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuICAgICdxdWVyeVBhZ2UnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4gICAgJ3BhZ2UnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4gICAgJ3JhbmdlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuICAgICdyYW5nZU9wdGlvbnMnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFibGUuY29tcG9uZW50LmpzLm1hcCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdUYWJsZSB9IGZyb20gJy4vdGFibGUuY29tcG9uZW50JztcbnZhciBOZ1RhYmxlUm93ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlUm93KHBhcmVudCkge1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB9XG4gICAgcmV0dXJuIE5nVGFibGVSb3c7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZVJvdyB9O1xuTmdUYWJsZVJvdy5kZWNvcmF0b3JzID0gW1xuICAgIHsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnbmctdGFibGUtcm93JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogXCJcXG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cXG4gIFwiLFxuICAgICAgICAgICAgICAgIGhvc3Q6IHsgJ2NsYXNzJzogJ25nLXRhYmxlLXJvdycgfVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlUm93LmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW1xuICAgIHsgdHlwZTogTmdUYWJsZSwgfSxcbl07IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yb3cuY29tcG9uZW50LmpzLm1hcCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdUYWJsZVJvdyB9IGZyb20gJy4vcm93LmNvbXBvbmVudCc7XG52YXIgTmdUYWJsZUNlbGwgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVDZWxsKHBhcmVudCkge1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB9XG4gICAgcmV0dXJuIE5nVGFibGVDZWxsO1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVDZWxsIH07XG5OZ1RhYmxlQ2VsbC5kZWNvcmF0b3JzID0gW1xuICAgIHsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnbmctdGFibGUtY2VsbCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiXFxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XFxuICBcIixcbiAgICAgICAgICAgICAgICBob3N0OiB7ICdjbGFzcyc6ICduZy10YWJsZS1jZWxsJyB9XG4gICAgICAgICAgICB9LF0gfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbk5nVGFibGVDZWxsLmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW1xuICAgIHsgdHlwZTogTmdUYWJsZVJvdywgfSxcbl07IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jZWxsLmNvbXBvbmVudC5qcy5tYXAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nVGFibGUgfSBmcm9tICcuL3RhYmxlLmNvbXBvbmVudCc7XG52YXIgTmdUYWJsZUhlYWRlclJvdyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZUhlYWRlclJvdyhwYXJlbnQpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBOZ1RhYmxlSGVhZGVyUm93O1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVIZWFkZXJSb3cgfTtcbk5nVGFibGVIZWFkZXJSb3cuZGVjb3JhdG9ycyA9IFtcbiAgICB7IHR5cGU6IENvbXBvbmVudCwgYXJnczogW3tcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ25nLXRhYmxlLWhlYWRlci1yb3cnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBcIlxcbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxcbiAgXCIsXG4gICAgICAgICAgICAgICAgaG9zdDogeyAnY2xhc3MnOiAnbmctdGFibGUtaGVhZGVyLXJvdycgfVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlSGVhZGVyUm93LmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW1xuICAgIHsgdHlwZTogTmdUYWJsZSwgfSxcbl07IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oZWFkZXItcm93LmNvbXBvbmVudC5qcy5tYXAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nVGFibGVIZWFkZXJSb3cgfSBmcm9tICcuL2hlYWRlci1yb3cuY29tcG9uZW50JztcbnZhciBOZ1RhYmxlSGVhZGVyQ2VsbCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZUhlYWRlckNlbGwocGFyZW50KSB7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIH1cbiAgICByZXR1cm4gTmdUYWJsZUhlYWRlckNlbGw7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZUhlYWRlckNlbGwgfTtcbk5nVGFibGVIZWFkZXJDZWxsLmRlY29yYXRvcnMgPSBbXG4gICAgeyB0eXBlOiBDb21wb25lbnQsIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICduZy10YWJsZS1oZWFkZXItY2VsbCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiXFxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XFxuICBcIixcbiAgICAgICAgICAgICAgICBob3N0OiB7ICdjbGFzcyc6ICduZy10YWJsZS1oZWFkZXItY2VsbCcgfVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlSGVhZGVyQ2VsbC5jdG9yUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtcbiAgICB7IHR5cGU6IE5nVGFibGVIZWFkZXJSb3csIH0sXG5dOyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGVhZGVyLWNlbGwuY29tcG9uZW50LmpzLm1hcCIsImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbnZhciBOZ1RhYmxlUGFnaW5hdG9yID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlUGFnaW5hdG9yKCkge1xuICAgICAgICB0aGlzLl9yYW5nZVZpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLl9sYWJlbCA9IHtcbiAgICAgICAgICAgIGl0ZW1zX3Blcl9wYWdlOiAnSXRlbXMgcGVyIHBhZ2UnLFxuICAgICAgICAgICAgcGFnZTogJ1BhZ2UnLFxuICAgICAgICAgICAgb2ZfcGFnZTogJ29mJyxcbiAgICAgICAgICAgIGl0ZW1zOiAnSXRlbXMnLFxuICAgICAgICAgICAgb2ZfaXRlbXM6ICdvZicsXG4gICAgICAgIH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlUGFnaW5hdG9yLnByb3RvdHlwZSwgXCJsYWJlbFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xhYmVsO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fbGFiZWwgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9sYWJlbCwgdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVBhZ2luYXRvci5wcm90b3R5cGUsIFwibmdUYWJsZVwiLCB7XG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnRhYmxlID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlUGFnaW5hdG9yLnByb3RvdHlwZSwgXCJyYW5nZVZpc2libGVcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yYW5nZVZpc2libGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHN0YXR1cykge1xuICAgICAgICAgICAgdGhpcy5fcmFuZ2VWaXNpYmxlID0gc3RhdHVzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBOZ1RhYmxlUGFnaW5hdG9yLnByb3RvdHlwZS5hY3Rpb25SYW5nZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh0aGlzLnRhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLnRhYmxlLnJhbmdlID0gK2UudmFsdWU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBOZ1RhYmxlUGFnaW5hdG9yO1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVQYWdpbmF0b3IgfTtcbk5nVGFibGVQYWdpbmF0b3IuZGVjb3JhdG9ycyA9IFtcbiAgICB7IHR5cGU6IENvbXBvbmVudCwgYXJnczogW3tcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ25nLXRhYmxlLXBhZ2luYXRvcicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiXFxuPGRpdiBjbGFzcz1cXFwibmctdGFibGUtcGFnaW5hdG9yLXBhZ2Utc2l6ZVxcXCIgKm5nSWY9XFxcInJhbmdlVmlzaWJsZSAmJiAhdGFibGUuZW1wdHlcXFwiPlxcbiAgPGRpdiBjbGFzcz1cXFwibmctdGFibGUtcGFnaW5hdG9yLXBhZ2Utc2l6ZS1sYWJlbFxcXCI+XFxuICAgIHt7bGFiZWwuaXRlbXNfcGVyX3BhZ2V9fVxcbiAgPC9kaXY+XFxuICA8bWQtc2VsZWN0IGNsYXNzPVxcXCJuZy10YWJsZS1wYWdpbmF0b3ItcGFnZS1zaXplLXNlbGVjdFxcXCIgWyhuZ01vZGVsKV09XFxcInRhYmxlLnJhbmdlXFxcIiAoY2hhbmdlKT1cXFwiYWN0aW9uUmFuZ2UoJGV2ZW50KVxcXCIgW2Rpc2FibGVkXT1cXFwidGFibGUubG9hZGluZ1xcXCI+XFxuICAgIDxtZC1vcHRpb24gKm5nRm9yPVxcXCJsZXQgY291bnQgb2YgdGFibGUucmFuZ2VPcHRpb25zXFxcIiBbdmFsdWVdPVxcXCJjb3VudFxcXCI+XFxuICAgICAge3tjb3VudH19XFxuICAgIDwvbWQtb3B0aW9uPlxcbiAgPC9tZC1zZWxlY3Q+XFxuPC9kaXY+XFxuPGRpdiBjbGFzcz1cXFwibmctdGFibGUtcGFnaW5hdG9yLXBhZ2UtbGFiZWxcXFwiICpuZ0lmPVxcXCIhdGFibGUuZW1wdHlcXFwiPlxcbiAge3tsYWJlbC5wYWdlfX0ge3t0YWJsZS5wYWdlfX0ge3tsYWJlbC5vZl9wYWdlfX0ge3t0YWJsZS50b3RhbFBhZ2VzfX0gfFxcbiAge3tsYWJlbC5pdGVtc319IDxzcGFuICpuZ0lmPVxcXCJ0YWJsZS5yb3dzLmxlbmd0aCA+IDFcXFwiPnt7dGFibGUuZnJvbX19IC0ge3t0YWJsZS50b319PC9zcGFuPlxcbiAgPHNwYW4gKm5nSWY9XFxcInRhYmxlLnJvd3MubGVuZ3RoID09IDFcXFwiPnt7dGFibGUuZnJvbX19PC9zcGFuPlxcbiAge3tsYWJlbC5vZl9pdGVtc319IHt7dGFibGUudG90YWxSb3dzfX1cXG48L2Rpdj5cXG48YnV0dG9uIG1kLWljb24tYnV0dG9uICpuZ0lmPVxcXCIhdGFibGUuZW1wdHlcXFwiIChjbGljayk9XFxcInRhYmxlLnByZXYoKVxcXCIgW2Rpc2FibGVkXT1cXFwiIXRhYmxlLmhhc1ByZXYgfHwgdGFibGUubG9hZGluZ1xcXCIgbWRUb29sdGlwPVxcXCJQcmV2aW91cyBwYWdlXFxcIj48bWQtaWNvbiBjbGFzcz1cXFwibWF0ZXJpYWwtaWNvbnNcXFwiPm5hdmlnYXRlX2JlZm9yZTwvbWQtaWNvbj48L2J1dHRvbj5cXG48YnV0dG9uIG1kLWljb24tYnV0dG9uICpuZ0lmPVxcXCIhdGFibGUuZW1wdHlcXFwiIChjbGljayk9XFxcInRhYmxlLm5leHQoKVxcXCIgW2Rpc2FibGVkXT1cXFwiIXRhYmxlLmhhc05leHQgfHwgdGFibGUubG9hZGluZ1xcXCIgbWRUb29sdGlwPVxcXCJOZXh0IHBhZ2VcXFwiPjxtZC1pY29uIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCI+bmF2aWdhdGVfbmV4dDwvbWQtaWNvbj48L2J1dHRvbj5cXG4gIFwiLFxuICAgICAgICAgICAgICAgIHN0eWxlczogW1wiXFxuOmhvc3QoLm5nLXRhYmxlLXBhZ2luYXRvcikge1xcbiAgZm9udC1mYW1pbHk6IFJvYm90byxIZWx2ZXRpY2EgTmV1ZSxzYW5zLXNlcmlmO1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbiAgYmFja2dyb3VuZDogI2ZmZjtcXG4gIGNvbG9yOiByZ2JhKDAsMCwwLC41NCk7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XFxuICBtaW4taGVpZ2h0OiA1NnB4O1xcbiAgcGFkZGluZzogMCA4cHg7XFxufVxcblxcbjpob3N0KC5uZy10YWJsZS1wYWdpbmF0b3IpIC9kZWVwLyAubmctdGFibGUtcGFnaW5hdG9yLXBhZ2Utc2l6ZSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuOmhvc3QoLm5nLXRhYmxlLXBhZ2luYXRvcikgL2RlZXAvIC5uZy10YWJsZS1wYWdpbmF0b3ItcGFnZS1zaXplLWxhYmVsIHtcXG4gIG1hcmdpbjogMCA4cHggMCAwO1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUtcGFnaW5hdG9yKSAvZGVlcC8gLm5nLXRhYmxlLXBhZ2luYXRvci1wYWdlLXNpemUtc2VsZWN0IC5tYXQtc2VsZWN0LXRyaWdnZXIge1xcbiAgbWluLXdpZHRoOiA2MHB4O1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUtcGFnaW5hdG9yKSAvZGVlcC8gLm5nLXRhYmxlLXBhZ2luYXRvci1wYWdlLWxhYmVsIHtcXG4gIG1hcmdpbjogMCAzMnB4O1xcbn1cXG4gIFwiXSxcbiAgICAgICAgICAgICAgICBob3N0OiB7ICdjbGFzcyc6ICduZy10YWJsZS1wYWdpbmF0b3InIH1cbiAgICAgICAgICAgIH0sXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuTmdUYWJsZVBhZ2luYXRvci5jdG9yUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtdOyB9O1xuTmdUYWJsZVBhZ2luYXRvci5wcm9wRGVjb3JhdG9ycyA9IHtcbiAgICAndGFibGUnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4gICAgJ2xhYmVsJzogW3sgdHlwZTogSW5wdXQsIGFyZ3M6IFsnbGFiZWxzJyxdIH0sXSxcbiAgICAnbmdUYWJsZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbiAgICAncmFuZ2VWaXNpYmxlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhZ2luYXRvci5jb21wb25lbnQuanMubWFwIiwiaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcy9SeCc7XG52YXIgTmdUYWJsZVNvdXJjZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZVNvdXJjZSgpIHtcbiAgICAgICAgdGhpcy5fcmFuZ2UgPSBudWxsO1xuICAgICAgICB0aGlzLl9yYW5nZU9wdGlvbnMgPSBbNSwgMTAsIDIwLCA1MF07XG4gICAgICAgIHRoaXMuX3BhcmFtcyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZGF0YUNoYW5nZSA9IG5ldyBCZWhhdmlvclN1YmplY3QobnVsbCk7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlU291cmNlLnByb3RvdHlwZSwgXCJsb2FkaW5nXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9hZGluZztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTmdUYWJsZVNvdXJjZS5wcm90b3R5cGUuZ2V0RGF0YSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5fbG9hZGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuc291cmNlKHBhcmFtcyk7XG4gICAgfTtcbiAgICBOZ1RhYmxlU291cmNlLnByb3RvdHlwZS51cGRhdGVEYXRhID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICB0aGlzLl9sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2RhdGFDaGFuZ2UubmV4dChyZXN1bHQpO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2UucHJvdG90eXBlLCBcImNvbm5lY3Rpb25cIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhQ2hhbmdlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVNvdXJjZS5wcm90b3R5cGUsIFwicGFyYW1zXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFyYW1zO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHdhc1NldCA9IHRoaXMuX3BhcmFtcyAhPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fcGFyYW1zID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2xvYWRpbmcgJiYgd2FzU2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXREYXRhKHRoaXMucGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2UucHJvdG90eXBlLCBcInJhbmdlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmFuZ2UgfHwgMTA7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgd2FzU2V0ID0gdGhpcy5fcmFuZ2UgIT0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX3JhbmdlID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2xvYWRpbmcgJiYgd2FzU2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXREYXRhKHRoaXMucGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2UucHJvdG90eXBlLCBcInJhbmdlT3B0aW9uc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JhbmdlT3B0aW9ucztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5fcmFuZ2VPcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVTb3VyY2U7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZVNvdXJjZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bmd0YWJsZS5zb3VyY2UuanMubWFwIiwidmFyIE5nVGFibGVTb3VyY2VSZXN1bHQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVTb3VyY2VSZXN1bHQoZGF0YSwgdG90YWxSb3dzKSB7XG4gICAgICAgIHRoaXMuX3RvdGFsUm93cyA9IDA7XG4gICAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICAgICAgICB0aGlzLl90b3RhbFJvd3MgPSB0b3RhbFJvd3M7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlU291cmNlUmVzdWx0LnByb3RvdHlwZSwgXCJkYXRhXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2VSZXN1bHQucHJvdG90eXBlLCBcInRvdGFsUm93c1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvdGFsUm93cztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTmdUYWJsZVNvdXJjZVJlc3VsdC5jcmVhdGUgPSBmdW5jdGlvbiAocm93cywgdG90YWxSb3dzKSB7XG4gICAgICAgIHJldHVybiBuZXcgTmdUYWJsZVNvdXJjZVJlc3VsdChyb3dzLCB0b3RhbFJvd3MpO1xuICAgIH07XG4gICAgTmdUYWJsZVNvdXJjZVJlc3VsdC5zaW5nbGVQYWdlID0gZnVuY3Rpb24gKHNvdXJjZSwgcm93cykge1xuICAgICAgICB2YXIgbGlzdCA9IFtdO1xuICAgICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgICB2YXIgcGFyYW1zID0gc291cmNlLnBhcmFtcztcbiAgICAgICAgcm93cy5mb3JFYWNoKGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA+PSBwYXJhbXMub2Zmc2V0ICYmIGluZGV4IDwgcGFyYW1zLm9mZnNldCArIHNvdXJjZS5yYW5nZSkge1xuICAgICAgICAgICAgICAgIGxpc3QucHVzaChyb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBuZXcgTmdUYWJsZVNvdXJjZVJlc3VsdChsaXN0LCByb3dzLmxlbmd0aCk7XG4gICAgfTtcbiAgICByZXR1cm4gTmdUYWJsZVNvdXJjZVJlc3VsdDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlU291cmNlUmVzdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1uZ3RhYmxlLnJlc3VsdC5qcy5tYXAiLCJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZsZXhMYXlvdXRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dCc7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IEJyb3dzZXJBbmltYXRpb25zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7IFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgJ2hhbW1lcmpzJztcbmltcG9ydCB7IE5nVGFibGVDZWxsIH0gZnJvbSAnLi9jb21wb25lbnRzL2NlbGwuY29tcG9uZW50JztcbmltcG9ydCB7IE5nVGFibGVIZWFkZXJDZWxsIH0gZnJvbSAnLi9jb21wb25lbnRzL2hlYWRlci1jZWxsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ1RhYmxlSGVhZGVyUm93IH0gZnJvbSAnLi9jb21wb25lbnRzL2hlYWRlci1yb3cuY29tcG9uZW50JztcbmltcG9ydCB7IE5nVGFibGVQYWdpbmF0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvcGFnaW5hdG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ1RhYmxlUm93IH0gZnJvbSAnLi9jb21wb25lbnRzL3Jvdy5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmdUYWJsZSB9IGZyb20gJy4vY29tcG9uZW50cy90YWJsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWRCdXR0b25Nb2R1bGUsIE1kU2VsZWN0TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuZXhwb3J0IHsgTmdUYWJsZUluaXRFdmVudCwgTmdUYWJsZURlc3Ryb3lFdmVudCwgTmdUYWJsZUJlZm9yZUNvbm5lY3RFdmVudCwgTmdUYWJsZUFmdGVyQ29ubmVjdEV2ZW50LCBOZ1RhYmxlUmFuZ2VFdmVudCB9IGZyb20gJy4vbmd0YWJsZS5ldmVudHMnO1xuZXhwb3J0IHsgTmdUYWJsZVNvdXJjZSB9IGZyb20gJy4vbmd0YWJsZS5zb3VyY2UnO1xuZXhwb3J0IHsgTmdUYWJsZVNvdXJjZVJlc3VsdCB9IGZyb20gJy4vbmd0YWJsZS5yZXN1bHQnO1xuZXhwb3J0IHsgTmdUYWJsZSB9IGZyb20gJy4vY29tcG9uZW50cy90YWJsZS5jb21wb25lbnQnO1xuZXhwb3J0IHsgTmdUYWJsZUhlYWRlclJvdyB9IGZyb20gJy4vY29tcG9uZW50cy9oZWFkZXItcm93LmNvbXBvbmVudCc7XG5leHBvcnQgeyBOZ1RhYmxlSGVhZGVyQ2VsbCB9IGZyb20gJy4vY29tcG9uZW50cy9oZWFkZXItY2VsbC5jb21wb25lbnQnO1xuZXhwb3J0IHsgTmdUYWJsZVJvdyB9IGZyb20gJy4vY29tcG9uZW50cy9yb3cuY29tcG9uZW50JztcbmV4cG9ydCB7IE5nVGFibGVDZWxsIH0gZnJvbSAnLi9jb21wb25lbnRzL2NlbGwuY29tcG9uZW50JztcbmV4cG9ydCB7IE5nVGFibGVQYWdpbmF0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvcGFnaW5hdG9yLmNvbXBvbmVudCc7XG52YXIgcm91dGVzID0gW107XG52YXIgTmdUYWJsZVJvdXRpbmdNb2R1bGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVSb3V0aW5nTW9kdWxlKCkge1xuICAgIH1cbiAgICByZXR1cm4gTmdUYWJsZVJvdXRpbmdNb2R1bGU7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZVJvdXRpbmdNb2R1bGUgfTtcbk5nVGFibGVSb3V0aW5nTW9kdWxlLmRlY29yYXRvcnMgPSBbXG4gICAgeyB0eXBlOiBOZ01vZHVsZSwgYXJnczogW3tcbiAgICAgICAgICAgICAgICBpbXBvcnRzOiBbUm91dGVyTW9kdWxlLmZvclJvb3Qocm91dGVzKV0sXG4gICAgICAgICAgICAgICAgZXhwb3J0czogW1JvdXRlck1vZHVsZV1cbiAgICAgICAgICAgIH0sXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuTmdUYWJsZVJvdXRpbmdNb2R1bGUuY3RvclBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBbXTsgfTtcbnZhciBOZ1RhYmxlTW9kdWxlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlTW9kdWxlKCkge1xuICAgIH1cbiAgICByZXR1cm4gTmdUYWJsZU1vZHVsZTtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlTW9kdWxlIH07XG5OZ1RhYmxlTW9kdWxlLmRlY29yYXRvcnMgPSBbXG4gICAgeyB0eXBlOiBOZ01vZHVsZSwgYXJnczogW3tcbiAgICAgICAgICAgICAgICBpbXBvcnRzOiBbXG4gICAgICAgICAgICAgICAgICAgIEJyb3dzZXJNb2R1bGUsXG4gICAgICAgICAgICAgICAgICAgIEJyb3dzZXJBbmltYXRpb25zTW9kdWxlLFxuICAgICAgICAgICAgICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgICAgICAgICAgICAgIEZvcm1zTW9kdWxlLFxuICAgICAgICAgICAgICAgICAgICBGbGV4TGF5b3V0TW9kdWxlLFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlUm91dGluZ01vZHVsZSxcbiAgICAgICAgICAgICAgICAgICAgTWRTZWxlY3RNb2R1bGUsXG4gICAgICAgICAgICAgICAgICAgIE1kQnV0dG9uTW9kdWxlXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZSxcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZUhlYWRlclJvdyxcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZUhlYWRlckNlbGwsXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVSb3csXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVDZWxsLFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlUGFnaW5hdG9yXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtdLFxuICAgICAgICAgICAgICAgIGV4cG9ydHM6IFtcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZSxcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZUhlYWRlclJvdyxcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZUhlYWRlckNlbGwsXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVSb3csXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVDZWxsLFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlUGFnaW5hdG9yXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlTW9kdWxlLmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW107IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAuanMubWFwIl0sIm5hbWVzIjpbIkV2ZW50RW1pdHRlciIsIkNvbXBvbmVudCIsIkFjdGl2YXRlZFJvdXRlIiwiT3V0cHV0IiwiSW5wdXQiLCJCZWhhdmlvclN1YmplY3QiLCJOZ01vZHVsZSIsIlJvdXRlck1vZHVsZSIsIkJyb3dzZXJNb2R1bGUiLCJCcm93c2VyQW5pbWF0aW9uc01vZHVsZSIsIkNvbW1vbk1vZHVsZSIsIkZvcm1zTW9kdWxlIiwiRmxleExheW91dE1vZHVsZSIsIk1kU2VsZWN0TW9kdWxlIiwiTWRCdXR0b25Nb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUksZ0JBQWdCLElBQUksWUFBWTtJQUNoQyxTQUFTLGdCQUFnQixDQUFDLEtBQUssRUFBRTtRQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztLQUN2QjtJQUNELE1BQU0sQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtRQUN2RCxHQUFHLEVBQUUsWUFBWTtZQUNiLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUN0QjtRQUNELFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFlBQVksRUFBRSxJQUFJO0tBQ3JCLENBQUMsQ0FBQztJQUNILE9BQU8sZ0JBQWdCLENBQUM7Q0FDM0IsRUFBRSxDQUFDLENBQUM7QUFDTCxBQUNBLElBQUksbUJBQW1CLElBQUksWUFBWTtJQUNuQyxTQUFTLG1CQUFtQixDQUFDLEtBQUssRUFBRTtRQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztLQUN2QjtJQUNELE1BQU0sQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtRQUMxRCxHQUFHLEVBQUUsWUFBWTtZQUNiLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUN0QjtRQUNELFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFlBQVksRUFBRSxJQUFJO0tBQ3JCLENBQUMsQ0FBQztJQUNILE9BQU8sbUJBQW1CLENBQUM7Q0FDOUIsRUFBRSxDQUFDLENBQUM7QUFDTCxBQUNBLElBQUkseUJBQXlCLElBQUksWUFBWTtJQUN6QyxTQUFTLHlCQUF5QixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7UUFDOUMs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
