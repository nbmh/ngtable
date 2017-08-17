(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/forms'), require('@angular/router'), require('@angular/common'), require('@angular/platform-browser'), require('@angular/platform-browser/animations'), require('@angular/material'), require('@angular/flex-layout'), require('hammerjs'), require('rxjs/Rx')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/forms', '@angular/router', '@angular/common', '@angular/platform-browser', '@angular/platform-browser/animations', '@angular/material', '@angular/flex-layout', 'hammerjs', 'rxjs/Rx'], factory) :
	(factory((global.ngtable = {}),global.ng.core,global._angular_forms,global._angular_router,global._angular_common,global._angular_platformBrowser,global._angular_platformBrowser_animations,global._angular_material,global._angular_flexLayout,null,global.rxjs_Rx));
}(this, (function (exports,_angular_core,_angular_forms,_angular_router,_angular_common,_angular_platformBrowser,_angular_platformBrowser_animations,_angular_material,_angular_flexLayout,hammerjs,rxjs_Rx) { 'use strict';

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
                    _this._rows = result.data;
                    _this._totalRows = result.totalRows;
                    _this._totalPages = Math.ceil(_this._totalRows / _this._dataSource.range);
                    if (_this._page > _this._totalPages) {
                        _this._page = 1;
                    }
                    _this._from = ((_this._page - 1) * _this._dataSource.range) + 1;
                    _this._to = _this._from + _this._dataSource.range - 1;
                    if (_this._to > _this._totalRows) {
                        _this._to = _this._totalRows;
                    }
                    _this.afterConnectEmitter.emit(new NgTableAfterConnectEvent(_this, result));
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    NgTable.prototype.requestData = function () {
        if (!this._dataSource.loading) {
            this._dataSource.params.offset = (this._page - 1) * this._dataSource.range;
            this.beforeConnectEmitter.emit(new NgTableBeforeConnectEvent(this, this._dataSource.params));
            this._dataSource.getData(this._dataSource.params);
        }
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

var NgTableHeaderRow = (function () {
    function NgTableHeaderRow() {
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
NgTableHeaderRow.ctorParameters = function () { return []; };

var NgTableHeaderCell = (function () {
    function NgTableHeaderCell() {
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
NgTableHeaderCell.ctorParameters = function () { return []; };

var NgTableRow = (function () {
    function NgTableRow() {
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
NgTableRow.ctorParameters = function () { return []; };

var NgTableCell = (function () {
    function NgTableCell() {
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
NgTableCell.ctorParameters = function () { return []; };

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
                    _angular_material.MaterialModule,
                    NgTableRoutingModule
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS51bWQuanMiLCJzb3VyY2VzIjpbIi4uL2Rpc3Qvbmd0YWJsZS5ldmVudHMuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50LmpzIiwiLi4vZGlzdC9jb21wb25lbnRzL2hlYWRlci1yb3cuY29tcG9uZW50LmpzIiwiLi4vZGlzdC9jb21wb25lbnRzL2hlYWRlci1jZWxsLmNvbXBvbmVudC5qcyIsIi4uL2Rpc3QvY29tcG9uZW50cy9yb3cuY29tcG9uZW50LmpzIiwiLi4vZGlzdC9jb21wb25lbnRzL2NlbGwuY29tcG9uZW50LmpzIiwiLi4vZGlzdC9jb21wb25lbnRzL3BhZ2luYXRvci5jb21wb25lbnQuanMiLCIuLi9kaXN0L25ndGFibGUuc291cmNlLmpzIiwiLi4vZGlzdC9uZ3RhYmxlLnJlc3VsdC5qcyIsIi4uL2Rpc3QvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBOZ1RhYmxlSW5pdEV2ZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlSW5pdEV2ZW50KHRhYmxlKSB7XG4gICAgICAgIHRoaXMuX3RhYmxlID0gdGFibGU7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlSW5pdEV2ZW50LnByb3RvdHlwZSwgXCJ0YWJsZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gTmdUYWJsZUluaXRFdmVudDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlSW5pdEV2ZW50IH07XG52YXIgTmdUYWJsZURlc3Ryb3lFdmVudCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZURlc3Ryb3lFdmVudCh0YWJsZSkge1xuICAgICAgICB0aGlzLl90YWJsZSA9IHRhYmxlO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZURlc3Ryb3lFdmVudC5wcm90b3R5cGUsIFwidGFibGVcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90YWJsZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVEZXN0cm95RXZlbnQ7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZURlc3Ryb3lFdmVudCB9O1xudmFyIE5nVGFibGVCZWZvcmVDb25uZWN0RXZlbnQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVCZWZvcmVDb25uZWN0RXZlbnQodGFibGUsIHBhcmFtcykge1xuICAgICAgICB0aGlzLl90YWJsZSA9IHRhYmxlO1xuICAgICAgICB0aGlzLl9wYXJhbXMgPSBwYXJhbXM7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlQmVmb3JlQ29ubmVjdEV2ZW50LnByb3RvdHlwZSwgXCJ0YWJsZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZUJlZm9yZUNvbm5lY3RFdmVudC5wcm90b3R5cGUsIFwicGFyYW1zXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFyYW1zO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gTmdUYWJsZUJlZm9yZUNvbm5lY3RFdmVudDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlQmVmb3JlQ29ubmVjdEV2ZW50IH07XG52YXIgTmdUYWJsZUFmdGVyQ29ubmVjdEV2ZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQodGFibGUsIHJlc3VsdCkge1xuICAgICAgICB0aGlzLl90YWJsZSA9IHRhYmxlO1xuICAgICAgICB0aGlzLl9yZXN1bHQgPSByZXN1bHQ7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQucHJvdG90eXBlLCBcInRhYmxlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFibGU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQucHJvdG90eXBlLCBcInJlc3VsdFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VsdDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVBZnRlckNvbm5lY3RFdmVudDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQgfTtcbnZhciBOZ1RhYmxlUmFuZ2VFdmVudCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZVJhbmdlRXZlbnQodGFibGUsIHJhbmdlLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX3RhYmxlID0gdGFibGU7XG4gICAgICAgIHRoaXMuX3JhbmdlID0gcmFuZ2U7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVJhbmdlRXZlbnQucHJvdG90eXBlLCBcInRhYmxlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFibGU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlUmFuZ2VFdmVudC5wcm90b3R5cGUsIFwicmFuZ2VcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yYW5nZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVSYW5nZUV2ZW50LnByb3RvdHlwZSwgXCJvcHRpb25zXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVSYW5nZUV2ZW50O1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVSYW5nZUV2ZW50IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1uZ3RhYmxlLmV2ZW50cy5qcy5tYXAiLCJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgTmdUYWJsZUluaXRFdmVudCwgTmdUYWJsZVJhbmdlRXZlbnQsIE5nVGFibGVCZWZvcmVDb25uZWN0RXZlbnQsIE5nVGFibGVBZnRlckNvbm5lY3RFdmVudCwgTmdUYWJsZURlc3Ryb3lFdmVudCB9IGZyb20gJy4uL25ndGFibGUuZXZlbnRzJztcbnZhciBOZ1RhYmxlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlKGFjdGl2ZVJvdXRlKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlUm91dGUgPSBhY3RpdmVSb3V0ZTtcbiAgICAgICAgdGhpcy5fcm93cyA9IFtdO1xuICAgICAgICB0aGlzLl90b3RhbFJvd3MgPSAwO1xuICAgICAgICB0aGlzLl9wYWdlID0gMTtcbiAgICAgICAgdGhpcy5fdG90YWxQYWdlcyA9IDA7XG4gICAgICAgIHRoaXMuX2Zyb20gPSAwO1xuICAgICAgICB0aGlzLl90byA9IDA7XG4gICAgICAgIHRoaXMuX2luaXRpYWxpemVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3F1ZXJ5UGFnZSA9ICdwYWdlJztcbiAgICAgICAgdGhpcy5pbml0RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5kZXN0cm95RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5iZWZvcmVDb25uZWN0RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5hZnRlckNvbm5lY3RFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLnJhbmdlQ2hhbmdlRW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICB9XG4gICAgTmdUYWJsZS5wcm90b3R5cGUubmdPbkluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgfTtcbiAgICBOZ1RhYmxlLnByb3RvdHlwZS5uZ0FmdGVyVmlld0luaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuaW5pdEVtaXR0ZXIuZW1pdChuZXcgTmdUYWJsZUluaXRFdmVudCh0aGlzKSk7XG4gICAgICAgIHRoaXMuX3F1ZXJ5U3Vic2NyaWJlciA9IHRoaXMuYWN0aXZlUm91dGUucXVlcnlQYXJhbXMuZGVib3VuY2VUaW1lKDEwKS5zdWJzY3JpYmUoZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgX3RoaXMuX2luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgICAgIF90aGlzLl9wYWdlID0gcGFyYW1zW190aGlzLl9xdWVyeVBhZ2VdID8gK3BhcmFtc1tfdGhpcy5fcXVlcnlQYWdlXSA6IDE7XG4gICAgICAgICAgICBfdGhpcy5yZXF1ZXN0RGF0YSgpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5nVGFibGUucHJvdG90eXBlLm5nT25EZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fZGF0YVNvdXJjZVN1YnNjcmliZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2RhdGFTb3VyY2VTdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlU3Vic2NyaWJlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcXVlcnlTdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHRoaXMuZGVzdHJveUVtaXR0ZXIuZW1pdChuZXcgTmdUYWJsZURlc3Ryb3lFdmVudCh0aGlzKSk7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiZGF0YVNvdXJjZVwiLCB7XG4gICAgICAgIHNldDogZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuX2RhdGFTb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgICAgICBpZiAodGhpcy5fZGF0YVNvdXJjZVN1YnNjcmliZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlU3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZVN1YnNjcmliZXIgPSB0aGlzLl9kYXRhU291cmNlLmNvbm5lY3Rpb24uc3Vic2NyaWJlKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9yb3dzID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl90b3RhbFJvd3MgPSByZXN1bHQudG90YWxSb3dzO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fdG90YWxQYWdlcyA9IE1hdGguY2VpbChfdGhpcy5fdG90YWxSb3dzIC8gX3RoaXMuX2RhdGFTb3VyY2UucmFuZ2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoX3RoaXMuX3BhZ2UgPiBfdGhpcy5fdG90YWxQYWdlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX3BhZ2UgPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9mcm9tID0gKChfdGhpcy5fcGFnZSAtIDEpICogX3RoaXMuX2RhdGFTb3VyY2UucmFuZ2UpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX3RvID0gX3RoaXMuX2Zyb20gKyBfdGhpcy5fZGF0YVNvdXJjZS5yYW5nZSAtIDE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfdGhpcy5fdG8gPiBfdGhpcy5fdG90YWxSb3dzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fdG8gPSBfdGhpcy5fdG90YWxSb3dzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmFmdGVyQ29ubmVjdEVtaXR0ZXIuZW1pdChuZXcgTmdUYWJsZUFmdGVyQ29ubmVjdEV2ZW50KF90aGlzLCByZXN1bHQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTmdUYWJsZS5wcm90b3R5cGUucmVxdWVzdERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fZGF0YVNvdXJjZS5sb2FkaW5nKSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlLnBhcmFtcy5vZmZzZXQgPSAodGhpcy5fcGFnZSAtIDEpICogdGhpcy5fZGF0YVNvdXJjZS5yYW5nZTtcbiAgICAgICAgICAgIHRoaXMuYmVmb3JlQ29ubmVjdEVtaXR0ZXIuZW1pdChuZXcgTmdUYWJsZUJlZm9yZUNvbm5lY3RFdmVudCh0aGlzLCB0aGlzLl9kYXRhU291cmNlLnBhcmFtcykpO1xuICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZS5nZXREYXRhKHRoaXMuX2RhdGFTb3VyY2UucGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcInJvd3NcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb3dzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwicXVlcnlQYWdlXCIsIHtcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgdGhpcy5fcXVlcnlQYWdlID0gbmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcInBhZ2VcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYWdlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9kYXRhU291cmNlLmxvYWRpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wYWdlID0gK2luZGV4O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9wYWdlIDwgMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYWdlID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3BhZ2UgPiB0aGlzLl90b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhZ2UgPSB0aGlzLl90b3RhbFBhZ2VzO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fcGFnZSA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhZ2UgPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdERhdGEoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcInRvdGFsUGFnZXNcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3RhbFBhZ2VzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwidG90YWxSb3dzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG90YWxSb3dzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiZnJvbVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Zyb207XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJ0b1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwicmFuZ2VcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhU291cmNlLnJhbmdlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9kYXRhU291cmNlLmxvYWRpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlLnJhbmdlID0gK3ZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VDaGFuZ2VFbWl0dGVyLmVtaXQobmV3IE5nVGFibGVSYW5nZUV2ZW50KHRoaXMsIHRoaXMucmFuZ2UsIHRoaXMucmFuZ2VPcHRpb25zKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJyYW5nZU9wdGlvbnNcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhU291cmNlLnJhbmdlT3B0aW9ucztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2RhdGFTb3VyY2UucmFuZ2VPcHRpb25zID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJpbml0aWFsaXplZFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2luaXRpYWxpemVkO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwibG9hZGluZ1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFTb3VyY2UubG9hZGluZztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcImVtcHR5XCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG90YWxSb3dzID09IDA7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE5nVGFibGUucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucGFnZSA9IHRoaXMuX3BhZ2U7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTmdUYWJsZS5wcm90b3R5cGUucHJldiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fcGFnZS0tO1xuICAgICAgICBpZiAodGhpcy5fcGFnZSA8IDEpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhZ2UgPSAxO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGFnZSA9IHRoaXMuX3BhZ2U7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTmdUYWJsZS5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fcGFnZSsrO1xuICAgICAgICB2YXIgcGFnZXNNYXggPSB0aGlzLnRvdGFsUGFnZXM7XG4gICAgICAgIGlmICh0aGlzLl9wYWdlID4gcGFnZXNNYXgpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhZ2UgPSBwYWdlc01heDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhZ2UgPSB0aGlzLl9wYWdlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJoYXNQcmV2XCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFnZSA+IDE7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJoYXNOZXh0XCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFnZSA8IHRoaXMuX3RvdGFsUGFnZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJpc0ZpcnN0XCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFnZSA9PSAxO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiaXNMYXN0XCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFnZSA9PSB0aGlzLl90b3RhbFBhZ2VzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gTmdUYWJsZTtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlIH07XG5OZ1RhYmxlLmRlY29yYXRvcnMgPSBbXG4gICAgeyB0eXBlOiBDb21wb25lbnQsIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICduZy10YWJsZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiXFxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XFxuICBcIixcbiAgICAgICAgICAgICAgICBzdHlsZXM6IFtcIlxcbjpob3N0KC5uZy10YWJsZSkge1xcbiAgYmFja2dyb3VuZDogI2ZmZjtcXG4gIG92ZXJmbG93OiBhdXRvO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxufVxcblxcbjpob3N0KC5uZy10YWJsZSkgL2RlZXAvIC5uZy10YWJsZS1oZWFkZXItcm93LFxcbjpob3N0KC5uZy10YWJsZSkgL2RlZXAvIC5uZy10YWJsZS1yb3cge1xcbiAgYm9yZGVyLWJvdHRvbS1jb2xvcjogcmdiYSgwLCAwLCAwLCAuMTIpO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGJvcmRlci1ib3R0b20td2lkdGg6IDFweDtcXG4gIGJvcmRlci1ib3R0b20tc3R5bGU6IHNvbGlkO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIG1pbi1oZWlnaHQ6IDQ4cHg7XFxuICBwYWRkaW5nOiAwIDEycHg7XFxufVxcblxcbjpob3N0KC5uZy10YWJsZSkgL2RlZXAvIC5uZy10YWJsZS1oZWFkZXItY2VsbCB7XFxuICBmb250LXNpemU6IDEycHg7XFxuICBmb250LXdlaWdodDogNTAwO1xcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjU0KTtcXG4gIGZsZXg6IDE7XFxufVxcblxcbjpob3N0KC5uZy10YWJsZSkgL2RlZXAvIC5uZy10YWJsZS1jZWxsIHtcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG4gIGNvbG9yOiByZ2JhKDAsMCwwLC44Nyk7XFxuICBmbGV4OiAxO1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUpIC9kZWVwLyAubmctdGFibGUtaWNvbiB7XFxuICB3aWR0aDogNDBweDtcXG4gIGhlaWdodDogNDBweDtcXG59XFxuXFxuOmhvc3QoLm5nLXRhYmxlLXN0cmlwZWQpIC9kZWVwLyAubmctdGFibGUtcm93Om50aC1vZi10eXBlKG9kZCkge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y5ZjlmOTtcXG59XFxuXFxuOmhvc3QoLm5nLXRhYmxlLXN0cmlwZWQubmctdGFibGUtaG92ZXIpIC9kZWVwLyAubmctdGFibGUtcm93OmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7XFxufVxcbiAgXCJdLFxuICAgICAgICAgICAgICAgIGhvc3Q6IHsgJ2NsYXNzJzogJ25nLXRhYmxlJyB9XG4gICAgICAgICAgICB9LF0gfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbk5nVGFibGUuY3RvclBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBbXG4gICAgeyB0eXBlOiBBY3RpdmF0ZWRSb3V0ZSwgfSxcbl07IH07XG5OZ1RhYmxlLnByb3BEZWNvcmF0b3JzID0ge1xuICAgICdpbml0RW1pdHRlcic6IFt7IHR5cGU6IE91dHB1dCwgYXJnczogWydpbml0JyxdIH0sXSxcbiAgICAnZGVzdHJveUVtaXR0ZXInOiBbeyB0eXBlOiBPdXRwdXQsIGFyZ3M6IFsnZGVzdHJveScsXSB9LF0sXG4gICAgJ2JlZm9yZUNvbm5lY3RFbWl0dGVyJzogW3sgdHlwZTogT3V0cHV0LCBhcmdzOiBbJ2JlZm9yZUNvbm5lY3QnLF0gfSxdLFxuICAgICdhZnRlckNvbm5lY3RFbWl0dGVyJzogW3sgdHlwZTogT3V0cHV0LCBhcmdzOiBbJ2FmdGVyQ29ubmVjdCcsXSB9LF0sXG4gICAgJ3JhbmdlQ2hhbmdlRW1pdHRlcic6IFt7IHR5cGU6IE91dHB1dCwgYXJnczogWydyYW5nZUNoYW5nZScsXSB9LF0sXG4gICAgJ2RhdGFTb3VyY2UnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4gICAgJ3F1ZXJ5UGFnZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbiAgICAncGFnZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbiAgICAncmFuZ2UnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4gICAgJ3JhbmdlT3B0aW9ucyc6IFt7IHR5cGU6IElucHV0IH0sXSxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD10YWJsZS5jb21wb25lbnQuanMubWFwIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG52YXIgTmdUYWJsZUhlYWRlclJvdyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZUhlYWRlclJvdygpIHtcbiAgICB9XG4gICAgcmV0dXJuIE5nVGFibGVIZWFkZXJSb3c7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZUhlYWRlclJvdyB9O1xuTmdUYWJsZUhlYWRlclJvdy5kZWNvcmF0b3JzID0gW1xuICAgIHsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnbmctdGFibGUtaGVhZGVyLXJvdycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiXFxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XFxuICBcIixcbiAgICAgICAgICAgICAgICBob3N0OiB7ICdjbGFzcyc6ICduZy10YWJsZS1oZWFkZXItcm93JyB9XG4gICAgICAgICAgICB9LF0gfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbk5nVGFibGVIZWFkZXJSb3cuY3RvclBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBbXTsgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhlYWRlci1yb3cuY29tcG9uZW50LmpzLm1hcCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xudmFyIE5nVGFibGVIZWFkZXJDZWxsID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlSGVhZGVyQ2VsbCgpIHtcbiAgICB9XG4gICAgcmV0dXJuIE5nVGFibGVIZWFkZXJDZWxsO1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVIZWFkZXJDZWxsIH07XG5OZ1RhYmxlSGVhZGVyQ2VsbC5kZWNvcmF0b3JzID0gW1xuICAgIHsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnbmctdGFibGUtaGVhZGVyLWNlbGwnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBcIlxcbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxcbiAgXCIsXG4gICAgICAgICAgICAgICAgaG9zdDogeyAnY2xhc3MnOiAnbmctdGFibGUtaGVhZGVyLWNlbGwnIH1cbiAgICAgICAgICAgIH0sXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuTmdUYWJsZUhlYWRlckNlbGwuY3RvclBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBbXTsgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhlYWRlci1jZWxsLmNvbXBvbmVudC5qcy5tYXAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbnZhciBOZ1RhYmxlUm93ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlUm93KCkge1xuICAgIH1cbiAgICByZXR1cm4gTmdUYWJsZVJvdztcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlUm93IH07XG5OZ1RhYmxlUm93LmRlY29yYXRvcnMgPSBbXG4gICAgeyB0eXBlOiBDb21wb25lbnQsIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICduZy10YWJsZS1yb3cnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBcIlxcbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxcbiAgXCIsXG4gICAgICAgICAgICAgICAgaG9zdDogeyAnY2xhc3MnOiAnbmctdGFibGUtcm93JyB9XG4gICAgICAgICAgICB9LF0gfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbk5nVGFibGVSb3cuY3RvclBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBbXTsgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJvdy5jb21wb25lbnQuanMubWFwIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG52YXIgTmdUYWJsZUNlbGwgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVDZWxsKCkge1xuICAgIH1cbiAgICByZXR1cm4gTmdUYWJsZUNlbGw7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZUNlbGwgfTtcbk5nVGFibGVDZWxsLmRlY29yYXRvcnMgPSBbXG4gICAgeyB0eXBlOiBDb21wb25lbnQsIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICduZy10YWJsZS1jZWxsJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogXCJcXG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cXG4gIFwiLFxuICAgICAgICAgICAgICAgIGhvc3Q6IHsgJ2NsYXNzJzogJ25nLXRhYmxlLWNlbGwnIH1cbiAgICAgICAgICAgIH0sXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuTmdUYWJsZUNlbGwuY3RvclBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBbXTsgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNlbGwuY29tcG9uZW50LmpzLm1hcCIsImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbnZhciBOZ1RhYmxlUGFnaW5hdG9yID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlUGFnaW5hdG9yKCkge1xuICAgICAgICB0aGlzLl9yYW5nZVZpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLl9sYWJlbCA9IHtcbiAgICAgICAgICAgIGl0ZW1zX3Blcl9wYWdlOiAnSXRlbXMgcGVyIHBhZ2UnLFxuICAgICAgICAgICAgcGFnZTogJ1BhZ2UnLFxuICAgICAgICAgICAgb2ZfcGFnZTogJ29mJyxcbiAgICAgICAgICAgIGl0ZW1zOiAnSXRlbXMnLFxuICAgICAgICAgICAgb2ZfaXRlbXM6ICdvZicsXG4gICAgICAgIH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlUGFnaW5hdG9yLnByb3RvdHlwZSwgXCJsYWJlbFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xhYmVsO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fbGFiZWwgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9sYWJlbCwgdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVBhZ2luYXRvci5wcm90b3R5cGUsIFwibmdUYWJsZVwiLCB7XG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnRhYmxlID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlUGFnaW5hdG9yLnByb3RvdHlwZSwgXCJyYW5nZVZpc2libGVcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yYW5nZVZpc2libGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHN0YXR1cykge1xuICAgICAgICAgICAgdGhpcy5fcmFuZ2VWaXNpYmxlID0gc3RhdHVzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBOZ1RhYmxlUGFnaW5hdG9yLnByb3RvdHlwZS5hY3Rpb25SYW5nZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh0aGlzLnRhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLnRhYmxlLnJhbmdlID0gK2UudmFsdWU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBOZ1RhYmxlUGFnaW5hdG9yO1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVQYWdpbmF0b3IgfTtcbk5nVGFibGVQYWdpbmF0b3IuZGVjb3JhdG9ycyA9IFtcbiAgICB7IHR5cGU6IENvbXBvbmVudCwgYXJnczogW3tcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ25nLXRhYmxlLXBhZ2luYXRvcicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiXFxuPGRpdiBjbGFzcz1cXFwibmctdGFibGUtcGFnaW5hdG9yLXBhZ2Utc2l6ZVxcXCIgKm5nSWY9XFxcInJhbmdlVmlzaWJsZSAmJiAhdGFibGUuZW1wdHlcXFwiPlxcbiAgPGRpdiBjbGFzcz1cXFwibmctdGFibGUtcGFnaW5hdG9yLXBhZ2Utc2l6ZS1sYWJlbFxcXCI+XFxuICAgIHt7bGFiZWwuaXRlbXNfcGVyX3BhZ2V9fVxcbiAgPC9kaXY+XFxuICA8bWQtc2VsZWN0IGNsYXNzPVxcXCJuZy10YWJsZS1wYWdpbmF0b3ItcGFnZS1zaXplLXNlbGVjdFxcXCIgWyhuZ01vZGVsKV09XFxcInRhYmxlLnJhbmdlXFxcIiAoY2hhbmdlKT1cXFwiYWN0aW9uUmFuZ2UoJGV2ZW50KVxcXCIgW2Rpc2FibGVkXT1cXFwidGFibGUubG9hZGluZ1xcXCI+XFxuICAgIDxtZC1vcHRpb24gKm5nRm9yPVxcXCJsZXQgY291bnQgb2YgdGFibGUucmFuZ2VPcHRpb25zXFxcIiBbdmFsdWVdPVxcXCJjb3VudFxcXCI+XFxuICAgICAge3tjb3VudH19XFxuICAgIDwvbWQtb3B0aW9uPlxcbiAgPC9tZC1zZWxlY3Q+XFxuPC9kaXY+XFxuPGRpdiBjbGFzcz1cXFwibmctdGFibGUtcGFnaW5hdG9yLXBhZ2UtbGFiZWxcXFwiICpuZ0lmPVxcXCIhdGFibGUuZW1wdHlcXFwiPlxcbiAge3tsYWJlbC5wYWdlfX0ge3t0YWJsZS5wYWdlfX0ge3tsYWJlbC5vZl9wYWdlfX0ge3t0YWJsZS50b3RhbFBhZ2VzfX0gfFxcbiAge3tsYWJlbC5pdGVtc319IDxzcGFuICpuZ0lmPVxcXCJ0YWJsZS5yb3dzLmxlbmd0aCA+IDFcXFwiPnt7dGFibGUuZnJvbX19IC0ge3t0YWJsZS50b319PC9zcGFuPlxcbiAgPHNwYW4gKm5nSWY9XFxcInRhYmxlLnJvd3MubGVuZ3RoID09IDFcXFwiPnt7dGFibGUuZnJvbX19PC9zcGFuPlxcbiAge3tsYWJlbC5vZl9pdGVtc319IHt7dGFibGUudG90YWxSb3dzfX1cXG48L2Rpdj5cXG48YnV0dG9uIG1kLWljb24tYnV0dG9uICpuZ0lmPVxcXCIhdGFibGUuZW1wdHlcXFwiIChjbGljayk9XFxcInRhYmxlLnByZXYoKVxcXCIgW2Rpc2FibGVkXT1cXFwiIXRhYmxlLmhhc1ByZXYgfHwgdGFibGUubG9hZGluZ1xcXCIgbWRUb29sdGlwPVxcXCJQcmV2aW91cyBwYWdlXFxcIj48bWQtaWNvbiBjbGFzcz1cXFwibWF0ZXJpYWwtaWNvbnNcXFwiPm5hdmlnYXRlX2JlZm9yZTwvbWQtaWNvbj48L2J1dHRvbj5cXG48YnV0dG9uIG1kLWljb24tYnV0dG9uICpuZ0lmPVxcXCIhdGFibGUuZW1wdHlcXFwiIChjbGljayk9XFxcInRhYmxlLm5leHQoKVxcXCIgW2Rpc2FibGVkXT1cXFwiIXRhYmxlLmhhc05leHQgfHwgdGFibGUubG9hZGluZ1xcXCIgbWRUb29sdGlwPVxcXCJOZXh0IHBhZ2VcXFwiPjxtZC1pY29uIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCI+bmF2aWdhdGVfbmV4dDwvbWQtaWNvbj48L2J1dHRvbj5cXG4gIFwiLFxuICAgICAgICAgICAgICAgIHN0eWxlczogW1wiXFxuOmhvc3QoLm5nLXRhYmxlLXBhZ2luYXRvcikge1xcbiAgZm9udC1mYW1pbHk6IFJvYm90byxIZWx2ZXRpY2EgTmV1ZSxzYW5zLXNlcmlmO1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbiAgYmFja2dyb3VuZDogI2ZmZjtcXG4gIGNvbG9yOiByZ2JhKDAsMCwwLC41NCk7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XFxuICBtaW4taGVpZ2h0OiA1NnB4O1xcbiAgcGFkZGluZzogMCA4cHg7XFxufVxcblxcbjpob3N0KC5uZy10YWJsZS1wYWdpbmF0b3IpIC9kZWVwLyAubmctdGFibGUtcGFnaW5hdG9yLXBhZ2Utc2l6ZSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuOmhvc3QoLm5nLXRhYmxlLXBhZ2luYXRvcikgL2RlZXAvIC5uZy10YWJsZS1wYWdpbmF0b3ItcGFnZS1zaXplLWxhYmVsIHtcXG4gIG1hcmdpbjogMCA4cHggMCAwO1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUtcGFnaW5hdG9yKSAvZGVlcC8gLm5nLXRhYmxlLXBhZ2luYXRvci1wYWdlLXNpemUtc2VsZWN0IC5tYXQtc2VsZWN0LXRyaWdnZXIge1xcbiAgbWluLXdpZHRoOiA2MHB4O1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUtcGFnaW5hdG9yKSAvZGVlcC8gLm5nLXRhYmxlLXBhZ2luYXRvci1wYWdlLWxhYmVsIHtcXG4gIG1hcmdpbjogMCAzMnB4O1xcbn1cXG4gIFwiXSxcbiAgICAgICAgICAgICAgICBob3N0OiB7ICdjbGFzcyc6ICduZy10YWJsZS1wYWdpbmF0b3InIH1cbiAgICAgICAgICAgIH0sXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuTmdUYWJsZVBhZ2luYXRvci5jdG9yUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtdOyB9O1xuTmdUYWJsZVBhZ2luYXRvci5wcm9wRGVjb3JhdG9ycyA9IHtcbiAgICAndGFibGUnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4gICAgJ2xhYmVsJzogW3sgdHlwZTogSW5wdXQsIGFyZ3M6IFsnbGFiZWxzJyxdIH0sXSxcbiAgICAnbmdUYWJsZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbiAgICAncmFuZ2VWaXNpYmxlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhZ2luYXRvci5jb21wb25lbnQuanMubWFwIiwiaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcy9SeCc7XG52YXIgTmdUYWJsZVNvdXJjZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZVNvdXJjZSgpIHtcbiAgICAgICAgdGhpcy5fcmFuZ2UgPSBudWxsO1xuICAgICAgICB0aGlzLl9yYW5nZU9wdGlvbnMgPSBbNSwgMTAsIDIwLCA1MF07XG4gICAgICAgIHRoaXMuX3BhcmFtcyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZGF0YUNoYW5nZSA9IG5ldyBCZWhhdmlvclN1YmplY3QobnVsbCk7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlU291cmNlLnByb3RvdHlwZSwgXCJsb2FkaW5nXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9hZGluZztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTmdUYWJsZVNvdXJjZS5wcm90b3R5cGUuZ2V0RGF0YSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5fbG9hZGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuc291cmNlKHBhcmFtcyk7XG4gICAgfTtcbiAgICBOZ1RhYmxlU291cmNlLnByb3RvdHlwZS51cGRhdGVEYXRhID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICB0aGlzLl9sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2RhdGFDaGFuZ2UubmV4dChyZXN1bHQpO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2UucHJvdG90eXBlLCBcImNvbm5lY3Rpb25cIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhQ2hhbmdlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVNvdXJjZS5wcm90b3R5cGUsIFwicGFyYW1zXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFyYW1zO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHdhc1NldCA9IHRoaXMuX3BhcmFtcyAhPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fcGFyYW1zID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2xvYWRpbmcgJiYgd2FzU2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXREYXRhKHRoaXMucGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2UucHJvdG90eXBlLCBcInJhbmdlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmFuZ2UgfHwgMTA7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgd2FzU2V0ID0gdGhpcy5fcmFuZ2UgIT0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX3JhbmdlID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2xvYWRpbmcgJiYgd2FzU2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXREYXRhKHRoaXMucGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2UucHJvdG90eXBlLCBcInJhbmdlT3B0aW9uc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JhbmdlT3B0aW9ucztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5fcmFuZ2VPcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVTb3VyY2U7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZVNvdXJjZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bmd0YWJsZS5zb3VyY2UuanMubWFwIiwidmFyIE5nVGFibGVTb3VyY2VSZXN1bHQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVTb3VyY2VSZXN1bHQoZGF0YSwgdG90YWxSb3dzKSB7XG4gICAgICAgIHRoaXMuX3RvdGFsUm93cyA9IDA7XG4gICAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICAgICAgICB0aGlzLl90b3RhbFJvd3MgPSB0b3RhbFJvd3M7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlU291cmNlUmVzdWx0LnByb3RvdHlwZSwgXCJkYXRhXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2VSZXN1bHQucHJvdG90eXBlLCBcInRvdGFsUm93c1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvdGFsUm93cztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTmdUYWJsZVNvdXJjZVJlc3VsdC5jcmVhdGUgPSBmdW5jdGlvbiAocm93cywgdG90YWxSb3dzKSB7XG4gICAgICAgIHJldHVybiBuZXcgTmdUYWJsZVNvdXJjZVJlc3VsdChyb3dzLCB0b3RhbFJvd3MpO1xuICAgIH07XG4gICAgTmdUYWJsZVNvdXJjZVJlc3VsdC5zaW5nbGVQYWdlID0gZnVuY3Rpb24gKHNvdXJjZSwgcm93cykge1xuICAgICAgICB2YXIgbGlzdCA9IFtdO1xuICAgICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgICB2YXIgcGFyYW1zID0gc291cmNlLnBhcmFtcztcbiAgICAgICAgcm93cy5mb3JFYWNoKGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA+PSBwYXJhbXMub2Zmc2V0ICYmIGluZGV4IDwgcGFyYW1zLm9mZnNldCArIHNvdXJjZS5yYW5nZSkge1xuICAgICAgICAgICAgICAgIGxpc3QucHVzaChyb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBuZXcgTmdUYWJsZVNvdXJjZVJlc3VsdChsaXN0LCByb3dzLmxlbmd0aCk7XG4gICAgfTtcbiAgICByZXR1cm4gTmdUYWJsZVNvdXJjZVJlc3VsdDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlU291cmNlUmVzdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1uZ3RhYmxlLnJlc3VsdC5qcy5tYXAiLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IEJyb3dzZXJBbmltYXRpb25zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7IE5nVGFibGUgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50JztcbmltcG9ydCB7IE5nVGFibGVIZWFkZXJSb3cgfSBmcm9tICcuL2NvbXBvbmVudHMvaGVhZGVyLXJvdy5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmdUYWJsZUhlYWRlckNlbGwgfSBmcm9tICcuL2NvbXBvbmVudHMvaGVhZGVyLWNlbGwuY29tcG9uZW50JztcbmltcG9ydCB7IE5nVGFibGVSb3cgfSBmcm9tICcuL2NvbXBvbmVudHMvcm93LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ1RhYmxlQ2VsbCB9IGZyb20gJy4vY29tcG9uZW50cy9jZWxsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ1RhYmxlUGFnaW5hdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL3BhZ2luYXRvci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWF0ZXJpYWxNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBGbGV4TGF5b3V0TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQnO1xuaW1wb3J0ICdoYW1tZXJqcyc7XG5leHBvcnQgeyBOZ1RhYmxlSW5pdEV2ZW50LCBOZ1RhYmxlRGVzdHJveUV2ZW50LCBOZ1RhYmxlQmVmb3JlQ29ubmVjdEV2ZW50LCBOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQsIE5nVGFibGVSYW5nZUV2ZW50IH0gZnJvbSAnLi9uZ3RhYmxlLmV2ZW50cyc7XG5leHBvcnQgeyBOZ1RhYmxlU291cmNlIH0gZnJvbSAnLi9uZ3RhYmxlLnNvdXJjZSc7XG5leHBvcnQgeyBOZ1RhYmxlU291cmNlUmVzdWx0IH0gZnJvbSAnLi9uZ3RhYmxlLnJlc3VsdCc7XG5leHBvcnQgeyBOZ1RhYmxlIH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLmNvbXBvbmVudCc7XG5leHBvcnQgeyBOZ1RhYmxlSGVhZGVyUm93IH0gZnJvbSAnLi9jb21wb25lbnRzL2hlYWRlci1yb3cuY29tcG9uZW50JztcbmV4cG9ydCB7IE5nVGFibGVIZWFkZXJDZWxsIH0gZnJvbSAnLi9jb21wb25lbnRzL2hlYWRlci1jZWxsLmNvbXBvbmVudCc7XG5leHBvcnQgeyBOZ1RhYmxlUm93IH0gZnJvbSAnLi9jb21wb25lbnRzL3Jvdy5jb21wb25lbnQnO1xuZXhwb3J0IHsgTmdUYWJsZUNlbGwgfSBmcm9tICcuL2NvbXBvbmVudHMvY2VsbC5jb21wb25lbnQnO1xuZXhwb3J0IHsgTmdUYWJsZVBhZ2luYXRvciB9IGZyb20gJy4vY29tcG9uZW50cy9wYWdpbmF0b3IuY29tcG9uZW50JztcbnZhciByb3V0ZXMgPSBbXTtcbnZhciBOZ1RhYmxlUm91dGluZ01vZHVsZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZVJvdXRpbmdNb2R1bGUoKSB7XG4gICAgfVxuICAgIHJldHVybiBOZ1RhYmxlUm91dGluZ01vZHVsZTtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlUm91dGluZ01vZHVsZSB9O1xuTmdUYWJsZVJvdXRpbmdNb2R1bGUuZGVjb3JhdG9ycyA9IFtcbiAgICB7IHR5cGU6IE5nTW9kdWxlLCBhcmdzOiBbe1xuICAgICAgICAgICAgICAgIGltcG9ydHM6IFtSb3V0ZXJNb2R1bGUuZm9yUm9vdChyb3V0ZXMpXSxcbiAgICAgICAgICAgICAgICBleHBvcnRzOiBbUm91dGVyTW9kdWxlXVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlUm91dGluZ01vZHVsZS5jdG9yUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtdOyB9O1xudmFyIE5nVGFibGVNb2R1bGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVNb2R1bGUoKSB7XG4gICAgfVxuICAgIHJldHVybiBOZ1RhYmxlTW9kdWxlO1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVNb2R1bGUgfTtcbk5nVGFibGVNb2R1bGUuZGVjb3JhdG9ycyA9IFtcbiAgICB7IHR5cGU6IE5nTW9kdWxlLCBhcmdzOiBbe1xuICAgICAgICAgICAgICAgIGltcG9ydHM6IFtcbiAgICAgICAgICAgICAgICAgICAgQnJvd3Nlck1vZHVsZSxcbiAgICAgICAgICAgICAgICAgICAgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUsXG4gICAgICAgICAgICAgICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgICAgICAgICAgICAgRm9ybXNNb2R1bGUsXG4gICAgICAgICAgICAgICAgICAgIEZsZXhMYXlvdXRNb2R1bGUsXG4gICAgICAgICAgICAgICAgICAgIE1hdGVyaWFsTW9kdWxlLFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlUm91dGluZ01vZHVsZVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGUsXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVIZWFkZXJSb3csXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVIZWFkZXJDZWxsLFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlUm93LFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlQ2VsbCxcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZVBhZ2luYXRvclxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBbXSxcbiAgICAgICAgICAgICAgICBleHBvcnRzOiBbXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGUsXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVIZWFkZXJSb3csXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVIZWFkZXJDZWxsLFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlUm93LFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlQ2VsbCxcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZVBhZ2luYXRvclxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuTmdUYWJsZU1vZHVsZS5jdG9yUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtdOyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLmpzLm1hcCJdLCJuYW1lcyI6WyJFdmVudEVtaXR0ZXIiLCJDb21wb25lbnQiLCJBY3RpdmF0ZWRSb3V0ZSIsIk91dHB1dCIsIklucHV0IiwiQmVoYXZpb3JTdWJqZWN0IiwiTmdNb2R1bGUiLCJSb3V0ZXJNb2R1bGUiLCJCcm93c2VyTW9kdWxlIiwiQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUiLCJDb21tb25Nb2R1bGUiLCJGb3Jtc01vZHVsZSIsIkZsZXhMYXlvdXRNb2R1bGUiLCJNYXRlcmlhbE1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBSSxnQkFBZ0IsSUFBSSxZQUFZO0lBQ2hDLFNBQVMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFO1FBQzdCLElBQUksQ0FBQyxN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
