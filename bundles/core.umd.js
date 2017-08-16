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
                styleUrls: ['./table.component.scss'],
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
NgTablePaginator.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ng-table-paginator',
                templateUrl: './paginator.component.html',
                styleUrls: ['./paginator.component.scss'],
                host: { 'class': 'ng-table-paginator' }
            },] },
];
/** @nocollapse */
NgTablePaginator.ctorParameters = function () { return []; };
NgTablePaginator.propDecorators = {
    'table': [{ type: _angular_core.Input },],
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
                    NgTableRow,
                    NgTableCell,
                    NgTablePaginator
                ],
                providers: [],
                exports: [
                    NgTable,
                    NgTableHeaderRow,
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
exports.NgTableRow = NgTableRow;
exports.NgTableCell = NgTableCell;
exports.NgTablePaginator = NgTablePaginator;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS51bWQuanMiLCJzb3VyY2VzIjpbIi4uL2Rpc3Qvbmd0YWJsZS5ldmVudHMuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50LmpzIiwiLi4vZGlzdC9jb21wb25lbnRzL2hlYWRlci1yb3cuY29tcG9uZW50LmpzIiwiLi4vZGlzdC9jb21wb25lbnRzL3Jvdy5jb21wb25lbnQuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvY2VsbC5jb21wb25lbnQuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvcGFnaW5hdG9yLmNvbXBvbmVudC5qcyIsIi4uL2Rpc3Qvbmd0YWJsZS5zb3VyY2UuanMiLCIuLi9kaXN0L25ndGFibGUucmVzdWx0LmpzIiwiLi4vZGlzdC9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIE5nVGFibGVJbml0RXZlbnQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVJbml0RXZlbnQodGFibGUpIHtcbiAgICAgICAgdGhpcy5fdGFibGUgPSB0YWJsZTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVJbml0RXZlbnQucHJvdG90eXBlLCBcInRhYmxlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFibGU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiBOZ1RhYmxlSW5pdEV2ZW50O1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVJbml0RXZlbnQgfTtcbnZhciBOZ1RhYmxlRGVzdHJveUV2ZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlRGVzdHJveUV2ZW50KHRhYmxlKSB7XG4gICAgICAgIHRoaXMuX3RhYmxlID0gdGFibGU7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlRGVzdHJveUV2ZW50LnByb3RvdHlwZSwgXCJ0YWJsZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gTmdUYWJsZURlc3Ryb3lFdmVudDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlRGVzdHJveUV2ZW50IH07XG52YXIgTmdUYWJsZUJlZm9yZUNvbm5lY3RFdmVudCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZUJlZm9yZUNvbm5lY3RFdmVudCh0YWJsZSwgcGFyYW1zKSB7XG4gICAgICAgIHRoaXMuX3RhYmxlID0gdGFibGU7XG4gICAgICAgIHRoaXMuX3BhcmFtcyA9IHBhcmFtcztcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVCZWZvcmVDb25uZWN0RXZlbnQucHJvdG90eXBlLCBcInRhYmxlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFibGU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlQmVmb3JlQ29ubmVjdEV2ZW50LnByb3RvdHlwZSwgXCJwYXJhbXNcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXJhbXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiBOZ1RhYmxlQmVmb3JlQ29ubmVjdEV2ZW50O1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVCZWZvcmVDb25uZWN0RXZlbnQgfTtcbnZhciBOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVBZnRlckNvbm5lY3RFdmVudCh0YWJsZSwgcmVzdWx0KSB7XG4gICAgICAgIHRoaXMuX3RhYmxlID0gdGFibGU7XG4gICAgICAgIHRoaXMuX3Jlc3VsdCA9IHJlc3VsdDtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVBZnRlckNvbm5lY3RFdmVudC5wcm90b3R5cGUsIFwidGFibGVcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90YWJsZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVBZnRlckNvbm5lY3RFdmVudC5wcm90b3R5cGUsIFwicmVzdWx0XCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVzdWx0O1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gTmdUYWJsZUFmdGVyQ29ubmVjdEV2ZW50O1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVBZnRlckNvbm5lY3RFdmVudCB9O1xudmFyIE5nVGFibGVSYW5nZUV2ZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlUmFuZ2VFdmVudCh0YWJsZSwgcmFuZ2UsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fdGFibGUgPSB0YWJsZTtcbiAgICAgICAgdGhpcy5fcmFuZ2UgPSByYW5nZTtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlUmFuZ2VFdmVudC5wcm90b3R5cGUsIFwidGFibGVcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90YWJsZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVSYW5nZUV2ZW50LnByb3RvdHlwZSwgXCJyYW5nZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JhbmdlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVJhbmdlRXZlbnQucHJvdG90eXBlLCBcIm9wdGlvbnNcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vcHRpb25zO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gTmdUYWJsZVJhbmdlRXZlbnQ7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZVJhbmdlRXZlbnQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5ndGFibGUuZXZlbnRzLmpzLm1hcCIsImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBOZ1RhYmxlSW5pdEV2ZW50LCBOZ1RhYmxlUmFuZ2VFdmVudCwgTmdUYWJsZUJlZm9yZUNvbm5lY3RFdmVudCwgTmdUYWJsZUFmdGVyQ29ubmVjdEV2ZW50LCBOZ1RhYmxlRGVzdHJveUV2ZW50IH0gZnJvbSAnLi4vbmd0YWJsZS5ldmVudHMnO1xudmFyIE5nVGFibGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGUoYWN0aXZlUm91dGUpIHtcbiAgICAgICAgdGhpcy5hY3RpdmVSb3V0ZSA9IGFjdGl2ZVJvdXRlO1xuICAgICAgICB0aGlzLl9yb3dzID0gW107XG4gICAgICAgIHRoaXMuX3RvdGFsUm93cyA9IDA7XG4gICAgICAgIHRoaXMuX3BhZ2UgPSAxO1xuICAgICAgICB0aGlzLl90b3RhbFBhZ2VzID0gMDtcbiAgICAgICAgdGhpcy5fZnJvbSA9IDA7XG4gICAgICAgIHRoaXMuX3RvID0gMDtcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcXVlcnlQYWdlID0gJ3BhZ2UnO1xuICAgICAgICB0aGlzLmluaXRFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLmRlc3Ryb3lFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLmJlZm9yZUNvbm5lY3RFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLmFmdGVyQ29ubmVjdEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMucmFuZ2VDaGFuZ2VFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIH1cbiAgICBOZ1RhYmxlLnByb3RvdHlwZS5uZ09uSW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB9O1xuICAgIE5nVGFibGUucHJvdG90eXBlLm5nQWZ0ZXJWaWV3SW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5pbml0RW1pdHRlci5lbWl0KG5ldyBOZ1RhYmxlSW5pdEV2ZW50KHRoaXMpKTtcbiAgICAgICAgdGhpcy5fcXVlcnlTdWJzY3JpYmVyID0gdGhpcy5hY3RpdmVSb3V0ZS5xdWVyeVBhcmFtcy5kZWJvdW5jZVRpbWUoMTApLnN1YnNjcmliZShmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICBfdGhpcy5faW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICAgICAgX3RoaXMuX3BhZ2UgPSBwYXJhbXNbX3RoaXMuX3F1ZXJ5UGFnZV0gPyArcGFyYW1zW190aGlzLl9xdWVyeVBhZ2VdIDogMTtcbiAgICAgICAgICAgIF90aGlzLnJlcXVlc3REYXRhKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmdUYWJsZS5wcm90b3R5cGUubmdPbkRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9kYXRhU291cmNlU3Vic2NyaWJlcikge1xuICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZVN1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHRoaXMuX2RhdGFTb3VyY2VTdWJzY3JpYmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9xdWVyeVN1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgdGhpcy5kZXN0cm95RW1pdHRlci5lbWl0KG5ldyBOZ1RhYmxlRGVzdHJveUV2ZW50KHRoaXMpKTtcbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJkYXRhU291cmNlXCIsIHtcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZSA9IHNvdXJjZTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9kYXRhU291cmNlU3Vic2NyaWJlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFTb3VyY2VTdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlU3Vic2NyaWJlciA9IHRoaXMuX2RhdGFTb3VyY2UuY29ubmVjdGlvbi5zdWJzY3JpYmUoZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX3Jvd3MgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX3RvdGFsUm93cyA9IHJlc3VsdC50b3RhbFJvd3M7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl90b3RhbFBhZ2VzID0gTWF0aC5jZWlsKF90aGlzLl90b3RhbFJvd3MgLyBfdGhpcy5fZGF0YVNvdXJjZS5yYW5nZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfdGhpcy5fcGFnZSA+IF90aGlzLl90b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fcGFnZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2Zyb20gPSAoKF90aGlzLl9wYWdlIC0gMSkgKiBfdGhpcy5fZGF0YVNvdXJjZS5yYW5nZSkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fdG8gPSBfdGhpcy5fZnJvbSArIF90aGlzLl9kYXRhU291cmNlLnJhbmdlIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF90aGlzLl90byA+IF90aGlzLl90b3RhbFJvd3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl90byA9IF90aGlzLl90b3RhbFJvd3M7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuYWZ0ZXJDb25uZWN0RW1pdHRlci5lbWl0KG5ldyBOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQoX3RoaXMsIHJlc3VsdCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBOZ1RhYmxlLnByb3RvdHlwZS5yZXF1ZXN0RGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9kYXRhU291cmNlLmxvYWRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuX2RhdGFTb3VyY2UucGFyYW1zLm9mZnNldCA9ICh0aGlzLl9wYWdlIC0gMSkgKiB0aGlzLl9kYXRhU291cmNlLnJhbmdlO1xuICAgICAgICAgICAgdGhpcy5iZWZvcmVDb25uZWN0RW1pdHRlci5lbWl0KG5ldyBOZ1RhYmxlQmVmb3JlQ29ubmVjdEV2ZW50KHRoaXMsIHRoaXMuX2RhdGFTb3VyY2UucGFyYW1zKSk7XG4gICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlLmdldERhdGEodGhpcy5fZGF0YVNvdXJjZS5wYXJhbXMpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwicm93c1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jvd3M7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJxdWVyeVBhZ2VcIiwge1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLl9xdWVyeVBhZ2UgPSBuYW1lO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwicGFnZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2U7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2RhdGFTb3VyY2UubG9hZGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhZ2UgPSAraW5kZXg7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3BhZ2UgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhZ2UgPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fcGFnZSA+IHRoaXMuX3RvdGFsUGFnZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFnZSA9IHRoaXMuX3RvdGFsUGFnZXM7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9wYWdlIDwgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFnZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0RGF0YSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwidG90YWxQYWdlc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvdGFsUGFnZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJ0b3RhbFJvd3NcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3RhbFJvd3M7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJmcm9tXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZnJvbTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcInRvXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG87XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJyYW5nZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFTb3VyY2UucmFuZ2U7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2RhdGFTb3VyY2UubG9hZGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFTb3VyY2UucmFuZ2UgPSArdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5yYW5nZUNoYW5nZUVtaXR0ZXIuZW1pdChuZXcgTmdUYWJsZVJhbmdlRXZlbnQodGhpcywgdGhpcy5yYW5nZSwgdGhpcy5yYW5nZU9wdGlvbnMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcInJhbmdlT3B0aW9uc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFTb3VyY2UucmFuZ2VPcHRpb25zO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZS5yYW5nZU9wdGlvbnMgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcImluaXRpYWxpemVkXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW5pdGlhbGl6ZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJsb2FkaW5nXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVNvdXJjZS5sb2FkaW5nO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiZW1wdHlcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3RhbFJvd3MgPT0gMDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTmdUYWJsZS5wcm90b3R5cGUucmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5wYWdlID0gdGhpcy5fcGFnZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOZ1RhYmxlLnByb3RvdHlwZS5wcmV2ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9wYWdlLS07XG4gICAgICAgIGlmICh0aGlzLl9wYWdlIDwgMSkge1xuICAgICAgICAgICAgdGhpcy5fcGFnZSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYWdlID0gdGhpcy5fcGFnZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOZ1RhYmxlLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9wYWdlKys7XG4gICAgICAgIHZhciBwYWdlc01heCA9IHRoaXMudG90YWxQYWdlcztcbiAgICAgICAgaWYgKHRoaXMuX3BhZ2UgPiBwYWdlc01heCkge1xuICAgICAgICAgICAgdGhpcy5fcGFnZSA9IHBhZ2VzTWF4O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGFnZSA9IHRoaXMuX3BhZ2U7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcImhhc1ByZXZcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYWdlID4gMTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcImhhc05leHRcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYWdlIDwgdGhpcy5fdG90YWxQYWdlcztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcImlzRmlyc3RcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYWdlID09IDE7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJpc0xhc3RcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYWdlID09IHRoaXMuX3RvdGFsUGFnZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiBOZ1RhYmxlO1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGUgfTtcbk5nVGFibGUuZGVjb3JhdG9ycyA9IFtcbiAgICB7IHR5cGU6IENvbXBvbmVudCwgYXJnczogW3tcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ25nLXRhYmxlJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogXCJcXG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cXG4gIFwiLFxuICAgICAgICAgICAgICAgIHN0eWxlVXJsczogWycuL3RhYmxlLmNvbXBvbmVudC5zY3NzJ10sXG4gICAgICAgICAgICAgICAgaG9zdDogeyAnY2xhc3MnOiAnbmctdGFibGUnIH1cbiAgICAgICAgICAgIH0sXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuTmdUYWJsZS5jdG9yUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtcbiAgICB7IHR5cGU6IEFjdGl2YXRlZFJvdXRlLCB9LFxuXTsgfTtcbk5nVGFibGUucHJvcERlY29yYXRvcnMgPSB7XG4gICAgJ2luaXRFbWl0dGVyJzogW3sgdHlwZTogT3V0cHV0LCBhcmdzOiBbJ2luaXQnLF0gfSxdLFxuICAgICdkZXN0cm95RW1pdHRlcic6IFt7IHR5cGU6IE91dHB1dCwgYXJnczogWydkZXN0cm95JyxdIH0sXSxcbiAgICAnYmVmb3JlQ29ubmVjdEVtaXR0ZXInOiBbeyB0eXBlOiBPdXRwdXQsIGFyZ3M6IFsnYmVmb3JlQ29ubmVjdCcsXSB9LF0sXG4gICAgJ2FmdGVyQ29ubmVjdEVtaXR0ZXInOiBbeyB0eXBlOiBPdXRwdXQsIGFyZ3M6IFsnYWZ0ZXJDb25uZWN0JyxdIH0sXSxcbiAgICAncmFuZ2VDaGFuZ2VFbWl0dGVyJzogW3sgdHlwZTogT3V0cHV0LCBhcmdzOiBbJ3JhbmdlQ2hhbmdlJyxdIH0sXSxcbiAgICAnZGF0YVNvdXJjZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbiAgICAncXVlcnlQYWdlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuICAgICdwYWdlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuICAgICdyYW5nZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbiAgICAncmFuZ2VPcHRpb25zJzogW3sgdHlwZTogSW5wdXQgfSxdLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRhYmxlLmNvbXBvbmVudC5qcy5tYXAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbnZhciBOZ1RhYmxlSGVhZGVyUm93ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlSGVhZGVyUm93KCkge1xuICAgIH1cbiAgICByZXR1cm4gTmdUYWJsZUhlYWRlclJvdztcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlSGVhZGVyUm93IH07XG5OZ1RhYmxlSGVhZGVyUm93LmRlY29yYXRvcnMgPSBbXG4gICAgeyB0eXBlOiBDb21wb25lbnQsIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICduZy10YWJsZS1oZWFkZXItcm93JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogXCJcXG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cXG4gIFwiLFxuICAgICAgICAgICAgICAgIGhvc3Q6IHsgJ2NsYXNzJzogJ25nLXRhYmxlLWhlYWRlci1yb3cnIH1cbiAgICAgICAgICAgIH0sXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuTmdUYWJsZUhlYWRlclJvdy5jdG9yUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtdOyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGVhZGVyLXJvdy5jb21wb25lbnQuanMubWFwIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG52YXIgTmdUYWJsZVJvdyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZVJvdygpIHtcbiAgICB9XG4gICAgcmV0dXJuIE5nVGFibGVSb3c7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZVJvdyB9O1xuTmdUYWJsZVJvdy5kZWNvcmF0b3JzID0gW1xuICAgIHsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnbmctdGFibGUtcm93JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogXCJcXG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cXG4gIFwiLFxuICAgICAgICAgICAgICAgIGhvc3Q6IHsgJ2NsYXNzJzogJ25nLXRhYmxlLXJvdycgfVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlUm93LmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW107IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yb3cuY29tcG9uZW50LmpzLm1hcCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xudmFyIE5nVGFibGVDZWxsID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlQ2VsbCgpIHtcbiAgICB9XG4gICAgcmV0dXJuIE5nVGFibGVDZWxsO1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVDZWxsIH07XG5OZ1RhYmxlQ2VsbC5kZWNvcmF0b3JzID0gW1xuICAgIHsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnbmctdGFibGUtY2VsbCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiXFxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XFxuICBcIixcbiAgICAgICAgICAgICAgICBob3N0OiB7ICdjbGFzcyc6ICduZy10YWJsZS1jZWxsJyB9XG4gICAgICAgICAgICB9LF0gfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbk5nVGFibGVDZWxsLmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW107IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jZWxsLmNvbXBvbmVudC5qcy5tYXAiLCJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG52YXIgTmdUYWJsZVBhZ2luYXRvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZVBhZ2luYXRvcigpIHtcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXNpYmxlID0gdHJ1ZTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVQYWdpbmF0b3IucHJvdG90eXBlLCBcIm5nVGFibGVcIiwge1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy50YWJsZSA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVBhZ2luYXRvci5wcm90b3R5cGUsIFwicmFuZ2VWaXNpYmxlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmFuZ2VWaXNpYmxlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChzdGF0dXMpIHtcbiAgICAgICAgICAgIHRoaXMuX3JhbmdlVmlzaWJsZSA9IHN0YXR1cztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTmdUYWJsZVBhZ2luYXRvci5wcm90b3R5cGUuYWN0aW9uUmFuZ2UgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAodGhpcy50YWJsZSkge1xuICAgICAgICAgICAgdGhpcy50YWJsZS5yYW5nZSA9ICtlLnZhbHVlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gTmdUYWJsZVBhZ2luYXRvcjtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlUGFnaW5hdG9yIH07XG5OZ1RhYmxlUGFnaW5hdG9yLmRlY29yYXRvcnMgPSBbXG4gICAgeyB0eXBlOiBDb21wb25lbnQsIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICduZy10YWJsZS1wYWdpbmF0b3InLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi9wYWdpbmF0b3IuY29tcG9uZW50Lmh0bWwnLFxuICAgICAgICAgICAgICAgIHN0eWxlVXJsczogWycuL3BhZ2luYXRvci5jb21wb25lbnQuc2NzcyddLFxuICAgICAgICAgICAgICAgIGhvc3Q6IHsgJ2NsYXNzJzogJ25nLXRhYmxlLXBhZ2luYXRvcicgfVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlUGFnaW5hdG9yLmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW107IH07XG5OZ1RhYmxlUGFnaW5hdG9yLnByb3BEZWNvcmF0b3JzID0ge1xuICAgICd0YWJsZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbiAgICAnbmdUYWJsZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbiAgICAncmFuZ2VWaXNpYmxlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhZ2luYXRvci5jb21wb25lbnQuanMubWFwIiwiaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcy9SeCc7XG52YXIgTmdUYWJsZVNvdXJjZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZVNvdXJjZSgpIHtcbiAgICAgICAgdGhpcy5fcmFuZ2UgPSBudWxsO1xuICAgICAgICB0aGlzLl9yYW5nZU9wdGlvbnMgPSBbNSwgMTAsIDIwLCA1MF07XG4gICAgICAgIHRoaXMuX3BhcmFtcyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZGF0YUNoYW5nZSA9IG5ldyBCZWhhdmlvclN1YmplY3QobnVsbCk7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlU291cmNlLnByb3RvdHlwZSwgXCJsb2FkaW5nXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9hZGluZztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTmdUYWJsZVNvdXJjZS5wcm90b3R5cGUuZ2V0RGF0YSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5fbG9hZGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuc291cmNlKHBhcmFtcyk7XG4gICAgfTtcbiAgICBOZ1RhYmxlU291cmNlLnByb3RvdHlwZS51cGRhdGVEYXRhID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICB0aGlzLl9sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2RhdGFDaGFuZ2UubmV4dChyZXN1bHQpO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2UucHJvdG90eXBlLCBcImNvbm5lY3Rpb25cIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhQ2hhbmdlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVNvdXJjZS5wcm90b3R5cGUsIFwicGFyYW1zXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFyYW1zO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHdhc1NldCA9IHRoaXMuX3BhcmFtcyAhPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fcGFyYW1zID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2xvYWRpbmcgJiYgd2FzU2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXREYXRhKHRoaXMucGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2UucHJvdG90eXBlLCBcInJhbmdlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmFuZ2UgfHwgMTA7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgd2FzU2V0ID0gdGhpcy5fcmFuZ2UgIT0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX3JhbmdlID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2xvYWRpbmcgJiYgd2FzU2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXREYXRhKHRoaXMucGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2UucHJvdG90eXBlLCBcInJhbmdlT3B0aW9uc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JhbmdlT3B0aW9ucztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5fcmFuZ2VPcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVTb3VyY2U7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZVNvdXJjZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bmd0YWJsZS5zb3VyY2UuanMubWFwIiwidmFyIE5nVGFibGVTb3VyY2VSZXN1bHQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVTb3VyY2VSZXN1bHQoZGF0YSwgdG90YWxSb3dzKSB7XG4gICAgICAgIHRoaXMuX3RvdGFsUm93cyA9IDA7XG4gICAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICAgICAgICB0aGlzLl90b3RhbFJvd3MgPSB0b3RhbFJvd3M7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlU291cmNlUmVzdWx0LnByb3RvdHlwZSwgXCJkYXRhXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2VSZXN1bHQucHJvdG90eXBlLCBcInRvdGFsUm93c1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvdGFsUm93cztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTmdUYWJsZVNvdXJjZVJlc3VsdC5jcmVhdGUgPSBmdW5jdGlvbiAocm93cywgdG90YWxSb3dzKSB7XG4gICAgICAgIHJldHVybiBuZXcgTmdUYWJsZVNvdXJjZVJlc3VsdChyb3dzLCB0b3RhbFJvd3MpO1xuICAgIH07XG4gICAgTmdUYWJsZVNvdXJjZVJlc3VsdC5zaW5nbGVQYWdlID0gZnVuY3Rpb24gKHNvdXJjZSwgcm93cykge1xuICAgICAgICB2YXIgbGlzdCA9IFtdO1xuICAgICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgICB2YXIgcGFyYW1zID0gc291cmNlLnBhcmFtcztcbiAgICAgICAgcm93cy5mb3JFYWNoKGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA+PSBwYXJhbXMub2Zmc2V0ICYmIGluZGV4IDwgcGFyYW1zLm9mZnNldCArIHNvdXJjZS5yYW5nZSkge1xuICAgICAgICAgICAgICAgIGxpc3QucHVzaChyb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBuZXcgTmdUYWJsZVNvdXJjZVJlc3VsdChsaXN0LCByb3dzLmxlbmd0aCk7XG4gICAgfTtcbiAgICByZXR1cm4gTmdUYWJsZVNvdXJjZVJlc3VsdDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlU291cmNlUmVzdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1uZ3RhYmxlLnJlc3VsdC5qcy5tYXAiLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IEJyb3dzZXJBbmltYXRpb25zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7IE5nVGFibGUgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50JztcbmltcG9ydCB7IE5nVGFibGVIZWFkZXJSb3cgfSBmcm9tICcuL2NvbXBvbmVudHMvaGVhZGVyLXJvdy5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmdUYWJsZVJvdyB9IGZyb20gJy4vY29tcG9uZW50cy9yb3cuY29tcG9uZW50JztcbmltcG9ydCB7IE5nVGFibGVDZWxsIH0gZnJvbSAnLi9jb21wb25lbnRzL2NlbGwuY29tcG9uZW50JztcbmltcG9ydCB7IE5nVGFibGVQYWdpbmF0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvcGFnaW5hdG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXRlcmlhbE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IEZsZXhMYXlvdXRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dCc7XG5pbXBvcnQgJ2hhbW1lcmpzJztcbmV4cG9ydCB7IE5nVGFibGVJbml0RXZlbnQsIE5nVGFibGVEZXN0cm95RXZlbnQsIE5nVGFibGVCZWZvcmVDb25uZWN0RXZlbnQsIE5nVGFibGVBZnRlckNvbm5lY3RFdmVudCwgTmdUYWJsZVJhbmdlRXZlbnQgfSBmcm9tICcuL25ndGFibGUuZXZlbnRzJztcbmV4cG9ydCB7IE5nVGFibGVTb3VyY2UgfSBmcm9tICcuL25ndGFibGUuc291cmNlJztcbmV4cG9ydCB7IE5nVGFibGVTb3VyY2VSZXN1bHQgfSBmcm9tICcuL25ndGFibGUucmVzdWx0JztcbmV4cG9ydCB7IE5nVGFibGUgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50JztcbmV4cG9ydCB7IE5nVGFibGVIZWFkZXJSb3cgfSBmcm9tICcuL2NvbXBvbmVudHMvaGVhZGVyLXJvdy5jb21wb25lbnQnO1xuZXhwb3J0IHsgTmdUYWJsZVJvdyB9IGZyb20gJy4vY29tcG9uZW50cy9yb3cuY29tcG9uZW50JztcbmV4cG9ydCB7IE5nVGFibGVDZWxsIH0gZnJvbSAnLi9jb21wb25lbnRzL2NlbGwuY29tcG9uZW50JztcbmV4cG9ydCB7IE5nVGFibGVQYWdpbmF0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvcGFnaW5hdG9yLmNvbXBvbmVudCc7XG52YXIgcm91dGVzID0gW107XG52YXIgTmdUYWJsZVJvdXRpbmdNb2R1bGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVSb3V0aW5nTW9kdWxlKCkge1xuICAgIH1cbiAgICByZXR1cm4gTmdUYWJsZVJvdXRpbmdNb2R1bGU7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZVJvdXRpbmdNb2R1bGUgfTtcbk5nVGFibGVSb3V0aW5nTW9kdWxlLmRlY29yYXRvcnMgPSBbXG4gICAgeyB0eXBlOiBOZ01vZHVsZSwgYXJnczogW3tcbiAgICAgICAgICAgICAgICBpbXBvcnRzOiBbUm91dGVyTW9kdWxlLmZvclJvb3Qocm91dGVzKV0sXG4gICAgICAgICAgICAgICAgZXhwb3J0czogW1JvdXRlck1vZHVsZV1cbiAgICAgICAgICAgIH0sXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuTmdUYWJsZVJvdXRpbmdNb2R1bGUuY3RvclBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBbXTsgfTtcbnZhciBOZ1RhYmxlTW9kdWxlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlTW9kdWxlKCkge1xuICAgIH1cbiAgICByZXR1cm4gTmdUYWJsZU1vZHVsZTtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlTW9kdWxlIH07XG5OZ1RhYmxlTW9kdWxlLmRlY29yYXRvcnMgPSBbXG4gICAgeyB0eXBlOiBOZ01vZHVsZSwgYXJnczogW3tcbiAgICAgICAgICAgICAgICBpbXBvcnRzOiBbXG4gICAgICAgICAgICAgICAgICAgIEJyb3dzZXJNb2R1bGUsXG4gICAgICAgICAgICAgICAgICAgIEJyb3dzZXJBbmltYXRpb25zTW9kdWxlLFxuICAgICAgICAgICAgICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgICAgICAgICAgICAgIEZvcm1zTW9kdWxlLFxuICAgICAgICAgICAgICAgICAgICBGbGV4TGF5b3V0TW9kdWxlLFxuICAgICAgICAgICAgICAgICAgICBNYXRlcmlhbE1vZHVsZSxcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZVJvdXRpbmdNb2R1bGVcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlLFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlSGVhZGVyUm93LFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlUm93LFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlQ2VsbCxcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZVBhZ2luYXRvclxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBbXSxcbiAgICAgICAgICAgICAgICBleHBvcnRzOiBbXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGUsXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVIZWFkZXJSb3csXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVSb3csXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVDZWxsLFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlUGFnaW5hdG9yXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlTW9kdWxlLmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW107IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAuanMubWFwIl0sIm5hbWVzIjpbIkV2ZW50RW1pdHRlciIsIkNvbXBvbmVudCIsIkFjdGl2YXRlZFJvdXRlIiwiT3V0cHV0IiwiSW5wdXQiLCJCZWhhdmlvclN1YmplY3QiLCJOZ01vZHVsZSIsIlJvdXRlck1vZHVsZSIsIkJyb3dzZXJNb2R1bGUiLCJCcm93c2VyQW5pbWF0aW9uc01vZHVsZSIsIkNvbW1vbk1vZHVsZSIsIkZvcm1zTW9kdWxlIiwiRmxleExheW91dE1vZHVsZSIsIk1hdGVyaWFsTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJ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
