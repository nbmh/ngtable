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
export { NgTableSourceResult };
//# sourceMappingURL=ngtable.result.js.map