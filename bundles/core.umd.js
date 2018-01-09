(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('@angular/forms'), require('@angular/platform-browser'), require('@angular/platform-browser/animations'), require('@angular/router'), require('hammerjs'), require('rxjs/Rx')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/common', '@angular/core', '@angular/forms', '@angular/platform-browser', '@angular/platform-browser/animations', '@angular/router', 'hammerjs', 'rxjs/Rx'], factory) :
	(factory((global.ngtable = {}),global._angular_common,global.ng.core,global._angular_forms,global._angular_platformBrowser,global._angular_platformBrowser_animations,global._angular_router,null,global.rxjs_Rx));
}(this, (function (exports,_angular_common,_angular_core,_angular_forms,_angular_platformBrowser,_angular_platformBrowser_animations,_angular_router,hammerjs,rxjs_Rx) { 'use strict';

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
var NgTableSourceUpdateEvent = (function () {
    function NgTableSourceUpdateEvent(source, result) {
        this._source = source;
        this._result = result;
    }
    Object.defineProperty(NgTableSourceUpdateEvent.prototype, "source", {
        get: function () {
            return this._source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTableSourceUpdateEvent.prototype, "result", {
        get: function () {
            return this._result;
        },
        enumerable: true,
        configurable: true
    });
    return NgTableSourceUpdateEvent;
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
        this.sourceUpdateEmitter = new _angular_core.EventEmitter();
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
            this._dataSource.sourceUpdate.subscribe(function (e) {
                _this.sourceUpdateEmitter.emit(e);
            });
            this._dataSourceSubscriber = this._dataSource.connection.subscribe(function (result) {
                if (result) {
                    _this.calculate(result.data, result.totalRows);
                    var event_1 = new NgTableAfterConnectEvent(_this, result);
                    _this.afterConnectEmitter.emit(event_1);
                    _this._dataSource.afterConnect.emit(event_1);
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
            var event_2 = new NgTableBeforeConnectEvent(this, this._dataSource.params);
            this.beforeConnectEmitter.emit(event_2);
            this._dataSource.beforeConnect.emit(event_2);
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
    'sourceUpdateEmitter': [{ type: _angular_core.Output, args: ['sourceUpdate',] },],
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
                template: "\n<div class=\"ng-table-paginator-page-size\" *ngIf=\"rangeVisible && !table.empty\">\n  <div class=\"ng-table-paginator-page-size-label\">\n    {{label.items_per_page}}\n  </div>\n  <select class=\"ng-table-paginator-page-size-select\" [(ngModel)]=\"table.range\" (change)=\"actionRange($event)\" [disabled]=\"table.loading\">\n    <option *ngFor=\"let count of table.rangeOptions\" value=\"{{count}}\">{{count}}</option>\n  </select>\n</div>\n<div class=\"ng-table-paginator-page-label\" *ngIf=\"!table.empty\">\n  {{label.page}} {{table.page}} {{label.of_page}} {{table.totalPages}} |\n  {{label.items}} <span *ngIf=\"table.rows.length > 1\">{{table.from}} - {{table.to}}</span>\n  <span *ngIf=\"table.rows.length == 1\">{{table.from}}</span>\n  {{label.of_items}} {{table.totalRows}}\n</div>\n<button *ngIf=\"!table.empty\" (click)=\"table.prev()\" [disabled]=\"!table.hasPrev || table.loading\" mdTooltip=\"Previous page\" title=\"Previous\">\u21FD</button>\n<button *ngIf=\"!table.empty\" (click)=\"table.next()\" [disabled]=\"!table.hasNext || table.loading\" mdTooltip=\"Next page\" title=\"Next\">\u21FE</button>\n  ",
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
        this._sourceUpdate = new rxjs_Rx.BehaviorSubject(null);
        this.sourceUpdate = new _angular_core.EventEmitter();
        this.beforeConnect = new _angular_core.EventEmitter();
        this.afterConnect = new _angular_core.EventEmitter();
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
        this._sourceUpdate.next(result);
        this.sourceUpdate.emit(new NgTableSourceUpdateEvent(this, result));
    };
    Object.defineProperty(NgTableSource.prototype, "connection", {
        get: function () {
            return this._sourceUpdate;
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
    function NgTableSourceResult(_data, _totalRows, _additionalData) {
        if (_totalRows === void 0) { _totalRows = 0; }
        this._data = _data;
        this._totalRows = _totalRows;
        this._additionalData = _additionalData;
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
    Object.defineProperty(NgTableSourceResult.prototype, "additionalData", {
        get: function () {
            return this._additionalData;
        },
        enumerable: true,
        configurable: true
    });
    NgTableSourceResult.create = function (rows, totalRows, additionalData) {
        return new NgTableSourceResult(rows, totalRows, additionalData);
    };
    NgTableSourceResult.singlePage = function (source, rows, additionalData) {
        var list = [];
        var index = 0;
        var params = source.params;
        rows.forEach(function (row) {
            if (index >= params.offset && index < params.offset + source.range) {
                list.push(row);
            }
            index++;
        });
        return new NgTableSourceResult(list, rows.length, additionalData);
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
                    _angular_common.CommonModule,
                    _angular_platformBrowser.BrowserModule,
                    _angular_platformBrowser_animations.BrowserAnimationsModule,
                    NgTableRoutingModule,
                    _angular_forms.FormsModule
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS51bWQuanMiLCJzb3VyY2VzIjpbIi4uL2Rpc3Qvbmd0YWJsZS5ldmVudHMuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50LmpzIiwiLi4vZGlzdC9jb21wb25lbnRzL3Jvdy5jb21wb25lbnQuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvY2VsbC5jb21wb25lbnQuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvaGVhZGVyLXJvdy5jb21wb25lbnQuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvaGVhZGVyLWNlbGwuY29tcG9uZW50LmpzIiwiLi4vZGlzdC9jb21wb25lbnRzL3BhZ2luYXRvci5jb21wb25lbnQuanMiLCIuLi9kaXN0L25ndGFibGUuc291cmNlLmpzIiwiLi4vZGlzdC9uZ3RhYmxlLnJlc3VsdC5qcyIsIi4uL2Rpc3QvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBOZ1RhYmxlSW5pdEV2ZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlSW5pdEV2ZW50KHRhYmxlKSB7XG4gICAgICAgIHRoaXMuX3RhYmxlID0gdGFibGU7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlSW5pdEV2ZW50LnByb3RvdHlwZSwgXCJ0YWJsZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gTmdUYWJsZUluaXRFdmVudDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlSW5pdEV2ZW50IH07XG52YXIgTmdUYWJsZURlc3Ryb3lFdmVudCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZURlc3Ryb3lFdmVudCh0YWJsZSkge1xuICAgICAgICB0aGlzLl90YWJsZSA9IHRhYmxlO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZURlc3Ryb3lFdmVudC5wcm90b3R5cGUsIFwidGFibGVcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90YWJsZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVEZXN0cm95RXZlbnQ7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZURlc3Ryb3lFdmVudCB9O1xudmFyIE5nVGFibGVCZWZvcmVDb25uZWN0RXZlbnQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVCZWZvcmVDb25uZWN0RXZlbnQodGFibGUsIHBhcmFtcykge1xuICAgICAgICB0aGlzLl90YWJsZSA9IHRhYmxlO1xuICAgICAgICB0aGlzLl9wYXJhbXMgPSBwYXJhbXM7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlQmVmb3JlQ29ubmVjdEV2ZW50LnByb3RvdHlwZSwgXCJ0YWJsZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZUJlZm9yZUNvbm5lY3RFdmVudC5wcm90b3R5cGUsIFwicGFyYW1zXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFyYW1zO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gTmdUYWJsZUJlZm9yZUNvbm5lY3RFdmVudDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlQmVmb3JlQ29ubmVjdEV2ZW50IH07XG52YXIgTmdUYWJsZUFmdGVyQ29ubmVjdEV2ZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQodGFibGUsIHJlc3VsdCkge1xuICAgICAgICB0aGlzLl90YWJsZSA9IHRhYmxlO1xuICAgICAgICB0aGlzLl9yZXN1bHQgPSByZXN1bHQ7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQucHJvdG90eXBlLCBcInRhYmxlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFibGU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQucHJvdG90eXBlLCBcInJlc3VsdFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VsdDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVBZnRlckNvbm5lY3RFdmVudDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQgfTtcbnZhciBOZ1RhYmxlUmFuZ2VFdmVudCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZVJhbmdlRXZlbnQodGFibGUsIHJhbmdlLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX3RhYmxlID0gdGFibGU7XG4gICAgICAgIHRoaXMuX3JhbmdlID0gcmFuZ2U7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVJhbmdlRXZlbnQucHJvdG90eXBlLCBcInRhYmxlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFibGU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlUmFuZ2VFdmVudC5wcm90b3R5cGUsIFwicmFuZ2VcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yYW5nZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVSYW5nZUV2ZW50LnByb3RvdHlwZSwgXCJvcHRpb25zXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVSYW5nZUV2ZW50O1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVSYW5nZUV2ZW50IH07XG52YXIgTmdUYWJsZVNvdXJjZVVwZGF0ZUV2ZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlU291cmNlVXBkYXRlRXZlbnQoc291cmNlLCByZXN1bHQpIHtcbiAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlO1xuICAgICAgICB0aGlzLl9yZXN1bHQgPSByZXN1bHQ7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlU291cmNlVXBkYXRlRXZlbnQucHJvdG90eXBlLCBcInNvdXJjZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2VVcGRhdGVFdmVudC5wcm90b3R5cGUsIFwicmVzdWx0XCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVzdWx0O1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gTmdUYWJsZVNvdXJjZVVwZGF0ZUV2ZW50O1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVTb3VyY2VVcGRhdGVFdmVudCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bmd0YWJsZS5ldmVudHMuanMubWFwIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE5nVGFibGVBZnRlckNvbm5lY3RFdmVudCwgTmdUYWJsZUJlZm9yZUNvbm5lY3RFdmVudCwgTmdUYWJsZURlc3Ryb3lFdmVudCwgTmdUYWJsZUluaXRFdmVudCwgTmdUYWJsZVJhbmdlRXZlbnQgfSBmcm9tICcuLi9uZ3RhYmxlLmV2ZW50cyc7XG52YXIgTmdUYWJsZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZShhY3RpdmVSb3V0ZSkge1xuICAgICAgICB0aGlzLmFjdGl2ZVJvdXRlID0gYWN0aXZlUm91dGU7XG4gICAgICAgIHRoaXMuX3Jvd3MgPSBbXTtcbiAgICAgICAgdGhpcy5fdG90YWxSb3dzID0gMDtcbiAgICAgICAgdGhpcy5fcGFnZSA9IDE7XG4gICAgICAgIHRoaXMuX3RvdGFsUGFnZXMgPSAwO1xuICAgICAgICB0aGlzLl9mcm9tID0gMDtcbiAgICAgICAgdGhpcy5fdG8gPSAwO1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9xdWVyeVBhZ2UgPSAncGFnZSc7XG4gICAgICAgIHRoaXMuaW5pdEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMuZGVzdHJveUVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMuYmVmb3JlQ29ubmVjdEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMuc291cmNlVXBkYXRlRW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5hZnRlckNvbm5lY3RFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLnJhbmdlQ2hhbmdlRW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICB9XG4gICAgTmdUYWJsZS5wcm90b3R5cGUubmdPbkluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgfTtcbiAgICBOZ1RhYmxlLnByb3RvdHlwZS5uZ0FmdGVyVmlld0luaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuaW5pdEVtaXR0ZXIuZW1pdChuZXcgTmdUYWJsZUluaXRFdmVudCh0aGlzKSk7XG4gICAgICAgIHRoaXMuX3F1ZXJ5U3Vic2NyaWJlciA9IHRoaXMuYWN0aXZlUm91dGUucXVlcnlQYXJhbXMuZGVib3VuY2VUaW1lKDEwKS5zdWJzY3JpYmUoZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgX3RoaXMuX2luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgICAgIF90aGlzLl9wYWdlID0gcGFyYW1zW190aGlzLl9xdWVyeVBhZ2VdID8gK3BhcmFtc1tfdGhpcy5fcXVlcnlQYWdlXSA6IDE7XG4gICAgICAgICAgICBfdGhpcy5yZXF1ZXN0RGF0YSgpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5nVGFibGUucHJvdG90eXBlLm5nT25EZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fZGF0YVNvdXJjZVN1YnNjcmliZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2RhdGFTb3VyY2VTdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlU3Vic2NyaWJlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcXVlcnlTdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHRoaXMuZGVzdHJveUVtaXR0ZXIuZW1pdChuZXcgTmdUYWJsZURlc3Ryb3lFdmVudCh0aGlzKSk7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiZGF0YVNvdXJjZVwiLCB7XG4gICAgICAgIHNldDogZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuX2RhdGFTb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgICAgICBpZiAodGhpcy5fZGF0YVNvdXJjZVN1YnNjcmliZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlU3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZS5zb3VyY2VVcGRhdGUuc3Vic2NyaWJlKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc291cmNlVXBkYXRlRW1pdHRlci5lbWl0KGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlU3Vic2NyaWJlciA9IHRoaXMuX2RhdGFTb3VyY2UuY29ubmVjdGlvbi5zdWJzY3JpYmUoZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2FsY3VsYXRlKHJlc3VsdC5kYXRhLCByZXN1bHQudG90YWxSb3dzKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV2ZW50XzEgPSBuZXcgTmdUYWJsZUFmdGVyQ29ubmVjdEV2ZW50KF90aGlzLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5hZnRlckNvbm5lY3RFbWl0dGVyLmVtaXQoZXZlbnRfMSk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9kYXRhU291cmNlLmFmdGVyQ29ubmVjdC5lbWl0KGV2ZW50XzEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBOZ1RhYmxlLnByb3RvdHlwZS5jYWxjdWxhdGUgPSBmdW5jdGlvbiAocm93cywgdG90YWxSb3dzKSB7XG4gICAgICAgIHRoaXMuX3Jvd3MgPSByb3dzO1xuICAgICAgICB0aGlzLl90b3RhbFJvd3MgPSB0b3RhbFJvd3M7XG4gICAgICAgIHRoaXMuX3RvdGFsUGFnZXMgPSBNYXRoLmNlaWwodGhpcy5fdG90YWxSb3dzIC8gdGhpcy5fZGF0YVNvdXJjZS5yYW5nZSk7XG4gICAgICAgIGlmICh0aGlzLl9wYWdlID4gdGhpcy5fdG90YWxQYWdlcykge1xuICAgICAgICAgICAgdGhpcy5fcGFnZSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZnJvbSA9ICgodGhpcy5fcGFnZSAtIDEpICogdGhpcy5fZGF0YVNvdXJjZS5yYW5nZSkgKyAxO1xuICAgICAgICB0aGlzLl90byA9IHRoaXMuX2Zyb20gKyB0aGlzLl9kYXRhU291cmNlLnJhbmdlIC0gMTtcbiAgICAgICAgaWYgKHRoaXMuX3RvID4gdGhpcy5fdG90YWxSb3dzKSB7XG4gICAgICAgICAgICB0aGlzLl90byA9IHRoaXMuX3RvdGFsUm93cztcbiAgICAgICAgfVxuICAgIH07XG4gICAgTmdUYWJsZS5wcm90b3R5cGUucmVxdWVzdERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fZGF0YVNvdXJjZS5sb2FkaW5nKSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlLnBhcmFtcy5vZmZzZXQgPSAodGhpcy5fcGFnZSAtIDEpICogdGhpcy5fZGF0YVNvdXJjZS5yYW5nZTtcbiAgICAgICAgICAgIHZhciBldmVudF8yID0gbmV3IE5nVGFibGVCZWZvcmVDb25uZWN0RXZlbnQodGhpcywgdGhpcy5fZGF0YVNvdXJjZS5wYXJhbXMpO1xuICAgICAgICAgICAgdGhpcy5iZWZvcmVDb25uZWN0RW1pdHRlci5lbWl0KGV2ZW50XzIpO1xuICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZS5iZWZvcmVDb25uZWN0LmVtaXQoZXZlbnRfMik7XG4gICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlLmdldERhdGEodGhpcy5fZGF0YVNvdXJjZS5wYXJhbXMpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBOZ1RhYmxlLnByb3RvdHlwZS5yZW1vdmVSb3cgPSBmdW5jdGlvbiAocm93KSB7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuX3Jvd3MuaW5kZXhPZihyb3cpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5fcm93cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlKHRoaXMuX3Jvd3MsIHRoaXMudG90YWxSb3dzIC0gMSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTmdUYWJsZS5wcm90b3R5cGUudXBkYXRlUm93ID0gZnVuY3Rpb24gKHJvdykge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9yb3dzLmluZGV4T2Yocm93KTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX3Jvd3Muc3BsaWNlKGluZGV4LCAxLCByb3cpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTmdUYWJsZS5wcm90b3R5cGUuYWRkUm93ID0gZnVuY3Rpb24gKHJvdykge1xuICAgICAgICB0aGlzLl9yb3dzLnB1c2gocm93KTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGUodGhpcy5fcm93cywgdGhpcy50b3RhbFJvd3MgKyAxKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwicm93c1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jvd3M7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJxdWVyeVBhZ2VcIiwge1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLl9xdWVyeVBhZ2UgPSBuYW1lO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwicGFnZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2U7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2RhdGFTb3VyY2UubG9hZGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhZ2UgPSAraW5kZXg7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3BhZ2UgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhZ2UgPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fcGFnZSA+IHRoaXMuX3RvdGFsUGFnZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFnZSA9IHRoaXMuX3RvdGFsUGFnZXM7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9wYWdlIDwgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFnZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0RGF0YSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwidG90YWxQYWdlc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvdGFsUGFnZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJ0b3RhbFJvd3NcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3RhbFJvd3M7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJmcm9tXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZnJvbTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcInRvXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG87XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJyYW5nZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFTb3VyY2UucmFuZ2U7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2RhdGFTb3VyY2UubG9hZGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFTb3VyY2UucmFuZ2UgPSArdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5yYW5nZUNoYW5nZUVtaXR0ZXIuZW1pdChuZXcgTmdUYWJsZVJhbmdlRXZlbnQodGhpcywgdGhpcy5yYW5nZSwgdGhpcy5yYW5nZU9wdGlvbnMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcInJhbmdlT3B0aW9uc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFTb3VyY2UucmFuZ2VPcHRpb25zO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZS5yYW5nZU9wdGlvbnMgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcImluaXRpYWxpemVkXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW5pdGlhbGl6ZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJsb2FkaW5nXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVNvdXJjZS5sb2FkaW5nO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiZW1wdHlcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3RhbFJvd3MgPT0gMDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTmdUYWJsZS5wcm90b3R5cGUucmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5wYWdlID0gdGhpcy5fcGFnZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOZ1RhYmxlLnByb3RvdHlwZS5wcmV2ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9wYWdlLS07XG4gICAgICAgIGlmICh0aGlzLl9wYWdlIDwgMSkge1xuICAgICAgICAgICAgdGhpcy5fcGFnZSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYWdlID0gdGhpcy5fcGFnZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOZ1RhYmxlLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9wYWdlKys7XG4gICAgICAgIHZhciBwYWdlc01heCA9IHRoaXMudG90YWxQYWdlcztcbiAgICAgICAgaWYgKHRoaXMuX3BhZ2UgPiBwYWdlc01heCkge1xuICAgICAgICAgICAgdGhpcy5fcGFnZSA9IHBhZ2VzTWF4O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGFnZSA9IHRoaXMuX3BhZ2U7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcImhhc1ByZXZcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYWdlID4gMTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcImhhc05leHRcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYWdlIDwgdGhpcy5fdG90YWxQYWdlcztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcImlzRmlyc3RcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYWdlID09IDE7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJpc0xhc3RcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYWdlID09IHRoaXMuX3RvdGFsUGFnZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiBOZ1RhYmxlO1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGUgfTtcbk5nVGFibGUuZGVjb3JhdG9ycyA9IFtcbiAgICB7IHR5cGU6IENvbXBvbmVudCwgYXJnczogW3tcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ25nLXRhYmxlJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogXCJcXG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cXG4gIFwiLFxuICAgICAgICAgICAgICAgIHN0eWxlczogW1wiXFxuOmhvc3QoLm5nLXRhYmxlKSB7XFxuICBiYWNrZ3JvdW5kOiAjZmZmO1xcbiAgb3ZlcmZsb3c6IGF1dG87XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuOmhvc3QoLm5nLXRhYmxlKSAvZGVlcC8gLm5nLXRhYmxlLWhlYWRlci1yb3csXFxuOmhvc3QoLm5nLXRhYmxlKSAvZGVlcC8gLm5nLXRhYmxlLXJvdyB7XFxuICBib3JkZXItYm90dG9tLWNvbG9yOiByZ2JhKDAsIDAsIDAsIC4xMik7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYm9yZGVyLWJvdHRvbS13aWR0aDogMXB4O1xcbiAgYm9yZGVyLWJvdHRvbS1zdHlsZTogc29saWQ7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgbWluLWhlaWdodDogNDhweDtcXG4gIHBhZGRpbmc6IDAgMTJweDtcXG59XFxuXFxuOmhvc3QoLm5nLXRhYmxlKSAvZGVlcC8gLm5nLXRhYmxlLWhlYWRlci1jZWxsIHtcXG4gIGZvbnQtc2l6ZTogMTJweDtcXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XFxuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuNTQpO1xcbiAgZmxleDogMTtcXG59XFxuXFxuOmhvc3QoLm5nLXRhYmxlKSAvZGVlcC8gLm5nLXRhYmxlLWNlbGwge1xcbiAgZm9udC1zaXplOiAxNHB4O1xcbiAgY29sb3I6IHJnYmEoMCwwLDAsLjg3KTtcXG4gIGZsZXg6IDE7XFxufVxcblxcbjpob3N0KC5uZy10YWJsZSkgL2RlZXAvIC5uZy10YWJsZS1pY29uIHtcXG4gIHdpZHRoOiA0MHB4O1xcbiAgaGVpZ2h0OiA0MHB4O1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUtc3RyaXBlZCkgL2RlZXAvIC5uZy10YWJsZS1yb3c6bnRoLW9mLXR5cGUob2RkKSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjlmOWY5O1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUtc3RyaXBlZC5uZy10YWJsZS1ob3ZlcikgL2RlZXAvIC5uZy10YWJsZS1yb3c6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y1ZjVmNTtcXG59XFxuICBcIl0sXG4gICAgICAgICAgICAgICAgaG9zdDogeyAnY2xhc3MnOiAnbmctdGFibGUnIH1cbiAgICAgICAgICAgIH0sXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuTmdUYWJsZS5jdG9yUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtcbiAgICB7IHR5cGU6IEFjdGl2YXRlZFJvdXRlLCB9LFxuXTsgfTtcbk5nVGFibGUucHJvcERlY29yYXRvcnMgPSB7XG4gICAgJ2luaXRFbWl0dGVyJzogW3sgdHlwZTogT3V0cHV0LCBhcmdzOiBbJ2luaXQnLF0gfSxdLFxuICAgICdkZXN0cm95RW1pdHRlcic6IFt7IHR5cGU6IE91dHB1dCwgYXJnczogWydkZXN0cm95JyxdIH0sXSxcbiAgICAnYmVmb3JlQ29ubmVjdEVtaXR0ZXInOiBbeyB0eXBlOiBPdXRwdXQsIGFyZ3M6IFsnYmVmb3JlQ29ubmVjdCcsXSB9LF0sXG4gICAgJ3NvdXJjZVVwZGF0ZUVtaXR0ZXInOiBbeyB0eXBlOiBPdXRwdXQsIGFyZ3M6IFsnc291cmNlVXBkYXRlJyxdIH0sXSxcbiAgICAnYWZ0ZXJDb25uZWN0RW1pdHRlcic6IFt7IHR5cGU6IE91dHB1dCwgYXJnczogWydhZnRlckNvbm5lY3QnLF0gfSxdLFxuICAgICdyYW5nZUNoYW5nZUVtaXR0ZXInOiBbeyB0eXBlOiBPdXRwdXQsIGFyZ3M6IFsncmFuZ2VDaGFuZ2UnLF0gfSxdLFxuICAgICdkYXRhU291cmNlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuICAgICdxdWVyeVBhZ2UnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4gICAgJ3BhZ2UnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4gICAgJ3JhbmdlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuICAgICdyYW5nZU9wdGlvbnMnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFibGUuY29tcG9uZW50LmpzLm1hcCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdUYWJsZSB9IGZyb20gJy4vdGFibGUuY29tcG9uZW50JztcbnZhciBOZ1RhYmxlUm93ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlUm93KHBhcmVudCkge1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB9XG4gICAgcmV0dXJuIE5nVGFibGVSb3c7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZVJvdyB9O1xuTmdUYWJsZVJvdy5kZWNvcmF0b3JzID0gW1xuICAgIHsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnbmctdGFibGUtcm93JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogXCJcXG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cXG4gIFwiLFxuICAgICAgICAgICAgICAgIGhvc3Q6IHsgJ2NsYXNzJzogJ25nLXRhYmxlLXJvdycgfVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlUm93LmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW1xuICAgIHsgdHlwZTogTmdUYWJsZSwgfSxcbl07IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yb3cuY29tcG9uZW50LmpzLm1hcCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdUYWJsZVJvdyB9IGZyb20gJy4vcm93LmNvbXBvbmVudCc7XG52YXIgTmdUYWJsZUNlbGwgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVDZWxsKHBhcmVudCkge1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB9XG4gICAgcmV0dXJuIE5nVGFibGVDZWxsO1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVDZWxsIH07XG5OZ1RhYmxlQ2VsbC5kZWNvcmF0b3JzID0gW1xuICAgIHsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnbmctdGFibGUtY2VsbCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiXFxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XFxuICBcIixcbiAgICAgICAgICAgICAgICBob3N0OiB7ICdjbGFzcyc6ICduZy10YWJsZS1jZWxsJyB9XG4gICAgICAgICAgICB9LF0gfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbk5nVGFibGVDZWxsLmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW1xuICAgIHsgdHlwZTogTmdUYWJsZVJvdywgfSxcbl07IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jZWxsLmNvbXBvbmVudC5qcy5tYXAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nVGFibGUgfSBmcm9tICcuL3RhYmxlLmNvbXBvbmVudCc7XG52YXIgTmdUYWJsZUhlYWRlclJvdyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZUhlYWRlclJvdyhwYXJlbnQpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBOZ1RhYmxlSGVhZGVyUm93O1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVIZWFkZXJSb3cgfTtcbk5nVGFibGVIZWFkZXJSb3cuZGVjb3JhdG9ycyA9IFtcbiAgICB7IHR5cGU6IENvbXBvbmVudCwgYXJnczogW3tcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ25nLXRhYmxlLWhlYWRlci1yb3cnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBcIlxcbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxcbiAgXCIsXG4gICAgICAgICAgICAgICAgaG9zdDogeyAnY2xhc3MnOiAnbmctdGFibGUtaGVhZGVyLXJvdycgfVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlSGVhZGVyUm93LmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW1xuICAgIHsgdHlwZTogTmdUYWJsZSwgfSxcbl07IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oZWFkZXItcm93LmNvbXBvbmVudC5qcy5tYXAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nVGFibGVIZWFkZXJSb3cgfSBmcm9tICcuL2hlYWRlci1yb3cuY29tcG9uZW50JztcbnZhciBOZ1RhYmxlSGVhZGVyQ2VsbCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZUhlYWRlckNlbGwocGFyZW50KSB7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIH1cbiAgICByZXR1cm4gTmdUYWJsZUhlYWRlckNlbGw7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZUhlYWRlckNlbGwgfTtcbk5nVGFibGVIZWFkZXJDZWxsLmRlY29yYXRvcnMgPSBbXG4gICAgeyB0eXBlOiBDb21wb25lbnQsIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICduZy10YWJsZS1oZWFkZXItY2VsbCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiXFxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XFxuICBcIixcbiAgICAgICAgICAgICAgICBob3N0OiB7ICdjbGFzcyc6ICduZy10YWJsZS1oZWFkZXItY2VsbCcgfVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlSGVhZGVyQ2VsbC5jdG9yUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtcbiAgICB7IHR5cGU6IE5nVGFibGVIZWFkZXJSb3csIH0sXG5dOyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGVhZGVyLWNlbGwuY29tcG9uZW50LmpzLm1hcCIsImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbnZhciBOZ1RhYmxlUGFnaW5hdG9yID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlUGFnaW5hdG9yKCkge1xuICAgICAgICB0aGlzLl9yYW5nZVZpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLl9sYWJlbCA9IHtcbiAgICAgICAgICAgIGl0ZW1zX3Blcl9wYWdlOiAnSXRlbXMgcGVyIHBhZ2UnLFxuICAgICAgICAgICAgcGFnZTogJ1BhZ2UnLFxuICAgICAgICAgICAgb2ZfcGFnZTogJ29mJyxcbiAgICAgICAgICAgIGl0ZW1zOiAnSXRlbXMnLFxuICAgICAgICAgICAgb2ZfaXRlbXM6ICdvZicsXG4gICAgICAgIH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlUGFnaW5hdG9yLnByb3RvdHlwZSwgXCJsYWJlbFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xhYmVsO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fbGFiZWwgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9sYWJlbCwgdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVBhZ2luYXRvci5wcm90b3R5cGUsIFwibmdUYWJsZVwiLCB7XG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnRhYmxlID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlUGFnaW5hdG9yLnByb3RvdHlwZSwgXCJyYW5nZVZpc2libGVcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yYW5nZVZpc2libGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHN0YXR1cykge1xuICAgICAgICAgICAgdGhpcy5fcmFuZ2VWaXNpYmxlID0gc3RhdHVzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBOZ1RhYmxlUGFnaW5hdG9yLnByb3RvdHlwZS5hY3Rpb25SYW5nZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh0aGlzLnRhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLnRhYmxlLnJhbmdlID0gK2UudmFsdWU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBOZ1RhYmxlUGFnaW5hdG9yO1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVQYWdpbmF0b3IgfTtcbk5nVGFibGVQYWdpbmF0b3IuZGVjb3JhdG9ycyA9IFtcbiAgICB7IHR5cGU6IENvbXBvbmVudCwgYXJnczogW3tcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ25nLXRhYmxlLXBhZ2luYXRvcicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiXFxuPGRpdiBjbGFzcz1cXFwibmctdGFibGUtcGFnaW5hdG9yLXBhZ2Utc2l6ZVxcXCIgKm5nSWY9XFxcInJhbmdlVmlzaWJsZSAmJiAhdGFibGUuZW1wdHlcXFwiPlxcbiAgPGRpdiBjbGFzcz1cXFwibmctdGFibGUtcGFnaW5hdG9yLXBhZ2Utc2l6ZS1sYWJlbFxcXCI+XFxuICAgIHt7bGFiZWwuaXRlbXNfcGVyX3BhZ2V9fVxcbiAgPC9kaXY+XFxuICA8c2VsZWN0IGNsYXNzPVxcXCJuZy10YWJsZS1wYWdpbmF0b3ItcGFnZS1zaXplLXNlbGVjdFxcXCIgWyhuZ01vZGVsKV09XFxcInRhYmxlLnJhbmdlXFxcIiAoY2hhbmdlKT1cXFwiYWN0aW9uUmFuZ2UoJGV2ZW50KVxcXCIgW2Rpc2FibGVkXT1cXFwidGFibGUubG9hZGluZ1xcXCI+XFxuICAgIDxvcHRpb24gKm5nRm9yPVxcXCJsZXQgY291bnQgb2YgdGFibGUucmFuZ2VPcHRpb25zXFxcIiB2YWx1ZT1cXFwie3tjb3VudH19XFxcIj57e2NvdW50fX08L29wdGlvbj5cXG4gIDwvc2VsZWN0PlxcbjwvZGl2PlxcbjxkaXYgY2xhc3M9XFxcIm5nLXRhYmxlLXBhZ2luYXRvci1wYWdlLWxhYmVsXFxcIiAqbmdJZj1cXFwiIXRhYmxlLmVtcHR5XFxcIj5cXG4gIHt7bGFiZWwucGFnZX19IHt7dGFibGUucGFnZX19IHt7bGFiZWwub2ZfcGFnZX19IHt7dGFibGUudG90YWxQYWdlc319IHxcXG4gIHt7bGFiZWwuaXRlbXN9fSA8c3BhbiAqbmdJZj1cXFwidGFibGUucm93cy5sZW5ndGggPiAxXFxcIj57e3RhYmxlLmZyb219fSAtIHt7dGFibGUudG99fTwvc3Bhbj5cXG4gIDxzcGFuICpuZ0lmPVxcXCJ0YWJsZS5yb3dzLmxlbmd0aCA9PSAxXFxcIj57e3RhYmxlLmZyb219fTwvc3Bhbj5cXG4gIHt7bGFiZWwub2ZfaXRlbXN9fSB7e3RhYmxlLnRvdGFsUm93c319XFxuPC9kaXY+XFxuPGJ1dHRvbiAqbmdJZj1cXFwiIXRhYmxlLmVtcHR5XFxcIiAoY2xpY2spPVxcXCJ0YWJsZS5wcmV2KClcXFwiIFtkaXNhYmxlZF09XFxcIiF0YWJsZS5oYXNQcmV2IHx8IHRhYmxlLmxvYWRpbmdcXFwiIG1kVG9vbHRpcD1cXFwiUHJldmlvdXMgcGFnZVxcXCIgdGl0bGU9XFxcIlByZXZpb3VzXFxcIj5cXHUyMUZEPC9idXR0b24+XFxuPGJ1dHRvbiAqbmdJZj1cXFwiIXRhYmxlLmVtcHR5XFxcIiAoY2xpY2spPVxcXCJ0YWJsZS5uZXh0KClcXFwiIFtkaXNhYmxlZF09XFxcIiF0YWJsZS5oYXNOZXh0IHx8IHRhYmxlLmxvYWRpbmdcXFwiIG1kVG9vbHRpcD1cXFwiTmV4dCBwYWdlXFxcIiB0aXRsZT1cXFwiTmV4dFxcXCI+XFx1MjFGRTwvYnV0dG9uPlxcbiAgXCIsXG4gICAgICAgICAgICAgICAgc3R5bGVzOiBbXCJcXG46aG9zdCgubmctdGFibGUtcGFnaW5hdG9yKSB7XFxuICBmb250LWZhbWlseTogUm9ib3RvLEhlbHZldGljYSBOZXVlLHNhbnMtc2VyaWY7XFxuICBmb250LXNpemU6IDEycHg7XFxuICBiYWNrZ3JvdW5kOiAjZmZmO1xcbiAgY29sb3I6IHJnYmEoMCwwLDAsLjU0KTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcXG4gIG1pbi1oZWlnaHQ6IDU2cHg7XFxuICBwYWRkaW5nOiAwIDhweDtcXG59XFxuXFxuOmhvc3QoLm5nLXRhYmxlLXBhZ2luYXRvcikgL2RlZXAvIC5uZy10YWJsZS1wYWdpbmF0b3ItcGFnZS1zaXplIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUtcGFnaW5hdG9yKSAvZGVlcC8gLm5nLXRhYmxlLXBhZ2luYXRvci1wYWdlLXNpemUtbGFiZWwge1xcbiAgbWFyZ2luOiAwIDhweCAwIDA7XFxufVxcblxcbjpob3N0KC5uZy10YWJsZS1wYWdpbmF0b3IpIC9kZWVwLyAubmctdGFibGUtcGFnaW5hdG9yLXBhZ2Utc2l6ZS1zZWxlY3QgLm1hdC1zZWxlY3QtdHJpZ2dlciB7XFxuICBtaW4td2lkdGg6IDYwcHg7XFxuICBmb250LXNpemU6IDEycHg7XFxufVxcblxcbjpob3N0KC5uZy10YWJsZS1wYWdpbmF0b3IpIC9kZWVwLyAubmctdGFibGUtcGFnaW5hdG9yLXBhZ2UtbGFiZWwge1xcbiAgbWFyZ2luOiAwIDMycHg7XFxufVxcbiAgXCJdLFxuICAgICAgICAgICAgICAgIGhvc3Q6IHsgJ2NsYXNzJzogJ25nLXRhYmxlLXBhZ2luYXRvcicgfVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlUGFnaW5hdG9yLmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW107IH07XG5OZ1RhYmxlUGFnaW5hdG9yLnByb3BEZWNvcmF0b3JzID0ge1xuICAgICd0YWJsZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbiAgICAnbGFiZWwnOiBbeyB0eXBlOiBJbnB1dCwgYXJnczogWydsYWJlbHMnLF0gfSxdLFxuICAgICduZ1RhYmxlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuICAgICdyYW5nZVZpc2libGUnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFnaW5hdG9yLmNvbXBvbmVudC5qcy5tYXAiLCJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMvUngnO1xuaW1wb3J0IHsgTmdUYWJsZVNvdXJjZVVwZGF0ZUV2ZW50IH0gZnJvbSAnLi9uZ3RhYmxlLmV2ZW50cyc7XG52YXIgTmdUYWJsZVNvdXJjZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZVNvdXJjZSgpIHtcbiAgICAgICAgdGhpcy5fcmFuZ2UgPSBudWxsO1xuICAgICAgICB0aGlzLl9yYW5nZU9wdGlvbnMgPSBbNSwgMTAsIDIwLCA1MF07XG4gICAgICAgIHRoaXMuX3BhcmFtcyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc291cmNlVXBkYXRlID0gbmV3IEJlaGF2aW9yU3ViamVjdChudWxsKTtcbiAgICAgICAgdGhpcy5zb3VyY2VVcGRhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMuYmVmb3JlQ29ubmVjdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5hZnRlckNvbm5lY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlU291cmNlLnByb3RvdHlwZSwgXCJsb2FkaW5nXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9hZGluZztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTmdUYWJsZVNvdXJjZS5wcm90b3R5cGUuZ2V0RGF0YSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5fbG9hZGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuc291cmNlKHBhcmFtcyk7XG4gICAgfTtcbiAgICBOZ1RhYmxlU291cmNlLnByb3RvdHlwZS51cGRhdGVEYXRhID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICB0aGlzLl9sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3NvdXJjZVVwZGF0ZS5uZXh0KHJlc3VsdCk7XG4gICAgICAgIHRoaXMuc291cmNlVXBkYXRlLmVtaXQobmV3IE5nVGFibGVTb3VyY2VVcGRhdGVFdmVudCh0aGlzLCByZXN1bHQpKTtcbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlU291cmNlLnByb3RvdHlwZSwgXCJjb25uZWN0aW9uXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc291cmNlVXBkYXRlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVNvdXJjZS5wcm90b3R5cGUsIFwicGFyYW1zXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFyYW1zO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHdhc1NldCA9IHRoaXMuX3BhcmFtcyAhPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fcGFyYW1zID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2xvYWRpbmcgJiYgd2FzU2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXREYXRhKHRoaXMucGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2UucHJvdG90eXBlLCBcInJhbmdlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmFuZ2UgfHwgMTA7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgd2FzU2V0ID0gdGhpcy5fcmFuZ2UgIT0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX3JhbmdlID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2xvYWRpbmcgJiYgd2FzU2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXREYXRhKHRoaXMucGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2UucHJvdG90eXBlLCBcInJhbmdlT3B0aW9uc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JhbmdlT3B0aW9ucztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5fcmFuZ2VPcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVTb3VyY2U7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZVNvdXJjZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bmd0YWJsZS5zb3VyY2UuanMubWFwIiwidmFyIE5nVGFibGVTb3VyY2VSZXN1bHQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVTb3VyY2VSZXN1bHQoX2RhdGEsIF90b3RhbFJvd3MsIF9hZGRpdGlvbmFsRGF0YSkge1xuICAgICAgICBpZiAoX3RvdGFsUm93cyA9PT0gdm9pZCAwKSB7IF90b3RhbFJvd3MgPSAwOyB9XG4gICAgICAgIHRoaXMuX2RhdGEgPSBfZGF0YTtcbiAgICAgICAgdGhpcy5fdG90YWxSb3dzID0gX3RvdGFsUm93cztcbiAgICAgICAgdGhpcy5fYWRkaXRpb25hbERhdGEgPSBfYWRkaXRpb25hbERhdGE7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlU291cmNlUmVzdWx0LnByb3RvdHlwZSwgXCJkYXRhXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2VSZXN1bHQucHJvdG90eXBlLCBcInRvdGFsUm93c1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvdGFsUm93cztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2VSZXN1bHQucHJvdG90eXBlLCBcImFkZGl0aW9uYWxEYXRhXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWRkaXRpb25hbERhdGE7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE5nVGFibGVTb3VyY2VSZXN1bHQuY3JlYXRlID0gZnVuY3Rpb24gKHJvd3MsIHRvdGFsUm93cywgYWRkaXRpb25hbERhdGEpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBOZ1RhYmxlU291cmNlUmVzdWx0KHJvd3MsIHRvdGFsUm93cywgYWRkaXRpb25hbERhdGEpO1xuICAgIH07XG4gICAgTmdUYWJsZVNvdXJjZVJlc3VsdC5zaW5nbGVQYWdlID0gZnVuY3Rpb24gKHNvdXJjZSwgcm93cywgYWRkaXRpb25hbERhdGEpIHtcbiAgICAgICAgdmFyIGxpc3QgPSBbXTtcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHNvdXJjZS5wYXJhbXM7XG4gICAgICAgIHJvd3MuZm9yRWFjaChmdW5jdGlvbiAocm93KSB7XG4gICAgICAgICAgICBpZiAoaW5kZXggPj0gcGFyYW1zLm9mZnNldCAmJiBpbmRleCA8IHBhcmFtcy5vZmZzZXQgKyBzb3VyY2UucmFuZ2UpIHtcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2gocm93KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbmV3IE5nVGFibGVTb3VyY2VSZXN1bHQobGlzdCwgcm93cy5sZW5ndGgsIGFkZGl0aW9uYWxEYXRhKTtcbiAgICB9O1xuICAgIHJldHVybiBOZ1RhYmxlU291cmNlUmVzdWx0O1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVTb3VyY2VSZXN1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5ndGFibGUucmVzdWx0LmpzLm1hcCIsImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBCcm93c2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0ICdoYW1tZXJqcyc7XG5pbXBvcnQgeyBOZ1RhYmxlQ2VsbCB9IGZyb20gJy4vY29tcG9uZW50cy9jZWxsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ1RhYmxlSGVhZGVyQ2VsbCB9IGZyb20gJy4vY29tcG9uZW50cy9oZWFkZXItY2VsbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmdUYWJsZUhlYWRlclJvdyB9IGZyb20gJy4vY29tcG9uZW50cy9oZWFkZXItcm93LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ1RhYmxlUGFnaW5hdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL3BhZ2luYXRvci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmdUYWJsZVJvdyB9IGZyb20gJy4vY29tcG9uZW50cy9yb3cuY29tcG9uZW50JztcbmltcG9ydCB7IE5nVGFibGUgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50JztcbmV4cG9ydCB7IE5nVGFibGVJbml0RXZlbnQsIE5nVGFibGVEZXN0cm95RXZlbnQsIE5nVGFibGVCZWZvcmVDb25uZWN0RXZlbnQsIE5nVGFibGVBZnRlckNvbm5lY3RFdmVudCwgTmdUYWJsZVJhbmdlRXZlbnQgfSBmcm9tICcuL25ndGFibGUuZXZlbnRzJztcbmV4cG9ydCB7IE5nVGFibGVTb3VyY2UgfSBmcm9tICcuL25ndGFibGUuc291cmNlJztcbmV4cG9ydCB7IE5nVGFibGVTb3VyY2VSZXN1bHQgfSBmcm9tICcuL25ndGFibGUucmVzdWx0JztcbmV4cG9ydCB7IE5nVGFibGUgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50JztcbmV4cG9ydCB7IE5nVGFibGVIZWFkZXJSb3cgfSBmcm9tICcuL2NvbXBvbmVudHMvaGVhZGVyLXJvdy5jb21wb25lbnQnO1xuZXhwb3J0IHsgTmdUYWJsZUhlYWRlckNlbGwgfSBmcm9tICcuL2NvbXBvbmVudHMvaGVhZGVyLWNlbGwuY29tcG9uZW50JztcbmV4cG9ydCB7IE5nVGFibGVSb3cgfSBmcm9tICcuL2NvbXBvbmVudHMvcm93LmNvbXBvbmVudCc7XG5leHBvcnQgeyBOZ1RhYmxlQ2VsbCB9IGZyb20gJy4vY29tcG9uZW50cy9jZWxsLmNvbXBvbmVudCc7XG5leHBvcnQgeyBOZ1RhYmxlUGFnaW5hdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL3BhZ2luYXRvci5jb21wb25lbnQnO1xudmFyIHJvdXRlcyA9IFtdO1xudmFyIE5nVGFibGVSb3V0aW5nTW9kdWxlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlUm91dGluZ01vZHVsZSgpIHtcbiAgICB9XG4gICAgcmV0dXJuIE5nVGFibGVSb3V0aW5nTW9kdWxlO1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVSb3V0aW5nTW9kdWxlIH07XG5OZ1RhYmxlUm91dGluZ01vZHVsZS5kZWNvcmF0b3JzID0gW1xuICAgIHsgdHlwZTogTmdNb2R1bGUsIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgaW1wb3J0czogW1JvdXRlck1vZHVsZS5mb3JSb290KHJvdXRlcyldLFxuICAgICAgICAgICAgICAgIGV4cG9ydHM6IFtSb3V0ZXJNb2R1bGVdXG4gICAgICAgICAgICB9LF0gfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbk5nVGFibGVSb3V0aW5nTW9kdWxlLmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW107IH07XG52YXIgTmdUYWJsZU1vZHVsZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZU1vZHVsZSgpIHtcbiAgICB9XG4gICAgcmV0dXJuIE5nVGFibGVNb2R1bGU7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZU1vZHVsZSB9O1xuTmdUYWJsZU1vZHVsZS5kZWNvcmF0b3JzID0gW1xuICAgIHsgdHlwZTogTmdNb2R1bGUsIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgaW1wb3J0czogW1xuICAgICAgICAgICAgICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgICAgICAgICAgICAgIEJyb3dzZXJNb2R1bGUsXG4gICAgICAgICAgICAgICAgICAgIEJyb3dzZXJBbmltYXRpb25zTW9kdWxlLFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlUm91dGluZ01vZHVsZSxcbiAgICAgICAgICAgICAgICAgICAgRm9ybXNNb2R1bGVcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlLFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlSGVhZGVyUm93LFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlSGVhZGVyQ2VsbCxcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZVJvdyxcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZUNlbGwsXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVQYWdpbmF0b3JcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHByb3ZpZGVyczogW10sXG4gICAgICAgICAgICAgICAgZXhwb3J0czogW1xuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlLFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlSGVhZGVyUm93LFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlSGVhZGVyQ2VsbCxcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZVJvdyxcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZUNlbGwsXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVQYWdpbmF0b3JcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LF0gfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbk5nVGFibGVNb2R1bGUuY3RvclBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBbXTsgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC5qcy5tYXAiXSwibmFtZXMiOlsiRXZlbnRFbWl0dGVyIiwiQ29tcG9uZW50IiwiQWN0aXZhdGVkUm91dGUiLCJPdXRwdXQiLCJJbnB1dCIsIkJlaGF2aW9yU3ViamVjdCIsIk5nTW9kdWxlIiwiUm91dGVyTW9kdWxlIiwiQ29tbW9uTW9kdWxlIiwiQnJvd3Nlck1vZHVsZSIsIkJyb3dzZXJBbmltYXRpb25zTW9kdWxlIiwiRm9ybXNNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUksZ0JBQWdCLElBQUksWUFBWTtJQUNoQyxTQUFTLGdCQUFnQixDQUFDLEtBQUssRUFBRTtRQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztLQUN2QjtJQUNELE1BQU0sQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFF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
