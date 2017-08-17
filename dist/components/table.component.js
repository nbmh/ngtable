import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgTableInitEvent, NgTableRangeEvent, NgTableBeforeConnectEvent, NgTableAfterConnectEvent, NgTableDestroyEvent } from '../ngtable.events';
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
        this.initEmitter = new EventEmitter();
        this.destroyEmitter = new EventEmitter();
        this.beforeConnectEmitter = new EventEmitter();
        this.afterConnectEmitter = new EventEmitter();
        this.rangeChangeEmitter = new EventEmitter();
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
export { NgTable };
NgTable.decorators = [
    { type: Component, args: [{
                selector: 'ng-table',
                template: "\n  <ng-content></ng-content>\n  ",
                styles: ["\n:host(.ng-table) {\n  background: #fff;\n  overflow: auto;\n  display: flex;\n  flex-direction: column;\n}\n\n:host(.ng-table) /deep/ .ng-table-header-row,\n:host(.ng-table) /deep/ .ng-table-row {\n  border-bottom-color: rgba(0, 0, 0, .12);\n  display: flex;\n  border-bottom-width: 1px;\n  border-bottom-style: solid;\n  align-items: center;\n  min-height: 48px;\n  padding: 0 12px;\n}\n\n:host(.ng-table) /deep/ .ng-table-header-cell {\n  font-size: 12px;\n  font-weight: 500;\n  color: rgba(0, 0, 0, .54);\n  flex: 1;\n}\n\n:host(.ng-table) /deep/ .ng-table-cell {\n  font-size: 14px;\n  color: rgba(0,0,0,.87);\n  flex: 1;\n}\n\n:host(.ng-table) /deep/ .ng-table-icon {\n  width: 40px;\n  height: 40px;\n}\n\n:host(.ng-table-striped) /deep/ .ng-table-row:nth-of-type(odd) {\n  background-color: #f9f9f9;\n}\n\n:host(.ng-table-striped.ng-table-hover) /deep/ .ng-table-row:hover {\n  background-color: #f5f5f5;\n}\n  "],
                host: { 'class': 'ng-table' }
            },] },
];
/** @nocollapse */
NgTable.ctorParameters = function () { return [
    { type: ActivatedRoute, },
]; };
NgTable.propDecorators = {
    'initEmitter': [{ type: Output, args: ['init',] },],
    'destroyEmitter': [{ type: Output, args: ['destroy',] },],
    'beforeConnectEmitter': [{ type: Output, args: ['beforeConnect',] },],
    'afterConnectEmitter': [{ type: Output, args: ['afterConnect',] },],
    'rangeChangeEmitter': [{ type: Output, args: ['rangeChange',] },],
    'dataSource': [{ type: Input },],
    'queryPage': [{ type: Input },],
    'page': [{ type: Input },],
    'range': [{ type: Input },],
    'rangeOptions': [{ type: Input },],
};
//# sourceMappingURL=table.component.js.map