(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('@angular/forms'), require('@angular/router'), require('hammerjs'), require('rxjs/Rx')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/common', '@angular/core', '@angular/forms', '@angular/router', 'hammerjs', 'rxjs/Rx'], factory) :
	(factory((global.ngtable = {}),global._angular_common,global.ng.core,global._angular_forms,global._angular_router,null,global.rxjs_Rx));
}(this, (function (exports,_angular_common,_angular_core,_angular_forms,_angular_router,hammerjs,rxjs_Rx) { 'use strict';

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
        this._moreRange = 10;
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
    Object.defineProperty(NgTable.prototype, "moreRange", {
        get: function () {
            return this._moreRange;
        },
        set: function (value) {
            this._moreRange = value;
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
    NgTable.prototype.more = function () {
        if (!this._dataSource.loading) {
            this._page = 1;
            this.range = this.range + this._moreRange;
            this.requestData();
        }
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
    'moreRange': [{ type: _angular_core.Input },],
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
NgTableMore.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ng-table-more',
                template: "\n    <button class=\"ng-table-more-button\" *ngIf=\"table.rows.length<table.totalRows\" (click)=\"table.more()\" title=\"Load more\">More</button>\n  ",
                styles: ["\n:host(.ng-table-more) {\n  font-family: Roboto,Helvetica Neue,sans-serif;\n  font-size: 12px;\n  background: #fff;\n  color: rgba(0,0,0,.54);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 56px;\n}\n\n:host(.ng-table-more) /deep/ .ng-table-more-button {\n  width: 100%;\n}\n  "],
                host: { 'class': 'ng-table-more' }
            },] },
];
/** @nocollapse */
NgTableMore.ctorParameters = function () { return []; };
NgTableMore.propDecorators = {
    'table': [{ type: _angular_core.Input },],
    'label': [{ type: _angular_core.Input, args: ['labels',] },],
    'ngTable': [{ type: _angular_core.Input },],
    'rangeVisible': [{ type: _angular_core.Input },],
};

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
                template: "\n1<div class=\"ng-table-paginator-page-size\" *ngIf=\"rangeVisible && !table.empty\">\n  <div class=\"ng-table-paginator-page-size-label\">\n    {{label.items_per_page}}\n  </div>\n  <select class=\"ng-table-paginator-page-size-select\" [(ngModel)]=\"table.range\" (change)=\"actionRange($event)\" [disabled]=\"table.loading\">\n    <option *ngFor=\"let count of table.rangeOptions\" value=\"{{count}}\">{{count}}</option>\n  </select>\n</div>\n<div class=\"ng-table-paginator-page-label\" *ngIf=\"!table.empty\">\n  {{label.page}} {{table.page}} {{label.of_page}} {{table.totalPages}} |\n  {{label.items}} <span *ngIf=\"table.rows.length > 1\">{{table.from}} - {{table.to}}</span>\n  <span *ngIf=\"table.rows.length == 1\">{{table.from}}</span>\n  {{label.of_items}} {{table.totalRows}}\n</div>\n<button *ngIf=\"!table.empty\" (click)=\"table.prev()\" [disabled]=\"!table.hasPrev || table.loading\" title=\"Previous page\">\u21FD</button>\n<button *ngIf=\"!table.empty\" (click)=\"table.next()\" [disabled]=\"!table.hasNext || table.loading\" title=\"Next page\">\u21FE</button>\n  ",
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
    NgTableSource.prototype.refresh = function () {
        if (!this._loading) {
            this.getData(this.params);
        }
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
                    NgTableRoutingModule,
                    _angular_forms.FormsModule
                ],
                declarations: [
                    NgTable,
                    NgTableHeaderRow,
                    NgTableHeaderCell,
                    NgTableRow,
                    NgTableCell,
                    NgTablePaginator,
                    NgTableMore
                ],
                providers: [],
                exports: [
                    NgTable,
                    NgTableHeaderRow,
                    NgTableHeaderCell,
                    NgTableRow,
                    NgTableCell,
                    NgTablePaginator,
                    NgTableMore
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS51bWQuanMiLCJzb3VyY2VzIjpbIi4uL2Rpc3Qvbmd0YWJsZS5ldmVudHMuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50LmpzIiwiLi4vZGlzdC9jb21wb25lbnRzL3Jvdy5jb21wb25lbnQuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvY2VsbC5jb21wb25lbnQuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvaGVhZGVyLXJvdy5jb21wb25lbnQuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvaGVhZGVyLWNlbGwuY29tcG9uZW50LmpzIiwiLi4vZGlzdC9jb21wb25lbnRzL21vcmUuY29tcG9uZW50LmpzIiwiLi4vZGlzdC9jb21wb25lbnRzL3BhZ2luYXRvci5jb21wb25lbnQuanMiLCIuLi9kaXN0L25ndGFibGUuc291cmNlLmpzIiwiLi4vZGlzdC9uZ3RhYmxlLnJlc3VsdC5qcyIsIi4uL2Rpc3QvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBOZ1RhYmxlSW5pdEV2ZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlSW5pdEV2ZW50KHRhYmxlKSB7XG4gICAgICAgIHRoaXMuX3RhYmxlID0gdGFibGU7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlSW5pdEV2ZW50LnByb3RvdHlwZSwgXCJ0YWJsZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gTmdUYWJsZUluaXRFdmVudDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlSW5pdEV2ZW50IH07XG52YXIgTmdUYWJsZURlc3Ryb3lFdmVudCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZURlc3Ryb3lFdmVudCh0YWJsZSkge1xuICAgICAgICB0aGlzLl90YWJsZSA9IHRhYmxlO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZURlc3Ryb3lFdmVudC5wcm90b3R5cGUsIFwidGFibGVcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90YWJsZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVEZXN0cm95RXZlbnQ7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZURlc3Ryb3lFdmVudCB9O1xudmFyIE5nVGFibGVCZWZvcmVDb25uZWN0RXZlbnQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVCZWZvcmVDb25uZWN0RXZlbnQodGFibGUsIHBhcmFtcykge1xuICAgICAgICB0aGlzLl90YWJsZSA9IHRhYmxlO1xuICAgICAgICB0aGlzLl9wYXJhbXMgPSBwYXJhbXM7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlQmVmb3JlQ29ubmVjdEV2ZW50LnByb3RvdHlwZSwgXCJ0YWJsZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZUJlZm9yZUNvbm5lY3RFdmVudC5wcm90b3R5cGUsIFwicGFyYW1zXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFyYW1zO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gTmdUYWJsZUJlZm9yZUNvbm5lY3RFdmVudDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlQmVmb3JlQ29ubmVjdEV2ZW50IH07XG52YXIgTmdUYWJsZUFmdGVyQ29ubmVjdEV2ZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQodGFibGUsIHJlc3VsdCkge1xuICAgICAgICB0aGlzLl90YWJsZSA9IHRhYmxlO1xuICAgICAgICB0aGlzLl9yZXN1bHQgPSByZXN1bHQ7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQucHJvdG90eXBlLCBcInRhYmxlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFibGU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQucHJvdG90eXBlLCBcInJlc3VsdFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VsdDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVBZnRlckNvbm5lY3RFdmVudDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQgfTtcbnZhciBOZ1RhYmxlUmFuZ2VFdmVudCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZVJhbmdlRXZlbnQodGFibGUsIHJhbmdlLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX3RhYmxlID0gdGFibGU7XG4gICAgICAgIHRoaXMuX3JhbmdlID0gcmFuZ2U7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVJhbmdlRXZlbnQucHJvdG90eXBlLCBcInRhYmxlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFibGU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlUmFuZ2VFdmVudC5wcm90b3R5cGUsIFwicmFuZ2VcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yYW5nZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVSYW5nZUV2ZW50LnByb3RvdHlwZSwgXCJvcHRpb25zXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVSYW5nZUV2ZW50O1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVSYW5nZUV2ZW50IH07XG52YXIgTmdUYWJsZVNvdXJjZVVwZGF0ZUV2ZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlU291cmNlVXBkYXRlRXZlbnQoc291cmNlLCByZXN1bHQpIHtcbiAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlO1xuICAgICAgICB0aGlzLl9yZXN1bHQgPSByZXN1bHQ7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlU291cmNlVXBkYXRlRXZlbnQucHJvdG90eXBlLCBcInNvdXJjZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2VVcGRhdGVFdmVudC5wcm90b3R5cGUsIFwicmVzdWx0XCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVzdWx0O1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gTmdUYWJsZVNvdXJjZVVwZGF0ZUV2ZW50O1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVTb3VyY2VVcGRhdGVFdmVudCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bmd0YWJsZS5ldmVudHMuanMubWFwIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE5nVGFibGVBZnRlckNvbm5lY3RFdmVudCwgTmdUYWJsZUJlZm9yZUNvbm5lY3RFdmVudCwgTmdUYWJsZURlc3Ryb3lFdmVudCwgTmdUYWJsZUluaXRFdmVudCwgTmdUYWJsZVJhbmdlRXZlbnQgfSBmcm9tICcuLi9uZ3RhYmxlLmV2ZW50cyc7XG52YXIgTmdUYWJsZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZShhY3RpdmVSb3V0ZSkge1xuICAgICAgICB0aGlzLmFjdGl2ZVJvdXRlID0gYWN0aXZlUm91dGU7XG4gICAgICAgIHRoaXMuX3Jvd3MgPSBbXTtcbiAgICAgICAgdGhpcy5fdG90YWxSb3dzID0gMDtcbiAgICAgICAgdGhpcy5fcGFnZSA9IDE7XG4gICAgICAgIHRoaXMuX3RvdGFsUGFnZXMgPSAwO1xuICAgICAgICB0aGlzLl9mcm9tID0gMDtcbiAgICAgICAgdGhpcy5fdG8gPSAwO1xuICAgICAgICB0aGlzLl9tb3JlUmFuZ2UgPSAxMDtcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcXVlcnlQYWdlID0gJ3BhZ2UnO1xuICAgICAgICB0aGlzLmluaXRFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLmRlc3Ryb3lFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLmJlZm9yZUNvbm5lY3RFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLnNvdXJjZVVwZGF0ZUVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMuYWZ0ZXJDb25uZWN0RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5yYW5nZUNoYW5nZUVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgfVxuICAgIE5nVGFibGUucHJvdG90eXBlLm5nT25Jbml0ID0gZnVuY3Rpb24gKCkge1xuICAgIH07XG4gICAgTmdUYWJsZS5wcm90b3R5cGUubmdBZnRlclZpZXdJbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmluaXRFbWl0dGVyLmVtaXQobmV3IE5nVGFibGVJbml0RXZlbnQodGhpcykpO1xuICAgICAgICB0aGlzLl9xdWVyeVN1YnNjcmliZXIgPSB0aGlzLmFjdGl2ZVJvdXRlLnF1ZXJ5UGFyYW1zLmRlYm91bmNlVGltZSgxMCkuc3Vic2NyaWJlKGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgIF90aGlzLl9pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgICAgICBfdGhpcy5fcGFnZSA9IHBhcmFtc1tfdGhpcy5fcXVlcnlQYWdlXSA/ICtwYXJhbXNbX3RoaXMuX3F1ZXJ5UGFnZV0gOiAxO1xuICAgICAgICAgICAgX3RoaXMucmVxdWVzdERhdGEoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBOZ1RhYmxlLnByb3RvdHlwZS5uZ09uRGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2RhdGFTb3VyY2VTdWJzY3JpYmVyKSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlU3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZVN1YnNjcmliZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3F1ZXJ5U3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICB0aGlzLmRlc3Ryb3lFbWl0dGVyLmVtaXQobmV3IE5nVGFibGVEZXN0cm95RXZlbnQodGhpcykpO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcImRhdGFTb3VyY2VcIiwge1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlID0gc291cmNlO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2RhdGFTb3VyY2VTdWJzY3JpYmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZVN1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2RhdGFTb3VyY2Uuc291cmNlVXBkYXRlLnN1YnNjcmliZShmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnNvdXJjZVVwZGF0ZUVtaXR0ZXIuZW1pdChlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZVN1YnNjcmliZXIgPSB0aGlzLl9kYXRhU291cmNlLmNvbm5lY3Rpb24uc3Vic2NyaWJlKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmNhbGN1bGF0ZShyZXN1bHQuZGF0YSwgcmVzdWx0LnRvdGFsUm93cyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBldmVudF8xID0gbmV3IE5nVGFibGVBZnRlckNvbm5lY3RFdmVudChfdGhpcywgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuYWZ0ZXJDb25uZWN0RW1pdHRlci5lbWl0KGV2ZW50XzEpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGF0YVNvdXJjZS5hZnRlckNvbm5lY3QuZW1pdChldmVudF8xKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTmdUYWJsZS5wcm90b3R5cGUuY2FsY3VsYXRlID0gZnVuY3Rpb24gKHJvd3MsIHRvdGFsUm93cykge1xuICAgICAgICB0aGlzLl9yb3dzID0gcm93cztcbiAgICAgICAgdGhpcy5fdG90YWxSb3dzID0gdG90YWxSb3dzO1xuICAgICAgICB0aGlzLl90b3RhbFBhZ2VzID0gTWF0aC5jZWlsKHRoaXMuX3RvdGFsUm93cyAvIHRoaXMuX2RhdGFTb3VyY2UucmFuZ2UpO1xuICAgICAgICBpZiAodGhpcy5fcGFnZSA+IHRoaXMuX3RvdGFsUGFnZXMpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhZ2UgPSAxO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2Zyb20gPSAoKHRoaXMuX3BhZ2UgLSAxKSAqIHRoaXMuX2RhdGFTb3VyY2UucmFuZ2UpICsgMTtcbiAgICAgICAgdGhpcy5fdG8gPSB0aGlzLl9mcm9tICsgdGhpcy5fZGF0YVNvdXJjZS5yYW5nZSAtIDE7XG4gICAgICAgIGlmICh0aGlzLl90byA+IHRoaXMuX3RvdGFsUm93cykge1xuICAgICAgICAgICAgdGhpcy5fdG8gPSB0aGlzLl90b3RhbFJvd3M7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE5nVGFibGUucHJvdG90eXBlLnJlcXVlc3REYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2RhdGFTb3VyY2UubG9hZGluZykge1xuICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZS5wYXJhbXMub2Zmc2V0ID0gKHRoaXMuX3BhZ2UgLSAxKSAqIHRoaXMuX2RhdGFTb3VyY2UucmFuZ2U7XG4gICAgICAgICAgICB2YXIgZXZlbnRfMiA9IG5ldyBOZ1RhYmxlQmVmb3JlQ29ubmVjdEV2ZW50KHRoaXMsIHRoaXMuX2RhdGFTb3VyY2UucGFyYW1zKTtcbiAgICAgICAgICAgIHRoaXMuYmVmb3JlQ29ubmVjdEVtaXR0ZXIuZW1pdChldmVudF8yKTtcbiAgICAgICAgICAgIHRoaXMuX2RhdGFTb3VyY2UuYmVmb3JlQ29ubmVjdC5lbWl0KGV2ZW50XzIpO1xuICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZS5nZXREYXRhKHRoaXMuX2RhdGFTb3VyY2UucGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTmdUYWJsZS5wcm90b3R5cGUucmVtb3ZlUm93ID0gZnVuY3Rpb24gKHJvdykge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9yb3dzLmluZGV4T2Yocm93KTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX3Jvd3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhbGN1bGF0ZSh0aGlzLl9yb3dzLCB0aGlzLnRvdGFsUm93cyAtIDEpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE5nVGFibGUucHJvdG90eXBlLnVwZGF0ZVJvdyA9IGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5fcm93cy5pbmRleE9mKHJvdyk7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9yb3dzLnNwbGljZShpbmRleCwgMSwgcm93KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE5nVGFibGUucHJvdG90eXBlLmFkZFJvdyA9IGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgdGhpcy5fcm93cy5wdXNoKHJvdyk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlKHRoaXMuX3Jvd3MsIHRoaXMudG90YWxSb3dzICsgMSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcInJvd3NcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb3dzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwicXVlcnlQYWdlXCIsIHtcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgdGhpcy5fcXVlcnlQYWdlID0gbmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcInBhZ2VcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYWdlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9kYXRhU291cmNlLmxvYWRpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wYWdlID0gK2luZGV4O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9wYWdlIDwgMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYWdlID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3BhZ2UgPiB0aGlzLl90b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhZ2UgPSB0aGlzLl90b3RhbFBhZ2VzO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fcGFnZSA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhZ2UgPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdERhdGEoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcInRvdGFsUGFnZXNcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3RhbFBhZ2VzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwidG90YWxSb3dzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG90YWxSb3dzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiZnJvbVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Zyb207XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJ0b1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwicmFuZ2VcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhU291cmNlLnJhbmdlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9kYXRhU291cmNlLmxvYWRpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlLnJhbmdlID0gK3ZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VDaGFuZ2VFbWl0dGVyLmVtaXQobmV3IE5nVGFibGVSYW5nZUV2ZW50KHRoaXMsIHRoaXMucmFuZ2UsIHRoaXMucmFuZ2VPcHRpb25zKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJtb3JlUmFuZ2VcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb3JlUmFuZ2U7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9tb3JlUmFuZ2UgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcInJhbmdlT3B0aW9uc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFTb3VyY2UucmFuZ2VPcHRpb25zO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZS5yYW5nZU9wdGlvbnMgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcImluaXRpYWxpemVkXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW5pdGlhbGl6ZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJsb2FkaW5nXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVNvdXJjZS5sb2FkaW5nO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiZW1wdHlcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3RhbFJvd3MgPT0gMDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTmdUYWJsZS5wcm90b3R5cGUucmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5wYWdlID0gdGhpcy5fcGFnZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOZ1RhYmxlLnByb3RvdHlwZS5tb3JlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2RhdGFTb3VyY2UubG9hZGluZykge1xuICAgICAgICAgICAgdGhpcy5fcGFnZSA9IDE7XG4gICAgICAgICAgICB0aGlzLnJhbmdlID0gdGhpcy5yYW5nZSArIHRoaXMuX21vcmVSYW5nZTtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdERhdGEoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE5nVGFibGUucHJvdG90eXBlLnByZXYgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3BhZ2UtLTtcbiAgICAgICAgaWYgKHRoaXMuX3BhZ2UgPCAxKSB7XG4gICAgICAgICAgICB0aGlzLl9wYWdlID0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhZ2UgPSB0aGlzLl9wYWdlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE5nVGFibGUucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3BhZ2UrKztcbiAgICAgICAgdmFyIHBhZ2VzTWF4ID0gdGhpcy50b3RhbFBhZ2VzO1xuICAgICAgICBpZiAodGhpcy5fcGFnZSA+IHBhZ2VzTWF4KSB7XG4gICAgICAgICAgICB0aGlzLl9wYWdlID0gcGFnZXNNYXg7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYWdlID0gdGhpcy5fcGFnZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiaGFzUHJldlwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2UgPiAxO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiaGFzTmV4dFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2UgPCB0aGlzLl90b3RhbFBhZ2VzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiaXNGaXJzdFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2UgPT0gMTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcImlzTGFzdFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2UgPT0gdGhpcy5fdG90YWxQYWdlcztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGU7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZSB9O1xuTmdUYWJsZS5kZWNvcmF0b3JzID0gW1xuICAgIHsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnbmctdGFibGUnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBcIlxcbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxcbiAgXCIsXG4gICAgICAgICAgICAgICAgc3R5bGVzOiBbXCJcXG46aG9zdCgubmctdGFibGUpIHtcXG4gIGJhY2tncm91bmQ6ICNmZmY7XFxuICBvdmVyZmxvdzogYXV0bztcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUpIC9kZWVwLyAubmctdGFibGUtaGVhZGVyLXJvdyxcXG46aG9zdCgubmctdGFibGUpIC9kZWVwLyAubmctdGFibGUtcm93IHtcXG4gIGJvcmRlci1ib3R0b20tY29sb3I6IHJnYmEoMCwgMCwgMCwgLjEyKTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBib3JkZXItYm90dG9tLXdpZHRoOiAxcHg7XFxuICBib3JkZXItYm90dG9tLXN0eWxlOiBzb2xpZDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBtaW4taGVpZ2h0OiA0OHB4O1xcbiAgcGFkZGluZzogMCAxMnB4O1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUpIC9kZWVwLyAubmctdGFibGUtaGVhZGVyLWNlbGwge1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbiAgZm9udC13ZWlnaHQ6IDUwMDtcXG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC41NCk7XFxuICBmbGV4OiAxO1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUpIC9kZWVwLyAubmctdGFibGUtY2VsbCB7XFxuICBmb250LXNpemU6IDE0cHg7XFxuICBjb2xvcjogcmdiYSgwLDAsMCwuODcpO1xcbiAgZmxleDogMTtcXG59XFxuXFxuOmhvc3QoLm5nLXRhYmxlKSAvZGVlcC8gLm5nLXRhYmxlLWljb24ge1xcbiAgd2lkdGg6IDQwcHg7XFxuICBoZWlnaHQ6IDQwcHg7XFxufVxcblxcbjpob3N0KC5uZy10YWJsZS1zdHJpcGVkKSAvZGVlcC8gLm5nLXRhYmxlLXJvdzpudGgtb2YtdHlwZShvZGQpIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmOWY5Zjk7XFxufVxcblxcbjpob3N0KC5uZy10YWJsZS1zdHJpcGVkLm5nLXRhYmxlLWhvdmVyKSAvZGVlcC8gLm5nLXRhYmxlLXJvdzpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjVmNWY1O1xcbn1cXG4gIFwiXSxcbiAgICAgICAgICAgICAgICBob3N0OiB7ICdjbGFzcyc6ICduZy10YWJsZScgfVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlLmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW1xuICAgIHsgdHlwZTogQWN0aXZhdGVkUm91dGUsIH0sXG5dOyB9O1xuTmdUYWJsZS5wcm9wRGVjb3JhdG9ycyA9IHtcbiAgICAnaW5pdEVtaXR0ZXInOiBbeyB0eXBlOiBPdXRwdXQsIGFyZ3M6IFsnaW5pdCcsXSB9LF0sXG4gICAgJ2Rlc3Ryb3lFbWl0dGVyJzogW3sgdHlwZTogT3V0cHV0LCBhcmdzOiBbJ2Rlc3Ryb3knLF0gfSxdLFxuICAgICdiZWZvcmVDb25uZWN0RW1pdHRlcic6IFt7IHR5cGU6IE91dHB1dCwgYXJnczogWydiZWZvcmVDb25uZWN0JyxdIH0sXSxcbiAgICAnc291cmNlVXBkYXRlRW1pdHRlcic6IFt7IHR5cGU6IE91dHB1dCwgYXJnczogWydzb3VyY2VVcGRhdGUnLF0gfSxdLFxuICAgICdhZnRlckNvbm5lY3RFbWl0dGVyJzogW3sgdHlwZTogT3V0cHV0LCBhcmdzOiBbJ2FmdGVyQ29ubmVjdCcsXSB9LF0sXG4gICAgJ3JhbmdlQ2hhbmdlRW1pdHRlcic6IFt7IHR5cGU6IE91dHB1dCwgYXJnczogWydyYW5nZUNoYW5nZScsXSB9LF0sXG4gICAgJ2RhdGFTb3VyY2UnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4gICAgJ3F1ZXJ5UGFnZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbiAgICAncGFnZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbiAgICAncmFuZ2UnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4gICAgJ21vcmVSYW5nZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbiAgICAncmFuZ2VPcHRpb25zJzogW3sgdHlwZTogSW5wdXQgfSxdLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRhYmxlLmNvbXBvbmVudC5qcy5tYXAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nVGFibGUgfSBmcm9tICcuL3RhYmxlLmNvbXBvbmVudCc7XG52YXIgTmdUYWJsZVJvdyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZVJvdyhwYXJlbnQpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBOZ1RhYmxlUm93O1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVSb3cgfTtcbk5nVGFibGVSb3cuZGVjb3JhdG9ycyA9IFtcbiAgICB7IHR5cGU6IENvbXBvbmVudCwgYXJnczogW3tcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ25nLXRhYmxlLXJvdycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiXFxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XFxuICBcIixcbiAgICAgICAgICAgICAgICBob3N0OiB7ICdjbGFzcyc6ICduZy10YWJsZS1yb3cnIH1cbiAgICAgICAgICAgIH0sXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuTmdUYWJsZVJvdy5jdG9yUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtcbiAgICB7IHR5cGU6IE5nVGFibGUsIH0sXG5dOyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cm93LmNvbXBvbmVudC5qcy5tYXAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nVGFibGVSb3cgfSBmcm9tICcuL3Jvdy5jb21wb25lbnQnO1xudmFyIE5nVGFibGVDZWxsID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlQ2VsbChwYXJlbnQpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBOZ1RhYmxlQ2VsbDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlQ2VsbCB9O1xuTmdUYWJsZUNlbGwuZGVjb3JhdG9ycyA9IFtcbiAgICB7IHR5cGU6IENvbXBvbmVudCwgYXJnczogW3tcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ25nLXRhYmxlLWNlbGwnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBcIlxcbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxcbiAgXCIsXG4gICAgICAgICAgICAgICAgaG9zdDogeyAnY2xhc3MnOiAnbmctdGFibGUtY2VsbCcgfVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlQ2VsbC5jdG9yUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtcbiAgICB7IHR5cGU6IE5nVGFibGVSb3csIH0sXG5dOyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2VsbC5jb21wb25lbnQuanMubWFwIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ1RhYmxlIH0gZnJvbSAnLi90YWJsZS5jb21wb25lbnQnO1xudmFyIE5nVGFibGVIZWFkZXJSb3cgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVIZWFkZXJSb3cocGFyZW50KSB7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIH1cbiAgICByZXR1cm4gTmdUYWJsZUhlYWRlclJvdztcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlSGVhZGVyUm93IH07XG5OZ1RhYmxlSGVhZGVyUm93LmRlY29yYXRvcnMgPSBbXG4gICAgeyB0eXBlOiBDb21wb25lbnQsIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICduZy10YWJsZS1oZWFkZXItcm93JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogXCJcXG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cXG4gIFwiLFxuICAgICAgICAgICAgICAgIGhvc3Q6IHsgJ2NsYXNzJzogJ25nLXRhYmxlLWhlYWRlci1yb3cnIH1cbiAgICAgICAgICAgIH0sXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuTmdUYWJsZUhlYWRlclJvdy5jdG9yUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtcbiAgICB7IHR5cGU6IE5nVGFibGUsIH0sXG5dOyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGVhZGVyLXJvdy5jb21wb25lbnQuanMubWFwIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ1RhYmxlSGVhZGVyUm93IH0gZnJvbSAnLi9oZWFkZXItcm93LmNvbXBvbmVudCc7XG52YXIgTmdUYWJsZUhlYWRlckNlbGwgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVIZWFkZXJDZWxsKHBhcmVudCkge1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB9XG4gICAgcmV0dXJuIE5nVGFibGVIZWFkZXJDZWxsO1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVIZWFkZXJDZWxsIH07XG5OZ1RhYmxlSGVhZGVyQ2VsbC5kZWNvcmF0b3JzID0gW1xuICAgIHsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnbmctdGFibGUtaGVhZGVyLWNlbGwnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBcIlxcbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxcbiAgXCIsXG4gICAgICAgICAgICAgICAgaG9zdDogeyAnY2xhc3MnOiAnbmctdGFibGUtaGVhZGVyLWNlbGwnIH1cbiAgICAgICAgICAgIH0sXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuTmdUYWJsZUhlYWRlckNlbGwuY3RvclBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBbXG4gICAgeyB0eXBlOiBOZ1RhYmxlSGVhZGVyUm93LCB9LFxuXTsgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhlYWRlci1jZWxsLmNvbXBvbmVudC5qcy5tYXAiLCJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG52YXIgTmdUYWJsZU1vcmUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVNb3JlKCkge1xuICAgICAgICB0aGlzLl9yYW5nZVZpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLl9sYWJlbCA9IHtcbiAgICAgICAgICAgIGl0ZW1zX3Blcl9wYWdlOiAnSXRlbXMgcGVyIHBhZ2UnLFxuICAgICAgICAgICAgcGFnZTogJ1BhZ2UnLFxuICAgICAgICAgICAgb2ZfcGFnZTogJ29mJyxcbiAgICAgICAgICAgIGl0ZW1zOiAnSXRlbXMnLFxuICAgICAgICAgICAgb2ZfaXRlbXM6ICdvZicsXG4gICAgICAgIH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlTW9yZS5wcm90b3R5cGUsIFwibGFiZWxcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sYWJlbDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xhYmVsID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fbGFiZWwsIHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVNb3JlLnByb3RvdHlwZSwgXCJuZ1RhYmxlXCIsIHtcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMudGFibGUgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVNb3JlLnByb3RvdHlwZSwgXCJyYW5nZVZpc2libGVcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yYW5nZVZpc2libGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHN0YXR1cykge1xuICAgICAgICAgICAgdGhpcy5fcmFuZ2VWaXNpYmxlID0gc3RhdHVzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBOZ1RhYmxlTW9yZS5wcm90b3R5cGUuYWN0aW9uUmFuZ2UgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAodGhpcy50YWJsZSkge1xuICAgICAgICAgICAgdGhpcy50YWJsZS5yYW5nZSA9ICtlLnZhbHVlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gTmdUYWJsZU1vcmU7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZU1vcmUgfTtcbk5nVGFibGVNb3JlLmRlY29yYXRvcnMgPSBbXG4gICAgeyB0eXBlOiBDb21wb25lbnQsIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICduZy10YWJsZS1tb3JlJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogXCJcXG4gICAgPGJ1dHRvbiBjbGFzcz1cXFwibmctdGFibGUtbW9yZS1idXR0b25cXFwiICpuZ0lmPVxcXCJ0YWJsZS5yb3dzLmxlbmd0aDx0YWJsZS50b3RhbFJvd3NcXFwiIChjbGljayk9XFxcInRhYmxlLm1vcmUoKVxcXCIgdGl0bGU9XFxcIkxvYWQgbW9yZVxcXCI+TW9yZTwvYnV0dG9uPlxcbiAgXCIsXG4gICAgICAgICAgICAgICAgc3R5bGVzOiBbXCJcXG46aG9zdCgubmctdGFibGUtbW9yZSkge1xcbiAgZm9udC1mYW1pbHk6IFJvYm90byxIZWx2ZXRpY2EgTmV1ZSxzYW5zLXNlcmlmO1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbiAgYmFja2dyb3VuZDogI2ZmZjtcXG4gIGNvbG9yOiByZ2JhKDAsMCwwLC41NCk7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgbWluLWhlaWdodDogNTZweDtcXG59XFxuXFxuOmhvc3QoLm5nLXRhYmxlLW1vcmUpIC9kZWVwLyAubmctdGFibGUtbW9yZS1idXR0b24ge1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcbiAgXCJdLFxuICAgICAgICAgICAgICAgIGhvc3Q6IHsgJ2NsYXNzJzogJ25nLXRhYmxlLW1vcmUnIH1cbiAgICAgICAgICAgIH0sXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuTmdUYWJsZU1vcmUuY3RvclBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBbXTsgfTtcbk5nVGFibGVNb3JlLnByb3BEZWNvcmF0b3JzID0ge1xuICAgICd0YWJsZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbiAgICAnbGFiZWwnOiBbeyB0eXBlOiBJbnB1dCwgYXJnczogWydsYWJlbHMnLF0gfSxdLFxuICAgICduZ1RhYmxlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuICAgICdyYW5nZVZpc2libGUnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bW9yZS5jb21wb25lbnQuanMubWFwIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xudmFyIE5nVGFibGVQYWdpbmF0b3IgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVQYWdpbmF0b3IoKSB7XG4gICAgICAgIHRoaXMuX3JhbmdlVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuX2xhYmVsID0ge1xuICAgICAgICAgICAgaXRlbXNfcGVyX3BhZ2U6ICdJdGVtcyBwZXIgcGFnZScsXG4gICAgICAgICAgICBwYWdlOiAnUGFnZScsXG4gICAgICAgICAgICBvZl9wYWdlOiAnb2YnLFxuICAgICAgICAgICAgaXRlbXM6ICdJdGVtcycsXG4gICAgICAgICAgICBvZl9pdGVtczogJ29mJyxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVQYWdpbmF0b3IucHJvdG90eXBlLCBcImxhYmVsXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGFiZWw7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9sYWJlbCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX2xhYmVsLCB2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlUGFnaW5hdG9yLnByb3RvdHlwZSwgXCJuZ1RhYmxlXCIsIHtcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMudGFibGUgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVQYWdpbmF0b3IucHJvdG90eXBlLCBcInJhbmdlVmlzaWJsZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JhbmdlVmlzaWJsZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoc3RhdHVzKSB7XG4gICAgICAgICAgICB0aGlzLl9yYW5nZVZpc2libGUgPSBzdGF0dXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE5nVGFibGVQYWdpbmF0b3IucHJvdG90eXBlLmFjdGlvblJhbmdlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHRoaXMudGFibGUpIHtcbiAgICAgICAgICAgIHRoaXMudGFibGUucmFuZ2UgPSArZS52YWx1ZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIE5nVGFibGVQYWdpbmF0b3I7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZVBhZ2luYXRvciB9O1xuTmdUYWJsZVBhZ2luYXRvci5kZWNvcmF0b3JzID0gW1xuICAgIHsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnbmctdGFibGUtcGFnaW5hdG9yJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogXCJcXG4xPGRpdiBjbGFzcz1cXFwibmctdGFibGUtcGFnaW5hdG9yLXBhZ2Utc2l6ZVxcXCIgKm5nSWY9XFxcInJhbmdlVmlzaWJsZSAmJiAhdGFibGUuZW1wdHlcXFwiPlxcbiAgPGRpdiBjbGFzcz1cXFwibmctdGFibGUtcGFnaW5hdG9yLXBhZ2Utc2l6ZS1sYWJlbFxcXCI+XFxuICAgIHt7bGFiZWwuaXRlbXNfcGVyX3BhZ2V9fVxcbiAgPC9kaXY+XFxuICA8c2VsZWN0IGNsYXNzPVxcXCJuZy10YWJsZS1wYWdpbmF0b3ItcGFnZS1zaXplLXNlbGVjdFxcXCIgWyhuZ01vZGVsKV09XFxcInRhYmxlLnJhbmdlXFxcIiAoY2hhbmdlKT1cXFwiYWN0aW9uUmFuZ2UoJGV2ZW50KVxcXCIgW2Rpc2FibGVkXT1cXFwidGFibGUubG9hZGluZ1xcXCI+XFxuICAgIDxvcHRpb24gKm5nRm9yPVxcXCJsZXQgY291bnQgb2YgdGFibGUucmFuZ2VPcHRpb25zXFxcIiB2YWx1ZT1cXFwie3tjb3VudH19XFxcIj57e2NvdW50fX08L29wdGlvbj5cXG4gIDwvc2VsZWN0PlxcbjwvZGl2PlxcbjxkaXYgY2xhc3M9XFxcIm5nLXRhYmxlLXBhZ2luYXRvci1wYWdlLWxhYmVsXFxcIiAqbmdJZj1cXFwiIXRhYmxlLmVtcHR5XFxcIj5cXG4gIHt7bGFiZWwucGFnZX19IHt7dGFibGUucGFnZX19IHt7bGFiZWwub2ZfcGFnZX19IHt7dGFibGUudG90YWxQYWdlc319IHxcXG4gIHt7bGFiZWwuaXRlbXN9fSA8c3BhbiAqbmdJZj1cXFwidGFibGUucm93cy5sZW5ndGggPiAxXFxcIj57e3RhYmxlLmZyb219fSAtIHt7dGFibGUudG99fTwvc3Bhbj5cXG4gIDxzcGFuICpuZ0lmPVxcXCJ0YWJsZS5yb3dzLmxlbmd0aCA9PSAxXFxcIj57e3RhYmxlLmZyb219fTwvc3Bhbj5cXG4gIHt7bGFiZWwub2ZfaXRlbXN9fSB7e3RhYmxlLnRvdGFsUm93c319XFxuPC9kaXY+XFxuPGJ1dHRvbiAqbmdJZj1cXFwiIXRhYmxlLmVtcHR5XFxcIiAoY2xpY2spPVxcXCJ0YWJsZS5wcmV2KClcXFwiIFtkaXNhYmxlZF09XFxcIiF0YWJsZS5oYXNQcmV2IHx8IHRhYmxlLmxvYWRpbmdcXFwiIHRpdGxlPVxcXCJQcmV2aW91cyBwYWdlXFxcIj5cXHUyMUZEPC9idXR0b24+XFxuPGJ1dHRvbiAqbmdJZj1cXFwiIXRhYmxlLmVtcHR5XFxcIiAoY2xpY2spPVxcXCJ0YWJsZS5uZXh0KClcXFwiIFtkaXNhYmxlZF09XFxcIiF0YWJsZS5oYXNOZXh0IHx8IHRhYmxlLmxvYWRpbmdcXFwiIHRpdGxlPVxcXCJOZXh0IHBhZ2VcXFwiPlxcdTIxRkU8L2J1dHRvbj5cXG4gIFwiLFxuICAgICAgICAgICAgICAgIHN0eWxlczogW1wiXFxuOmhvc3QoLm5nLXRhYmxlLXBhZ2luYXRvcikge1xcbiAgZm9udC1mYW1pbHk6IFJvYm90byxIZWx2ZXRpY2EgTmV1ZSxzYW5zLXNlcmlmO1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbiAgYmFja2dyb3VuZDogI2ZmZjtcXG4gIGNvbG9yOiByZ2JhKDAsMCwwLC41NCk7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XFxuICBtaW4taGVpZ2h0OiA1NnB4O1xcbiAgcGFkZGluZzogMCA4cHg7XFxufVxcblxcbjpob3N0KC5uZy10YWJsZS1wYWdpbmF0b3IpIC9kZWVwLyAubmctdGFibGUtcGFnaW5hdG9yLXBhZ2Utc2l6ZSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuOmhvc3QoLm5nLXRhYmxlLXBhZ2luYXRvcikgL2RlZXAvIC5uZy10YWJsZS1wYWdpbmF0b3ItcGFnZS1zaXplLWxhYmVsIHtcXG4gIG1hcmdpbjogMCA4cHggMCAwO1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUtcGFnaW5hdG9yKSAvZGVlcC8gLm5nLXRhYmxlLXBhZ2luYXRvci1wYWdlLXNpemUtc2VsZWN0IC5tYXQtc2VsZWN0LXRyaWdnZXIge1xcbiAgbWluLXdpZHRoOiA2MHB4O1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUtcGFnaW5hdG9yKSAvZGVlcC8gLm5nLXRhYmxlLXBhZ2luYXRvci1wYWdlLWxhYmVsIHtcXG4gIG1hcmdpbjogMCAzMnB4O1xcbn1cXG4gIFwiXSxcbiAgICAgICAgICAgICAgICBob3N0OiB7ICdjbGFzcyc6ICduZy10YWJsZS1wYWdpbmF0b3InIH1cbiAgICAgICAgICAgIH0sXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuTmdUYWJsZVBhZ2luYXRvci5jdG9yUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtdOyB9O1xuTmdUYWJsZVBhZ2luYXRvci5wcm9wRGVjb3JhdG9ycyA9IHtcbiAgICAndGFibGUnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4gICAgJ2xhYmVsJzogW3sgdHlwZTogSW5wdXQsIGFyZ3M6IFsnbGFiZWxzJyxdIH0sXSxcbiAgICAnbmdUYWJsZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbiAgICAncmFuZ2VWaXNpYmxlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhZ2luYXRvci5jb21wb25lbnQuanMubWFwIiwiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzL1J4JztcbmltcG9ydCB7IE5nVGFibGVTb3VyY2VVcGRhdGVFdmVudCB9IGZyb20gJy4vbmd0YWJsZS5ldmVudHMnO1xudmFyIE5nVGFibGVTb3VyY2UgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVTb3VyY2UoKSB7XG4gICAgICAgIHRoaXMuX3JhbmdlID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcmFuZ2VPcHRpb25zID0gWzUsIDEwLCAyMCwgNTBdO1xuICAgICAgICB0aGlzLl9wYXJhbXMgPSBudWxsO1xuICAgICAgICB0aGlzLl9sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3NvdXJjZVVwZGF0ZSA9IG5ldyBCZWhhdmlvclN1YmplY3QobnVsbCk7XG4gICAgICAgIHRoaXMuc291cmNlVXBkYXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLmJlZm9yZUNvbm5lY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMuYWZ0ZXJDb25uZWN0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVNvdXJjZS5wcm90b3R5cGUsIFwibG9hZGluZ1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvYWRpbmc7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE5nVGFibGVTb3VyY2UucHJvdG90eXBlLmdldERhdGEgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMuX2xvYWRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnNvdXJjZShwYXJhbXMpO1xuICAgIH07XG4gICAgTmdUYWJsZVNvdXJjZS5wcm90b3R5cGUucmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9sb2FkaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmdldERhdGEodGhpcy5wYXJhbXMpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBOZ1RhYmxlU291cmNlLnByb3RvdHlwZS51cGRhdGVEYXRhID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICB0aGlzLl9sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3NvdXJjZVVwZGF0ZS5uZXh0KHJlc3VsdCk7XG4gICAgICAgIHRoaXMuc291cmNlVXBkYXRlLmVtaXQobmV3IE5nVGFibGVTb3VyY2VVcGRhdGVFdmVudCh0aGlzLCByZXN1bHQpKTtcbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlU291cmNlLnByb3RvdHlwZSwgXCJjb25uZWN0aW9uXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc291cmNlVXBkYXRlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVNvdXJjZS5wcm90b3R5cGUsIFwicGFyYW1zXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFyYW1zO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHdhc1NldCA9IHRoaXMuX3BhcmFtcyAhPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fcGFyYW1zID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2xvYWRpbmcgJiYgd2FzU2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXREYXRhKHRoaXMucGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2UucHJvdG90eXBlLCBcInJhbmdlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmFuZ2UgfHwgMTA7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgd2FzU2V0ID0gdGhpcy5fcmFuZ2UgIT0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX3JhbmdlID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2xvYWRpbmcgJiYgd2FzU2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXREYXRhKHRoaXMucGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2UucHJvdG90eXBlLCBcInJhbmdlT3B0aW9uc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JhbmdlT3B0aW9ucztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5fcmFuZ2VPcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVTb3VyY2U7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZVNvdXJjZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bmd0YWJsZS5zb3VyY2UuanMubWFwIiwidmFyIE5nVGFibGVTb3VyY2VSZXN1bHQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVTb3VyY2VSZXN1bHQoX2RhdGEsIF90b3RhbFJvd3MsIF9hZGRpdGlvbmFsRGF0YSkge1xuICAgICAgICBpZiAoX3RvdGFsUm93cyA9PT0gdm9pZCAwKSB7IF90b3RhbFJvd3MgPSAwOyB9XG4gICAgICAgIHRoaXMuX2RhdGEgPSBfZGF0YTtcbiAgICAgICAgdGhpcy5fdG90YWxSb3dzID0gX3RvdGFsUm93cztcbiAgICAgICAgdGhpcy5fYWRkaXRpb25hbERhdGEgPSBfYWRkaXRpb25hbERhdGE7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlU291cmNlUmVzdWx0LnByb3RvdHlwZSwgXCJkYXRhXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2VSZXN1bHQucHJvdG90eXBlLCBcInRvdGFsUm93c1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvdGFsUm93cztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2VSZXN1bHQucHJvdG90eXBlLCBcImFkZGl0aW9uYWxEYXRhXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWRkaXRpb25hbERhdGE7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE5nVGFibGVTb3VyY2VSZXN1bHQuY3JlYXRlID0gZnVuY3Rpb24gKHJvd3MsIHRvdGFsUm93cywgYWRkaXRpb25hbERhdGEpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBOZ1RhYmxlU291cmNlUmVzdWx0KHJvd3MsIHRvdGFsUm93cywgYWRkaXRpb25hbERhdGEpO1xuICAgIH07XG4gICAgTmdUYWJsZVNvdXJjZVJlc3VsdC5zaW5nbGVQYWdlID0gZnVuY3Rpb24gKHNvdXJjZSwgcm93cywgYWRkaXRpb25hbERhdGEpIHtcbiAgICAgICAgdmFyIGxpc3QgPSBbXTtcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHNvdXJjZS5wYXJhbXM7XG4gICAgICAgIHJvd3MuZm9yRWFjaChmdW5jdGlvbiAocm93KSB7XG4gICAgICAgICAgICBpZiAoaW5kZXggPj0gcGFyYW1zLm9mZnNldCAmJiBpbmRleCA8IHBhcmFtcy5vZmZzZXQgKyBzb3VyY2UucmFuZ2UpIHtcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2gocm93KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbmV3IE5nVGFibGVTb3VyY2VSZXN1bHQobGlzdCwgcm93cy5sZW5ndGgsIGFkZGl0aW9uYWxEYXRhKTtcbiAgICB9O1xuICAgIHJldHVybiBOZ1RhYmxlU291cmNlUmVzdWx0O1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVTb3VyY2VSZXN1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5ndGFibGUucmVzdWx0LmpzLm1hcCIsImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0ICdoYW1tZXJqcyc7XG5pbXBvcnQgeyBOZ1RhYmxlQ2VsbCB9IGZyb20gJy4vY29tcG9uZW50cy9jZWxsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ1RhYmxlSGVhZGVyQ2VsbCB9IGZyb20gJy4vY29tcG9uZW50cy9oZWFkZXItY2VsbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmdUYWJsZUhlYWRlclJvdyB9IGZyb20gJy4vY29tcG9uZW50cy9oZWFkZXItcm93LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ1RhYmxlTW9yZSB9IGZyb20gJy4vY29tcG9uZW50cy9tb3JlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ1RhYmxlUGFnaW5hdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL3BhZ2luYXRvci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmdUYWJsZVJvdyB9IGZyb20gJy4vY29tcG9uZW50cy9yb3cuY29tcG9uZW50JztcbmltcG9ydCB7IE5nVGFibGUgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50JztcbmV4cG9ydCB7IE5nVGFibGVJbml0RXZlbnQsIE5nVGFibGVEZXN0cm95RXZlbnQsIE5nVGFibGVCZWZvcmVDb25uZWN0RXZlbnQsIE5nVGFibGVBZnRlckNvbm5lY3RFdmVudCwgTmdUYWJsZVJhbmdlRXZlbnQgfSBmcm9tICcuL25ndGFibGUuZXZlbnRzJztcbmV4cG9ydCB7IE5nVGFibGVTb3VyY2UgfSBmcm9tICcuL25ndGFibGUuc291cmNlJztcbmV4cG9ydCB7IE5nVGFibGVTb3VyY2VSZXN1bHQgfSBmcm9tICcuL25ndGFibGUucmVzdWx0JztcbmV4cG9ydCB7IE5nVGFibGUgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50JztcbmV4cG9ydCB7IE5nVGFibGVIZWFkZXJSb3cgfSBmcm9tICcuL2NvbXBvbmVudHMvaGVhZGVyLXJvdy5jb21wb25lbnQnO1xuZXhwb3J0IHsgTmdUYWJsZUhlYWRlckNlbGwgfSBmcm9tICcuL2NvbXBvbmVudHMvaGVhZGVyLWNlbGwuY29tcG9uZW50JztcbmV4cG9ydCB7IE5nVGFibGVSb3cgfSBmcm9tICcuL2NvbXBvbmVudHMvcm93LmNvbXBvbmVudCc7XG5leHBvcnQgeyBOZ1RhYmxlQ2VsbCB9IGZyb20gJy4vY29tcG9uZW50cy9jZWxsLmNvbXBvbmVudCc7XG5leHBvcnQgeyBOZ1RhYmxlUGFnaW5hdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL3BhZ2luYXRvci5jb21wb25lbnQnO1xudmFyIHJvdXRlcyA9IFtdO1xudmFyIE5nVGFibGVSb3V0aW5nTW9kdWxlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlUm91dGluZ01vZHVsZSgpIHtcbiAgICB9XG4gICAgcmV0dXJuIE5nVGFibGVSb3V0aW5nTW9kdWxlO1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVSb3V0aW5nTW9kdWxlIH07XG5OZ1RhYmxlUm91dGluZ01vZHVsZS5kZWNvcmF0b3JzID0gW1xuICAgIHsgdHlwZTogTmdNb2R1bGUsIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgaW1wb3J0czogW1JvdXRlck1vZHVsZS5mb3JSb290KHJvdXRlcyldLFxuICAgICAgICAgICAgICAgIGV4cG9ydHM6IFtSb3V0ZXJNb2R1bGVdXG4gICAgICAgICAgICB9LF0gfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbk5nVGFibGVSb3V0aW5nTW9kdWxlLmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW107IH07XG52YXIgTmdUYWJsZU1vZHVsZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZU1vZHVsZSgpIHtcbiAgICB9XG4gICAgcmV0dXJuIE5nVGFibGVNb2R1bGU7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZU1vZHVsZSB9O1xuTmdUYWJsZU1vZHVsZS5kZWNvcmF0b3JzID0gW1xuICAgIHsgdHlwZTogTmdNb2R1bGUsIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgaW1wb3J0czogW1xuICAgICAgICAgICAgICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVSb3V0aW5nTW9kdWxlLFxuICAgICAgICAgICAgICAgICAgICBGb3Jtc01vZHVsZVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGUsXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVIZWFkZXJSb3csXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVIZWFkZXJDZWxsLFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlUm93LFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlQ2VsbCxcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZVBhZ2luYXRvcixcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZU1vcmVcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHByb3ZpZGVyczogW10sXG4gICAgICAgICAgICAgICAgZXhwb3J0czogW1xuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlLFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlSGVhZGVyUm93LFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlSGVhZGVyQ2VsbCxcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZVJvdyxcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZUNlbGwsXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVQYWdpbmF0b3IsXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVNb3JlXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlTW9kdWxlLmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW107IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAuanMubWFwIl0sIm5hbWVzIjpbIkV2ZW50RW1pdHRlciIsIkNvbXBvbmVudCIsIkFjdGl2YXRlZFJvdXRlIiwiT3V0cHV0IiwiSW5wdXQiLCJCZWhhdmlvclN1YmplY3QiLCJOZ01vZHVsZSIsIlJvdXRlck1vZHVsZSIsIkNvbW1vbk1vZHVsZSIsIkZvcm1zTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFJLGdCQUFnQixJQUFJLFlBQVk7SUFDaEMsU0FBUyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUU7UUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7S0FDdkI7SUFDRCxNQUFNLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7UUFDdkQsR0FBRyxFQUFFLFlBQVk7WUFDYixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDdEI7UUFDRCxVQUFVLEVBQUUsSUFBSTtRQUNoQixZQUFZLEVBQUUsSUFBSTtLQUNyQixDQUFDLENBQUM7SUFDSCxPQUFPLGdCQUFnQixDQUFDO0NBQzNCLEVBQUUsQ0FBQyxDQUFDO0FBQ0wsQUFDQSxJQUFJLG1CQUFtQixJQUFJLFlBQVk7SUFDbkMsU0FBUyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUU7UUFDaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7S0FDdkI7SUFDRCxNQUFNLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7UUFDMUQsR0FBRyxFQUFFLFlBQVk7WUFDYixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDdEI7UUFDRCxVQUFVLEVBQUUsSUFBSTtRQUNoQixZQUFZLEVBQUUsSUFBSTtLQUNyQixDQUFDLENBQUM7SUFDSCxPQUFPLG1CQUFtQixDQUFDO0NBQzlCLEVBQUUsQ0FBQyxDQUFDO0FBQ0wsQUFDQSxJQUFJLHlCQUF5QixJQUFJLFlBQVk7SUFDekMsU0FBUyx5QkFBeUIsQ0FBQyxLQUFLLEVBQUUsTUFB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
