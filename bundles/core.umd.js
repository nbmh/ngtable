(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('@angular/forms'), require('hammerjs'), require('rxjs/Rx')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/common', '@angular/core', '@angular/forms', 'hammerjs', 'rxjs/Rx'], factory) :
	(factory((global.ngtable = {}),global._angular_common,global.ng.core,global._angular_forms,null,global.rxjs_Rx));
}(this, (function (exports,_angular_common,_angular_core,_angular_forms,hammerjs,rxjs_Rx) { 'use strict';

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
    function NgTable() {
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
        this.initEmitter.emit(new NgTableInitEvent(this));
        // TODO: Change to parse params from window.location. RouterModule screws with lazy loading
        /*this._querySubscriber = this.activeRoute.queryParams.debounceTime(10).subscribe(params => {
          this._initialized = true;
          this._page = params[this._queryPage] ? +params[this._queryPage] : 1;
    
          this.requestData();
        });*/
        this._initialized = true;
        this._page = 1;
        this.requestData();
        //=================
    };
    NgTable.prototype.ngOnDestroy = function () {
        if (this._dataSourceSubscriber) {
            this._dataSourceSubscriber.unsubscribe();
            this._dataSourceSubscriber = null;
        }
        /*if (this._querySubscriber) {
          this._querySubscriber.unsubscribe();
        }*/
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
                styles: ["\n:host(.ng-table) {\n  background: #fff;\n  overflow: auto;\n  display: table;\n  width: 100%;\n}\n\n:host(.ng-table) /deep/ .ng-table-header-row,\n:host(.ng-table) /deep/ .ng-table-row {\n  display: table-row;\n}\n\n:host(.ng-table) /deep/ .ng-table-header-cell,\n:host(.ng-table) /deep/ .ng-table-cell {\n  border-bottom-color: rgba(0, 0, 0, .12);\n  border-bottom-width: 1px;\n  border-bottom-style: solid;\n  padding: 12px;\n}\n\n:host(.ng-table.ng-table-condensed) /deep/ .ng-table-header-cell,\n:host(.ng-table.ng-table-condensed) /deep/ .ng-table-cell {\n  padding-top: 6px;\n  padding-bottom: 6px;\n}\n\n:host(.ng-table) /deep/ .ng-table-header-cell {\n  font-size: 12px;\n  font-weight: 500;\n  color: rgba(0, 0, 0, .54);\n  display: table-cell;\n  white-space: nowrap;\n  -moz-user-select: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n:host(.ng-table) /deep/ .ng-table-cell {\n  font-size: 14px;\n  color: rgba(0,0,0,.87);\n  display: table-cell;\n}\n\n:host(.ng-table) /deep/ .ng-table-icon {\n  width: 40px;\n  height: 40px;\n}\n\n:host(.ng-table-striped) /deep/ .ng-table-row:nth-of-type(odd) {\n  background-color: #f9f9f9;\n}\n\n:host(.ng-table-striped.ng-table-hover) /deep/ .ng-table-row:hover {\n  background-color: #f5f5f5;\n}\n  "],
                host: { 'class': 'ng-table' }
            },] },
];
/** @nocollapse */
NgTable.ctorParameters = function () { return []; };
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

var NgTableModule = (function () {
    function NgTableModule() {
    }
    return NgTableModule;
}());
NgTableModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    _angular_common.CommonModule,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS51bWQuanMiLCJzb3VyY2VzIjpbIi4uL2Rpc3Qvbmd0YWJsZS5ldmVudHMuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50LmpzIiwiLi4vZGlzdC9jb21wb25lbnRzL3Jvdy5jb21wb25lbnQuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvY2VsbC5jb21wb25lbnQuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvaGVhZGVyLXJvdy5jb21wb25lbnQuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvaGVhZGVyLWNlbGwuY29tcG9uZW50LmpzIiwiLi4vZGlzdC9jb21wb25lbnRzL21vcmUuY29tcG9uZW50LmpzIiwiLi4vZGlzdC9jb21wb25lbnRzL3BhZ2luYXRvci5jb21wb25lbnQuanMiLCIuLi9kaXN0L25ndGFibGUuc291cmNlLmpzIiwiLi4vZGlzdC9uZ3RhYmxlLnJlc3VsdC5qcyIsIi4uL2Rpc3QvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBOZ1RhYmxlSW5pdEV2ZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlSW5pdEV2ZW50KHRhYmxlKSB7XG4gICAgICAgIHRoaXMuX3RhYmxlID0gdGFibGU7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlSW5pdEV2ZW50LnByb3RvdHlwZSwgXCJ0YWJsZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gTmdUYWJsZUluaXRFdmVudDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlSW5pdEV2ZW50IH07XG52YXIgTmdUYWJsZURlc3Ryb3lFdmVudCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZURlc3Ryb3lFdmVudCh0YWJsZSkge1xuICAgICAgICB0aGlzLl90YWJsZSA9IHRhYmxlO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZURlc3Ryb3lFdmVudC5wcm90b3R5cGUsIFwidGFibGVcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90YWJsZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVEZXN0cm95RXZlbnQ7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZURlc3Ryb3lFdmVudCB9O1xudmFyIE5nVGFibGVCZWZvcmVDb25uZWN0RXZlbnQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVCZWZvcmVDb25uZWN0RXZlbnQodGFibGUsIHBhcmFtcykge1xuICAgICAgICB0aGlzLl90YWJsZSA9IHRhYmxlO1xuICAgICAgICB0aGlzLl9wYXJhbXMgPSBwYXJhbXM7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlQmVmb3JlQ29ubmVjdEV2ZW50LnByb3RvdHlwZSwgXCJ0YWJsZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZUJlZm9yZUNvbm5lY3RFdmVudC5wcm90b3R5cGUsIFwicGFyYW1zXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFyYW1zO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gTmdUYWJsZUJlZm9yZUNvbm5lY3RFdmVudDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlQmVmb3JlQ29ubmVjdEV2ZW50IH07XG52YXIgTmdUYWJsZUFmdGVyQ29ubmVjdEV2ZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQodGFibGUsIHJlc3VsdCkge1xuICAgICAgICB0aGlzLl90YWJsZSA9IHRhYmxlO1xuICAgICAgICB0aGlzLl9yZXN1bHQgPSByZXN1bHQ7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQucHJvdG90eXBlLCBcInRhYmxlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFibGU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQucHJvdG90eXBlLCBcInJlc3VsdFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VsdDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVBZnRlckNvbm5lY3RFdmVudDtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQgfTtcbnZhciBOZ1RhYmxlUmFuZ2VFdmVudCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZVJhbmdlRXZlbnQodGFibGUsIHJhbmdlLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX3RhYmxlID0gdGFibGU7XG4gICAgICAgIHRoaXMuX3JhbmdlID0gcmFuZ2U7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVJhbmdlRXZlbnQucHJvdG90eXBlLCBcInRhYmxlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFibGU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlUmFuZ2VFdmVudC5wcm90b3R5cGUsIFwicmFuZ2VcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yYW5nZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVSYW5nZUV2ZW50LnByb3RvdHlwZSwgXCJvcHRpb25zXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGVSYW5nZUV2ZW50O1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVSYW5nZUV2ZW50IH07XG52YXIgTmdUYWJsZVNvdXJjZVVwZGF0ZUV2ZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlU291cmNlVXBkYXRlRXZlbnQoc291cmNlLCByZXN1bHQpIHtcbiAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlO1xuICAgICAgICB0aGlzLl9yZXN1bHQgPSByZXN1bHQ7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlU291cmNlVXBkYXRlRXZlbnQucHJvdG90eXBlLCBcInNvdXJjZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2VVcGRhdGVFdmVudC5wcm90b3R5cGUsIFwicmVzdWx0XCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVzdWx0O1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gTmdUYWJsZVNvdXJjZVVwZGF0ZUV2ZW50O1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVTb3VyY2VVcGRhdGVFdmVudCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bmd0YWJsZS5ldmVudHMuanMubWFwIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nVGFibGVBZnRlckNvbm5lY3RFdmVudCwgTmdUYWJsZUJlZm9yZUNvbm5lY3RFdmVudCwgTmdUYWJsZURlc3Ryb3lFdmVudCwgTmdUYWJsZUluaXRFdmVudCwgTmdUYWJsZVJhbmdlRXZlbnQgfSBmcm9tICcuLi9uZ3RhYmxlLmV2ZW50cyc7XG52YXIgTmdUYWJsZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZSgpIHtcbiAgICAgICAgdGhpcy5fcm93cyA9IFtdO1xuICAgICAgICB0aGlzLl90b3RhbFJvd3MgPSAwO1xuICAgICAgICB0aGlzLl9wYWdlID0gMTtcbiAgICAgICAgdGhpcy5fdG90YWxQYWdlcyA9IDA7XG4gICAgICAgIHRoaXMuX2Zyb20gPSAwO1xuICAgICAgICB0aGlzLl90byA9IDA7XG4gICAgICAgIHRoaXMuX21vcmVSYW5nZSA9IDEwO1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9xdWVyeVBhZ2UgPSAncGFnZSc7XG4gICAgICAgIHRoaXMuaW5pdEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMuZGVzdHJveUVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMuYmVmb3JlQ29ubmVjdEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMuc291cmNlVXBkYXRlRW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5hZnRlckNvbm5lY3RFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLnJhbmdlQ2hhbmdlRW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICB9XG4gICAgTmdUYWJsZS5wcm90b3R5cGUubmdPbkluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgfTtcbiAgICBOZ1RhYmxlLnByb3RvdHlwZS5uZ0FmdGVyVmlld0luaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaW5pdEVtaXR0ZXIuZW1pdChuZXcgTmdUYWJsZUluaXRFdmVudCh0aGlzKSk7XG4gICAgICAgIC8vIFRPRE86IENoYW5nZSB0byBwYXJzZSBwYXJhbXMgZnJvbSB3aW5kb3cubG9jYXRpb24uIFJvdXRlck1vZHVsZSBzY3Jld3Mgd2l0aCBsYXp5IGxvYWRpbmdcbiAgICAgICAgLyp0aGlzLl9xdWVyeVN1YnNjcmliZXIgPSB0aGlzLmFjdGl2ZVJvdXRlLnF1ZXJ5UGFyYW1zLmRlYm91bmNlVGltZSgxMCkuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XG4gICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuX3BhZ2UgPSBwYXJhbXNbdGhpcy5fcXVlcnlQYWdlXSA/ICtwYXJhbXNbdGhpcy5fcXVlcnlQYWdlXSA6IDE7XG4gICAgXG4gICAgICAgICAgdGhpcy5yZXF1ZXN0RGF0YSgpO1xuICAgICAgICB9KTsqL1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX3BhZ2UgPSAxO1xuICAgICAgICB0aGlzLnJlcXVlc3REYXRhKCk7XG4gICAgICAgIC8vPT09PT09PT09PT09PT09PT1cbiAgICB9O1xuICAgIE5nVGFibGUucHJvdG90eXBlLm5nT25EZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fZGF0YVNvdXJjZVN1YnNjcmliZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2RhdGFTb3VyY2VTdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlU3Vic2NyaWJlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLyppZiAodGhpcy5fcXVlcnlTdWJzY3JpYmVyKSB7XG4gICAgICAgICAgdGhpcy5fcXVlcnlTdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0qL1xuICAgICAgICB0aGlzLmRlc3Ryb3lFbWl0dGVyLmVtaXQobmV3IE5nVGFibGVEZXN0cm95RXZlbnQodGhpcykpO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcImRhdGFTb3VyY2VcIiwge1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlID0gc291cmNlO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2RhdGFTb3VyY2VTdWJzY3JpYmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZVN1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2RhdGFTb3VyY2Uuc291cmNlVXBkYXRlLnN1YnNjcmliZShmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnNvdXJjZVVwZGF0ZUVtaXR0ZXIuZW1pdChlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZVN1YnNjcmliZXIgPSB0aGlzLl9kYXRhU291cmNlLmNvbm5lY3Rpb24uc3Vic2NyaWJlKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmNhbGN1bGF0ZShyZXN1bHQuZGF0YSwgcmVzdWx0LnRvdGFsUm93cyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBldmVudF8xID0gbmV3IE5nVGFibGVBZnRlckNvbm5lY3RFdmVudChfdGhpcywgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuYWZ0ZXJDb25uZWN0RW1pdHRlci5lbWl0KGV2ZW50XzEpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGF0YVNvdXJjZS5hZnRlckNvbm5lY3QuZW1pdChldmVudF8xKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTmdUYWJsZS5wcm90b3R5cGUuY2FsY3VsYXRlID0gZnVuY3Rpb24gKHJvd3MsIHRvdGFsUm93cykge1xuICAgICAgICB0aGlzLl9yb3dzID0gcm93cztcbiAgICAgICAgdGhpcy5fdG90YWxSb3dzID0gdG90YWxSb3dzO1xuICAgICAgICB0aGlzLl90b3RhbFBhZ2VzID0gTWF0aC5jZWlsKHRoaXMuX3RvdGFsUm93cyAvIHRoaXMuX2RhdGFTb3VyY2UucmFuZ2UpO1xuICAgICAgICBpZiAodGhpcy5fcGFnZSA+IHRoaXMuX3RvdGFsUGFnZXMpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhZ2UgPSAxO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2Zyb20gPSAoKHRoaXMuX3BhZ2UgLSAxKSAqIHRoaXMuX2RhdGFTb3VyY2UucmFuZ2UpICsgMTtcbiAgICAgICAgdGhpcy5fdG8gPSB0aGlzLl9mcm9tICsgdGhpcy5fZGF0YVNvdXJjZS5yYW5nZSAtIDE7XG4gICAgICAgIGlmICh0aGlzLl90byA+IHRoaXMuX3RvdGFsUm93cykge1xuICAgICAgICAgICAgdGhpcy5fdG8gPSB0aGlzLl90b3RhbFJvd3M7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE5nVGFibGUucHJvdG90eXBlLnJlcXVlc3REYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2RhdGFTb3VyY2UubG9hZGluZykge1xuICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZS5wYXJhbXMub2Zmc2V0ID0gKHRoaXMuX3BhZ2UgLSAxKSAqIHRoaXMuX2RhdGFTb3VyY2UucmFuZ2U7XG4gICAgICAgICAgICB2YXIgZXZlbnRfMiA9IG5ldyBOZ1RhYmxlQmVmb3JlQ29ubmVjdEV2ZW50KHRoaXMsIHRoaXMuX2RhdGFTb3VyY2UucGFyYW1zKTtcbiAgICAgICAgICAgIHRoaXMuYmVmb3JlQ29ubmVjdEVtaXR0ZXIuZW1pdChldmVudF8yKTtcbiAgICAgICAgICAgIHRoaXMuX2RhdGFTb3VyY2UuYmVmb3JlQ29ubmVjdC5lbWl0KGV2ZW50XzIpO1xuICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZS5nZXREYXRhKHRoaXMuX2RhdGFTb3VyY2UucGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTmdUYWJsZS5wcm90b3R5cGUucmVtb3ZlUm93ID0gZnVuY3Rpb24gKHJvdykge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9yb3dzLmluZGV4T2Yocm93KTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX3Jvd3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhbGN1bGF0ZSh0aGlzLl9yb3dzLCB0aGlzLnRvdGFsUm93cyAtIDEpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE5nVGFibGUucHJvdG90eXBlLnVwZGF0ZVJvdyA9IGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5fcm93cy5pbmRleE9mKHJvdyk7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9yb3dzLnNwbGljZShpbmRleCwgMSwgcm93KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE5nVGFibGUucHJvdG90eXBlLmFkZFJvdyA9IGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgdGhpcy5fcm93cy5wdXNoKHJvdyk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlKHRoaXMuX3Jvd3MsIHRoaXMudG90YWxSb3dzICsgMSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcInJvd3NcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb3dzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwicXVlcnlQYWdlXCIsIHtcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgdGhpcy5fcXVlcnlQYWdlID0gbmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcInBhZ2VcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYWdlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9kYXRhU291cmNlLmxvYWRpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wYWdlID0gK2luZGV4O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9wYWdlIDwgMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYWdlID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3BhZ2UgPiB0aGlzLl90b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhZ2UgPSB0aGlzLl90b3RhbFBhZ2VzO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fcGFnZSA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhZ2UgPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdERhdGEoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcInRvdGFsUGFnZXNcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3RhbFBhZ2VzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwidG90YWxSb3dzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG90YWxSb3dzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiZnJvbVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Zyb207XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJ0b1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwicmFuZ2VcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhU291cmNlLnJhbmdlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9kYXRhU291cmNlLmxvYWRpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhU291cmNlLnJhbmdlID0gK3ZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VDaGFuZ2VFbWl0dGVyLmVtaXQobmV3IE5nVGFibGVSYW5nZUV2ZW50KHRoaXMsIHRoaXMucmFuZ2UsIHRoaXMucmFuZ2VPcHRpb25zKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJtb3JlUmFuZ2VcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb3JlUmFuZ2U7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9tb3JlUmFuZ2UgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcInJhbmdlT3B0aW9uc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFTb3VyY2UucmFuZ2VPcHRpb25zO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fZGF0YVNvdXJjZS5yYW5nZU9wdGlvbnMgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcImluaXRpYWxpemVkXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW5pdGlhbGl6ZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlLnByb3RvdHlwZSwgXCJsb2FkaW5nXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVNvdXJjZS5sb2FkaW5nO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiZW1wdHlcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3RhbFJvd3MgPT0gMDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTmdUYWJsZS5wcm90b3R5cGUucmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5wYWdlID0gdGhpcy5fcGFnZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOZ1RhYmxlLnByb3RvdHlwZS5tb3JlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2RhdGFTb3VyY2UubG9hZGluZykge1xuICAgICAgICAgICAgdGhpcy5fcGFnZSA9IDE7XG4gICAgICAgICAgICB0aGlzLnJhbmdlID0gdGhpcy5yYW5nZSArIHRoaXMuX21vcmVSYW5nZTtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdERhdGEoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE5nVGFibGUucHJvdG90eXBlLnByZXYgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3BhZ2UtLTtcbiAgICAgICAgaWYgKHRoaXMuX3BhZ2UgPCAxKSB7XG4gICAgICAgICAgICB0aGlzLl9wYWdlID0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhZ2UgPSB0aGlzLl9wYWdlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE5nVGFibGUucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3BhZ2UrKztcbiAgICAgICAgdmFyIHBhZ2VzTWF4ID0gdGhpcy50b3RhbFBhZ2VzO1xuICAgICAgICBpZiAodGhpcy5fcGFnZSA+IHBhZ2VzTWF4KSB7XG4gICAgICAgICAgICB0aGlzLl9wYWdlID0gcGFnZXNNYXg7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYWdlID0gdGhpcy5fcGFnZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiaGFzUHJldlwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2UgPiAxO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiaGFzTmV4dFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2UgPCB0aGlzLl90b3RhbFBhZ2VzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZS5wcm90b3R5cGUsIFwiaXNGaXJzdFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2UgPT0gMTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGUucHJvdG90eXBlLCBcImlzTGFzdFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2UgPT0gdGhpcy5fdG90YWxQYWdlcztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE5nVGFibGU7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZSB9O1xuTmdUYWJsZS5kZWNvcmF0b3JzID0gW1xuICAgIHsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnbmctdGFibGUnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBcIlxcbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxcbiAgXCIsXG4gICAgICAgICAgICAgICAgc3R5bGVzOiBbXCJcXG46aG9zdCgubmctdGFibGUpIHtcXG4gIGJhY2tncm91bmQ6ICNmZmY7XFxuICBvdmVyZmxvdzogYXV0bztcXG4gIGRpc3BsYXk6IHRhYmxlO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbjpob3N0KC5uZy10YWJsZSkgL2RlZXAvIC5uZy10YWJsZS1oZWFkZXItcm93LFxcbjpob3N0KC5uZy10YWJsZSkgL2RlZXAvIC5uZy10YWJsZS1yb3cge1xcbiAgZGlzcGxheTogdGFibGUtcm93O1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUpIC9kZWVwLyAubmctdGFibGUtaGVhZGVyLWNlbGwsXFxuOmhvc3QoLm5nLXRhYmxlKSAvZGVlcC8gLm5nLXRhYmxlLWNlbGwge1xcbiAgYm9yZGVyLWJvdHRvbS1jb2xvcjogcmdiYSgwLCAwLCAwLCAuMTIpO1xcbiAgYm9yZGVyLWJvdHRvbS13aWR0aDogMXB4O1xcbiAgYm9yZGVyLWJvdHRvbS1zdHlsZTogc29saWQ7XFxuICBwYWRkaW5nOiAxMnB4O1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUubmctdGFibGUtY29uZGVuc2VkKSAvZGVlcC8gLm5nLXRhYmxlLWhlYWRlci1jZWxsLFxcbjpob3N0KC5uZy10YWJsZS5uZy10YWJsZS1jb25kZW5zZWQpIC9kZWVwLyAubmctdGFibGUtY2VsbCB7XFxuICBwYWRkaW5nLXRvcDogNnB4O1xcbiAgcGFkZGluZy1ib3R0b206IDZweDtcXG59XFxuXFxuOmhvc3QoLm5nLXRhYmxlKSAvZGVlcC8gLm5nLXRhYmxlLWhlYWRlci1jZWxsIHtcXG4gIGZvbnQtc2l6ZTogMTJweDtcXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XFxuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuNTQpO1xcbiAgZGlzcGxheTogdGFibGUtY2VsbDtcXG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XFxuICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXG4gIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcXG4gIHVzZXItc2VsZWN0OiBub25lO1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUpIC9kZWVwLyAubmctdGFibGUtY2VsbCB7XFxuICBmb250LXNpemU6IDE0cHg7XFxuICBjb2xvcjogcmdiYSgwLDAsMCwuODcpO1xcbiAgZGlzcGxheTogdGFibGUtY2VsbDtcXG59XFxuXFxuOmhvc3QoLm5nLXRhYmxlKSAvZGVlcC8gLm5nLXRhYmxlLWljb24ge1xcbiAgd2lkdGg6IDQwcHg7XFxuICBoZWlnaHQ6IDQwcHg7XFxufVxcblxcbjpob3N0KC5uZy10YWJsZS1zdHJpcGVkKSAvZGVlcC8gLm5nLXRhYmxlLXJvdzpudGgtb2YtdHlwZShvZGQpIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmOWY5Zjk7XFxufVxcblxcbjpob3N0KC5uZy10YWJsZS1zdHJpcGVkLm5nLXRhYmxlLWhvdmVyKSAvZGVlcC8gLm5nLXRhYmxlLXJvdzpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjVmNWY1O1xcbn1cXG4gIFwiXSxcbiAgICAgICAgICAgICAgICBob3N0OiB7ICdjbGFzcyc6ICduZy10YWJsZScgfVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlLmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW107IH07XG5OZ1RhYmxlLnByb3BEZWNvcmF0b3JzID0ge1xuICAgICdpbml0RW1pdHRlcic6IFt7IHR5cGU6IE91dHB1dCwgYXJnczogWydpbml0JyxdIH0sXSxcbiAgICAnZGVzdHJveUVtaXR0ZXInOiBbeyB0eXBlOiBPdXRwdXQsIGFyZ3M6IFsnZGVzdHJveScsXSB9LF0sXG4gICAgJ2JlZm9yZUNvbm5lY3RFbWl0dGVyJzogW3sgdHlwZTogT3V0cHV0LCBhcmdzOiBbJ2JlZm9yZUNvbm5lY3QnLF0gfSxdLFxuICAgICdzb3VyY2VVcGRhdGVFbWl0dGVyJzogW3sgdHlwZTogT3V0cHV0LCBhcmdzOiBbJ3NvdXJjZVVwZGF0ZScsXSB9LF0sXG4gICAgJ2FmdGVyQ29ubmVjdEVtaXR0ZXInOiBbeyB0eXBlOiBPdXRwdXQsIGFyZ3M6IFsnYWZ0ZXJDb25uZWN0JyxdIH0sXSxcbiAgICAncmFuZ2VDaGFuZ2VFbWl0dGVyJzogW3sgdHlwZTogT3V0cHV0LCBhcmdzOiBbJ3JhbmdlQ2hhbmdlJyxdIH0sXSxcbiAgICAnZGF0YVNvdXJjZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbiAgICAncXVlcnlQYWdlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuICAgICdwYWdlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuICAgICdyYW5nZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbiAgICAnbW9yZVJhbmdlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuICAgICdyYW5nZU9wdGlvbnMnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFibGUuY29tcG9uZW50LmpzLm1hcCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdUYWJsZSB9IGZyb20gJy4vdGFibGUuY29tcG9uZW50JztcbnZhciBOZ1RhYmxlUm93ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlUm93KHBhcmVudCkge1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB9XG4gICAgcmV0dXJuIE5nVGFibGVSb3c7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZVJvdyB9O1xuTmdUYWJsZVJvdy5kZWNvcmF0b3JzID0gW1xuICAgIHsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnbmctdGFibGUtcm93JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogXCJcXG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cXG4gIFwiLFxuICAgICAgICAgICAgICAgIGhvc3Q6IHsgJ2NsYXNzJzogJ25nLXRhYmxlLXJvdycgfVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlUm93LmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW1xuICAgIHsgdHlwZTogTmdUYWJsZSwgfSxcbl07IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yb3cuY29tcG9uZW50LmpzLm1hcCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdUYWJsZVJvdyB9IGZyb20gJy4vcm93LmNvbXBvbmVudCc7XG52YXIgTmdUYWJsZUNlbGwgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5nVGFibGVDZWxsKHBhcmVudCkge1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB9XG4gICAgcmV0dXJuIE5nVGFibGVDZWxsO1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVDZWxsIH07XG5OZ1RhYmxlQ2VsbC5kZWNvcmF0b3JzID0gW1xuICAgIHsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnbmctdGFibGUtY2VsbCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiXFxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XFxuICBcIixcbiAgICAgICAgICAgICAgICBob3N0OiB7ICdjbGFzcyc6ICduZy10YWJsZS1jZWxsJyB9XG4gICAgICAgICAgICB9LF0gfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbk5nVGFibGVDZWxsLmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW1xuICAgIHsgdHlwZTogTmdUYWJsZVJvdywgfSxcbl07IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jZWxsLmNvbXBvbmVudC5qcy5tYXAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nVGFibGUgfSBmcm9tICcuL3RhYmxlLmNvbXBvbmVudCc7XG52YXIgTmdUYWJsZUhlYWRlclJvdyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZUhlYWRlclJvdyhwYXJlbnQpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBOZ1RhYmxlSGVhZGVyUm93O1xufSgpKTtcbmV4cG9ydCB7IE5nVGFibGVIZWFkZXJSb3cgfTtcbk5nVGFibGVIZWFkZXJSb3cuZGVjb3JhdG9ycyA9IFtcbiAgICB7IHR5cGU6IENvbXBvbmVudCwgYXJnczogW3tcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ25nLXRhYmxlLWhlYWRlci1yb3cnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBcIlxcbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxcbiAgXCIsXG4gICAgICAgICAgICAgICAgaG9zdDogeyAnY2xhc3MnOiAnbmctdGFibGUtaGVhZGVyLXJvdycgfVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlSGVhZGVyUm93LmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW1xuICAgIHsgdHlwZTogTmdUYWJsZSwgfSxcbl07IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oZWFkZXItcm93LmNvbXBvbmVudC5qcy5tYXAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nVGFibGVIZWFkZXJSb3cgfSBmcm9tICcuL2hlYWRlci1yb3cuY29tcG9uZW50JztcbnZhciBOZ1RhYmxlSGVhZGVyQ2VsbCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZUhlYWRlckNlbGwocGFyZW50KSB7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIH1cbiAgICByZXR1cm4gTmdUYWJsZUhlYWRlckNlbGw7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZUhlYWRlckNlbGwgfTtcbk5nVGFibGVIZWFkZXJDZWxsLmRlY29yYXRvcnMgPSBbXG4gICAgeyB0eXBlOiBDb21wb25lbnQsIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICduZy10YWJsZS1oZWFkZXItY2VsbCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiXFxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XFxuICBcIixcbiAgICAgICAgICAgICAgICBob3N0OiB7ICdjbGFzcyc6ICduZy10YWJsZS1oZWFkZXItY2VsbCcgfVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlSGVhZGVyQ2VsbC5jdG9yUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtcbiAgICB7IHR5cGU6IE5nVGFibGVIZWFkZXJSb3csIH0sXG5dOyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGVhZGVyLWNlbGwuY29tcG9uZW50LmpzLm1hcCIsImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbnZhciBOZ1RhYmxlTW9yZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZU1vcmUoKSB7XG4gICAgICAgIHRoaXMuX3JhbmdlVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuX2xhYmVsID0ge1xuICAgICAgICAgICAgaXRlbXNfcGVyX3BhZ2U6ICdJdGVtcyBwZXIgcGFnZScsXG4gICAgICAgICAgICBwYWdlOiAnUGFnZScsXG4gICAgICAgICAgICBvZl9wYWdlOiAnb2YnLFxuICAgICAgICAgICAgaXRlbXM6ICdJdGVtcycsXG4gICAgICAgICAgICBvZl9pdGVtczogJ29mJyxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVNb3JlLnByb3RvdHlwZSwgXCJsYWJlbFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xhYmVsO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fbGFiZWwgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9sYWJlbCwgdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZU1vcmUucHJvdG90eXBlLCBcIm5nVGFibGVcIiwge1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy50YWJsZSA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZU1vcmUucHJvdG90eXBlLCBcInJhbmdlVmlzaWJsZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JhbmdlVmlzaWJsZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoc3RhdHVzKSB7XG4gICAgICAgICAgICB0aGlzLl9yYW5nZVZpc2libGUgPSBzdGF0dXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE5nVGFibGVNb3JlLnByb3RvdHlwZS5hY3Rpb25SYW5nZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh0aGlzLnRhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLnRhYmxlLnJhbmdlID0gK2UudmFsdWU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBOZ1RhYmxlTW9yZTtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlTW9yZSB9O1xuTmdUYWJsZU1vcmUuZGVjb3JhdG9ycyA9IFtcbiAgICB7IHR5cGU6IENvbXBvbmVudCwgYXJnczogW3tcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ25nLXRhYmxlLW1vcmUnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBcIlxcbiAgICA8YnV0dG9uIGNsYXNzPVxcXCJuZy10YWJsZS1tb3JlLWJ1dHRvblxcXCIgKm5nSWY9XFxcInRhYmxlLnJvd3MubGVuZ3RoPHRhYmxlLnRvdGFsUm93c1xcXCIgKGNsaWNrKT1cXFwidGFibGUubW9yZSgpXFxcIiB0aXRsZT1cXFwiTG9hZCBtb3JlXFxcIj5Nb3JlPC9idXR0b24+XFxuICBcIixcbiAgICAgICAgICAgICAgICBzdHlsZXM6IFtcIlxcbjpob3N0KC5uZy10YWJsZS1tb3JlKSB7XFxuICBmb250LWZhbWlseTogUm9ib3RvLEhlbHZldGljYSBOZXVlLHNhbnMtc2VyaWY7XFxuICBmb250LXNpemU6IDEycHg7XFxuICBiYWNrZ3JvdW5kOiAjZmZmO1xcbiAgY29sb3I6IHJnYmEoMCwwLDAsLjU0KTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBtaW4taGVpZ2h0OiA1NnB4O1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUtbW9yZSkgL2RlZXAvIC5uZy10YWJsZS1tb3JlLWJ1dHRvbiB7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuICBcIl0sXG4gICAgICAgICAgICAgICAgaG9zdDogeyAnY2xhc3MnOiAnbmctdGFibGUtbW9yZScgfVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlTW9yZS5jdG9yUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtdOyB9O1xuTmdUYWJsZU1vcmUucHJvcERlY29yYXRvcnMgPSB7XG4gICAgJ3RhYmxlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuICAgICdsYWJlbCc6IFt7IHR5cGU6IElucHV0LCBhcmdzOiBbJ2xhYmVscycsXSB9LF0sXG4gICAgJ25nVGFibGUnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4gICAgJ3JhbmdlVmlzaWJsZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tb3JlLmNvbXBvbmVudC5qcy5tYXAiLCJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG52YXIgTmdUYWJsZVBhZ2luYXRvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZVBhZ2luYXRvcigpIHtcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbGFiZWwgPSB7XG4gICAgICAgICAgICBpdGVtc19wZXJfcGFnZTogJ0l0ZW1zIHBlciBwYWdlJyxcbiAgICAgICAgICAgIHBhZ2U6ICdQYWdlJyxcbiAgICAgICAgICAgIG9mX3BhZ2U6ICdvZicsXG4gICAgICAgICAgICBpdGVtczogJ0l0ZW1zJyxcbiAgICAgICAgICAgIG9mX2l0ZW1zOiAnb2YnLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVBhZ2luYXRvci5wcm90b3R5cGUsIFwibGFiZWxcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sYWJlbDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xhYmVsID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fbGFiZWwsIHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVQYWdpbmF0b3IucHJvdG90eXBlLCBcIm5nVGFibGVcIiwge1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy50YWJsZSA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVBhZ2luYXRvci5wcm90b3R5cGUsIFwicmFuZ2VWaXNpYmxlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmFuZ2VWaXNpYmxlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChzdGF0dXMpIHtcbiAgICAgICAgICAgIHRoaXMuX3JhbmdlVmlzaWJsZSA9IHN0YXR1cztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTmdUYWJsZVBhZ2luYXRvci5wcm90b3R5cGUuYWN0aW9uUmFuZ2UgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAodGhpcy50YWJsZSkge1xuICAgICAgICAgICAgdGhpcy50YWJsZS5yYW5nZSA9ICtlLnZhbHVlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gTmdUYWJsZVBhZ2luYXRvcjtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlUGFnaW5hdG9yIH07XG5OZ1RhYmxlUGFnaW5hdG9yLmRlY29yYXRvcnMgPSBbXG4gICAgeyB0eXBlOiBDb21wb25lbnQsIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICduZy10YWJsZS1wYWdpbmF0b3InLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBcIlxcbjE8ZGl2IGNsYXNzPVxcXCJuZy10YWJsZS1wYWdpbmF0b3ItcGFnZS1zaXplXFxcIiAqbmdJZj1cXFwicmFuZ2VWaXNpYmxlICYmICF0YWJsZS5lbXB0eVxcXCI+XFxuICA8ZGl2IGNsYXNzPVxcXCJuZy10YWJsZS1wYWdpbmF0b3ItcGFnZS1zaXplLWxhYmVsXFxcIj5cXG4gICAge3tsYWJlbC5pdGVtc19wZXJfcGFnZX19XFxuICA8L2Rpdj5cXG4gIDxzZWxlY3QgY2xhc3M9XFxcIm5nLXRhYmxlLXBhZ2luYXRvci1wYWdlLXNpemUtc2VsZWN0XFxcIiBbKG5nTW9kZWwpXT1cXFwidGFibGUucmFuZ2VcXFwiIChjaGFuZ2UpPVxcXCJhY3Rpb25SYW5nZSgkZXZlbnQpXFxcIiBbZGlzYWJsZWRdPVxcXCJ0YWJsZS5sb2FkaW5nXFxcIj5cXG4gICAgPG9wdGlvbiAqbmdGb3I9XFxcImxldCBjb3VudCBvZiB0YWJsZS5yYW5nZU9wdGlvbnNcXFwiIHZhbHVlPVxcXCJ7e2NvdW50fX1cXFwiPnt7Y291bnR9fTwvb3B0aW9uPlxcbiAgPC9zZWxlY3Q+XFxuPC9kaXY+XFxuPGRpdiBjbGFzcz1cXFwibmctdGFibGUtcGFnaW5hdG9yLXBhZ2UtbGFiZWxcXFwiICpuZ0lmPVxcXCIhdGFibGUuZW1wdHlcXFwiPlxcbiAge3tsYWJlbC5wYWdlfX0ge3t0YWJsZS5wYWdlfX0ge3tsYWJlbC5vZl9wYWdlfX0ge3t0YWJsZS50b3RhbFBhZ2VzfX0gfFxcbiAge3tsYWJlbC5pdGVtc319IDxzcGFuICpuZ0lmPVxcXCJ0YWJsZS5yb3dzLmxlbmd0aCA+IDFcXFwiPnt7dGFibGUuZnJvbX19IC0ge3t0YWJsZS50b319PC9zcGFuPlxcbiAgPHNwYW4gKm5nSWY9XFxcInRhYmxlLnJvd3MubGVuZ3RoID09IDFcXFwiPnt7dGFibGUuZnJvbX19PC9zcGFuPlxcbiAge3tsYWJlbC5vZl9pdGVtc319IHt7dGFibGUudG90YWxSb3dzfX1cXG48L2Rpdj5cXG48YnV0dG9uICpuZ0lmPVxcXCIhdGFibGUuZW1wdHlcXFwiIChjbGljayk9XFxcInRhYmxlLnByZXYoKVxcXCIgW2Rpc2FibGVkXT1cXFwiIXRhYmxlLmhhc1ByZXYgfHwgdGFibGUubG9hZGluZ1xcXCIgdGl0bGU9XFxcIlByZXZpb3VzIHBhZ2VcXFwiPlxcdTIxRkQ8L2J1dHRvbj5cXG48YnV0dG9uICpuZ0lmPVxcXCIhdGFibGUuZW1wdHlcXFwiIChjbGljayk9XFxcInRhYmxlLm5leHQoKVxcXCIgW2Rpc2FibGVkXT1cXFwiIXRhYmxlLmhhc05leHQgfHwgdGFibGUubG9hZGluZ1xcXCIgdGl0bGU9XFxcIk5leHQgcGFnZVxcXCI+XFx1MjFGRTwvYnV0dG9uPlxcbiAgXCIsXG4gICAgICAgICAgICAgICAgc3R5bGVzOiBbXCJcXG46aG9zdCgubmctdGFibGUtcGFnaW5hdG9yKSB7XFxuICBmb250LWZhbWlseTogUm9ib3RvLEhlbHZldGljYSBOZXVlLHNhbnMtc2VyaWY7XFxuICBmb250LXNpemU6IDEycHg7XFxuICBiYWNrZ3JvdW5kOiAjZmZmO1xcbiAgY29sb3I6IHJnYmEoMCwwLDAsLjU0KTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcXG4gIG1pbi1oZWlnaHQ6IDU2cHg7XFxuICBwYWRkaW5nOiAwIDhweDtcXG59XFxuXFxuOmhvc3QoLm5nLXRhYmxlLXBhZ2luYXRvcikgL2RlZXAvIC5uZy10YWJsZS1wYWdpbmF0b3ItcGFnZS1zaXplIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG46aG9zdCgubmctdGFibGUtcGFnaW5hdG9yKSAvZGVlcC8gLm5nLXRhYmxlLXBhZ2luYXRvci1wYWdlLXNpemUtbGFiZWwge1xcbiAgbWFyZ2luOiAwIDhweCAwIDA7XFxufVxcblxcbjpob3N0KC5uZy10YWJsZS1wYWdpbmF0b3IpIC9kZWVwLyAubmctdGFibGUtcGFnaW5hdG9yLXBhZ2Utc2l6ZS1zZWxlY3QgLm1hdC1zZWxlY3QtdHJpZ2dlciB7XFxuICBtaW4td2lkdGg6IDYwcHg7XFxuICBmb250LXNpemU6IDEycHg7XFxufVxcblxcbjpob3N0KC5uZy10YWJsZS1wYWdpbmF0b3IpIC9kZWVwLyAubmctdGFibGUtcGFnaW5hdG9yLXBhZ2UtbGFiZWwge1xcbiAgbWFyZ2luOiAwIDMycHg7XFxufVxcbiAgXCJdLFxuICAgICAgICAgICAgICAgIGhvc3Q6IHsgJ2NsYXNzJzogJ25nLXRhYmxlLXBhZ2luYXRvcicgfVxuICAgICAgICAgICAgfSxdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5OZ1RhYmxlUGFnaW5hdG9yLmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW107IH07XG5OZ1RhYmxlUGFnaW5hdG9yLnByb3BEZWNvcmF0b3JzID0ge1xuICAgICd0YWJsZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbiAgICAnbGFiZWwnOiBbeyB0eXBlOiBJbnB1dCwgYXJnczogWydsYWJlbHMnLF0gfSxdLFxuICAgICduZ1RhYmxlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuICAgICdyYW5nZVZpc2libGUnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFnaW5hdG9yLmNvbXBvbmVudC5qcy5tYXAiLCJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMvUngnO1xuaW1wb3J0IHsgTmdUYWJsZVNvdXJjZVVwZGF0ZUV2ZW50IH0gZnJvbSAnLi9uZ3RhYmxlLmV2ZW50cyc7XG52YXIgTmdUYWJsZVNvdXJjZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZVNvdXJjZSgpIHtcbiAgICAgICAgdGhpcy5fcmFuZ2UgPSBudWxsO1xuICAgICAgICB0aGlzLl9yYW5nZU9wdGlvbnMgPSBbNSwgMTAsIDIwLCA1MF07XG4gICAgICAgIHRoaXMuX3BhcmFtcyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc291cmNlVXBkYXRlID0gbmV3IEJlaGF2aW9yU3ViamVjdChudWxsKTtcbiAgICAgICAgdGhpcy5zb3VyY2VVcGRhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMuYmVmb3JlQ29ubmVjdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5hZnRlckNvbm5lY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlU291cmNlLnByb3RvdHlwZSwgXCJsb2FkaW5nXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9hZGluZztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTmdUYWJsZVNvdXJjZS5wcm90b3R5cGUuZ2V0RGF0YSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5fbG9hZGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuc291cmNlKHBhcmFtcyk7XG4gICAgfTtcbiAgICBOZ1RhYmxlU291cmNlLnByb3RvdHlwZS5yZWZyZXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2xvYWRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0RGF0YSh0aGlzLnBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE5nVGFibGVTb3VyY2UucHJvdG90eXBlLnVwZGF0ZURhdGEgPSBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIHRoaXMuX2xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc291cmNlVXBkYXRlLm5leHQocmVzdWx0KTtcbiAgICAgICAgdGhpcy5zb3VyY2VVcGRhdGUuZW1pdChuZXcgTmdUYWJsZVNvdXJjZVVwZGF0ZUV2ZW50KHRoaXMsIHJlc3VsdCkpO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2UucHJvdG90eXBlLCBcImNvbm5lY3Rpb25cIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2VVcGRhdGU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZ1RhYmxlU291cmNlLnByb3RvdHlwZSwgXCJwYXJhbXNcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXJhbXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgd2FzU2V0ID0gdGhpcy5fcGFyYW1zICE9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl9wYXJhbXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGlmICghdGhpcy5fbG9hZGluZyAmJiB3YXNTZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldERhdGEodGhpcy5wYXJhbXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVNvdXJjZS5wcm90b3R5cGUsIFwicmFuZ2VcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yYW5nZSB8fCAxMDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB3YXNTZXQgPSB0aGlzLl9yYW5nZSAhPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fcmFuZ2UgPSB2YWx1ZTtcbiAgICAgICAgICAgIGlmICghdGhpcy5fbG9hZGluZyAmJiB3YXNTZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldERhdGEodGhpcy5wYXJhbXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVNvdXJjZS5wcm90b3R5cGUsIFwicmFuZ2VPcHRpb25zXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmFuZ2VPcHRpb25zO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLl9yYW5nZU9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gTmdUYWJsZVNvdXJjZTtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlU291cmNlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1uZ3RhYmxlLnNvdXJjZS5qcy5tYXAiLCJ2YXIgTmdUYWJsZVNvdXJjZVJlc3VsdCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmdUYWJsZVNvdXJjZVJlc3VsdChfZGF0YSwgX3RvdGFsUm93cywgX2FkZGl0aW9uYWxEYXRhKSB7XG4gICAgICAgIGlmIChfdG90YWxSb3dzID09PSB2b2lkIDApIHsgX3RvdGFsUm93cyA9IDA7IH1cbiAgICAgICAgdGhpcy5fZGF0YSA9IF9kYXRhO1xuICAgICAgICB0aGlzLl90b3RhbFJvd3MgPSBfdG90YWxSb3dzO1xuICAgICAgICB0aGlzLl9hZGRpdGlvbmFsRGF0YSA9IF9hZGRpdGlvbmFsRGF0YTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5nVGFibGVTb3VyY2VSZXN1bHQucHJvdG90eXBlLCBcImRhdGFcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVNvdXJjZVJlc3VsdC5wcm90b3R5cGUsIFwidG90YWxSb3dzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG90YWxSb3dzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmdUYWJsZVNvdXJjZVJlc3VsdC5wcm90b3R5cGUsIFwiYWRkaXRpb25hbERhdGFcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRpdGlvbmFsRGF0YTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTmdUYWJsZVNvdXJjZVJlc3VsdC5jcmVhdGUgPSBmdW5jdGlvbiAocm93cywgdG90YWxSb3dzLCBhZGRpdGlvbmFsRGF0YSkge1xuICAgICAgICByZXR1cm4gbmV3IE5nVGFibGVTb3VyY2VSZXN1bHQocm93cywgdG90YWxSb3dzLCBhZGRpdGlvbmFsRGF0YSk7XG4gICAgfTtcbiAgICBOZ1RhYmxlU291cmNlUmVzdWx0LnNpbmdsZVBhZ2UgPSBmdW5jdGlvbiAoc291cmNlLCByb3dzLCBhZGRpdGlvbmFsRGF0YSkge1xuICAgICAgICB2YXIgbGlzdCA9IFtdO1xuICAgICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgICB2YXIgcGFyYW1zID0gc291cmNlLnBhcmFtcztcbiAgICAgICAgcm93cy5mb3JFYWNoKGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA+PSBwYXJhbXMub2Zmc2V0ICYmIGluZGV4IDwgcGFyYW1zLm9mZnNldCArIHNvdXJjZS5yYW5nZSkge1xuICAgICAgICAgICAgICAgIGxpc3QucHVzaChyb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBuZXcgTmdUYWJsZVNvdXJjZVJlc3VsdChsaXN0LCByb3dzLmxlbmd0aCwgYWRkaXRpb25hbERhdGEpO1xuICAgIH07XG4gICAgcmV0dXJuIE5nVGFibGVTb3VyY2VSZXN1bHQ7XG59KCkpO1xuZXhwb3J0IHsgTmdUYWJsZVNvdXJjZVJlc3VsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bmd0YWJsZS5yZXN1bHQuanMubWFwIiwiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCAnaGFtbWVyanMnO1xuaW1wb3J0IHsgTmdUYWJsZUNlbGwgfSBmcm9tICcuL2NvbXBvbmVudHMvY2VsbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmdUYWJsZUhlYWRlckNlbGwgfSBmcm9tICcuL2NvbXBvbmVudHMvaGVhZGVyLWNlbGwuY29tcG9uZW50JztcbmltcG9ydCB7IE5nVGFibGVIZWFkZXJSb3cgfSBmcm9tICcuL2NvbXBvbmVudHMvaGVhZGVyLXJvdy5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmdUYWJsZU1vcmUgfSBmcm9tICcuL2NvbXBvbmVudHMvbW9yZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmdUYWJsZVBhZ2luYXRvciB9IGZyb20gJy4vY29tcG9uZW50cy9wYWdpbmF0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IE5nVGFibGVSb3cgfSBmcm9tICcuL2NvbXBvbmVudHMvcm93LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ1RhYmxlIH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLmNvbXBvbmVudCc7XG5leHBvcnQgeyBOZ1RhYmxlSW5pdEV2ZW50LCBOZ1RhYmxlRGVzdHJveUV2ZW50LCBOZ1RhYmxlQmVmb3JlQ29ubmVjdEV2ZW50LCBOZ1RhYmxlQWZ0ZXJDb25uZWN0RXZlbnQsIE5nVGFibGVSYW5nZUV2ZW50IH0gZnJvbSAnLi9uZ3RhYmxlLmV2ZW50cyc7XG5leHBvcnQgeyBOZ1RhYmxlU291cmNlIH0gZnJvbSAnLi9uZ3RhYmxlLnNvdXJjZSc7XG5leHBvcnQgeyBOZ1RhYmxlU291cmNlUmVzdWx0IH0gZnJvbSAnLi9uZ3RhYmxlLnJlc3VsdCc7XG5leHBvcnQgeyBOZ1RhYmxlIH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLmNvbXBvbmVudCc7XG5leHBvcnQgeyBOZ1RhYmxlSGVhZGVyUm93IH0gZnJvbSAnLi9jb21wb25lbnRzL2hlYWRlci1yb3cuY29tcG9uZW50JztcbmV4cG9ydCB7IE5nVGFibGVIZWFkZXJDZWxsIH0gZnJvbSAnLi9jb21wb25lbnRzL2hlYWRlci1jZWxsLmNvbXBvbmVudCc7XG5leHBvcnQgeyBOZ1RhYmxlUm93IH0gZnJvbSAnLi9jb21wb25lbnRzL3Jvdy5jb21wb25lbnQnO1xuZXhwb3J0IHsgTmdUYWJsZUNlbGwgfSBmcm9tICcuL2NvbXBvbmVudHMvY2VsbC5jb21wb25lbnQnO1xuZXhwb3J0IHsgTmdUYWJsZVBhZ2luYXRvciB9IGZyb20gJy4vY29tcG9uZW50cy9wYWdpbmF0b3IuY29tcG9uZW50JztcbnZhciBOZ1RhYmxlTW9kdWxlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZ1RhYmxlTW9kdWxlKCkge1xuICAgIH1cbiAgICByZXR1cm4gTmdUYWJsZU1vZHVsZTtcbn0oKSk7XG5leHBvcnQgeyBOZ1RhYmxlTW9kdWxlIH07XG5OZ1RhYmxlTW9kdWxlLmRlY29yYXRvcnMgPSBbXG4gICAgeyB0eXBlOiBOZ01vZHVsZSwgYXJnczogW3tcbiAgICAgICAgICAgICAgICBpbXBvcnRzOiBbXG4gICAgICAgICAgICAgICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgICAgICAgICAgICAgRm9ybXNNb2R1bGVcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlLFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlSGVhZGVyUm93LFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlSGVhZGVyQ2VsbCxcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZVJvdyxcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZUNlbGwsXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVQYWdpbmF0b3IsXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVNb3JlXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtdLFxuICAgICAgICAgICAgICAgIGV4cG9ydHM6IFtcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZSxcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZUhlYWRlclJvdyxcbiAgICAgICAgICAgICAgICAgICAgTmdUYWJsZUhlYWRlckNlbGwsXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVSb3csXG4gICAgICAgICAgICAgICAgICAgIE5nVGFibGVDZWxsLFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlUGFnaW5hdG9yLFxuICAgICAgICAgICAgICAgICAgICBOZ1RhYmxlTW9yZVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuTmdUYWJsZU1vZHVsZS5jdG9yUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtdOyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLmpzLm1hcCJdLCJuYW1lcyI6WyJFdmVudEVtaXR0ZXIiLCJDb21wb25lbnQiLCJPdXRwdXQiLCJJbnB1dCIsIkJlaGF2aW9yU3ViamVjdCIsIk5nTW9kdWxlIiwiQ29tbW9uTW9kdWxlIiwiRm9ybXNNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUksZ0JBQWdCLElBQUksWUFBWTtJQUNoQyxTQUFTLGdCQUFnQixDQUFDLEtBQUssRUFBRTtRQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztLQUN2QjtJQUNELE1BQU0sQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtRQUN2RCxHQUFHLEVBQUUsWUFBWTtZQUNiLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUN0QjtRQUNELFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFlBQVksRUFBRSxJQUFJO0tBQ3JCLENBQUMsQ0FBQztJQUNILE9BQU8sZ0JBQWdCLENBQUM7Q0FDM0IsRUFBRSxDQUFDLENBQUM7QUFDTCxBQUNBLElBQUksbUJBQW1CLElBQUksWUFBWTtJQUNuQyxTQUFTLG1CQUFtQixDQUFDLEtBQUssRUFBRTtRQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztLQUN2QjtJQUNELE1BQU0sQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtRQUMxRCxHQUFHLEVBQUUsWUFBWTtZQUNiLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUN0QjtRQUNELFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFlBQVksRUFBRSxJQUFJO0tBQ3JCLENBQUMsQ0FBQztJQUNILE9BQU8sbUJBQW1CLENBQUM7Q0FDOUIsRUFBRSxDQUFDLENBQUM7QUFDTCxBQUNBLElBQUkseUJBQXlCLElBQUksWUFBWTtJQUN6QyxTQUFTLHlCQUF5QixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7UUFDOUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7S0FDekI7SUFDRCxNQUFNLENB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
