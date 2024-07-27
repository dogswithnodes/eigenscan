var rowsComparator = function (sortParams) {
    return function (a, b) {
        var orderBy = sortParams.orderBy, orderDirection = sortParams.orderDirection;
        var isAscending = orderDirection === 'asc';
        var x = a[orderBy];
        var y = b[orderBy];
        if (x === null) {
            return 1;
        }
        if (y === null) {
            return -1;
        }
        if (typeof x === 'number' && typeof y === 'number') {
            return isAscending ? x - y : y - x;
        }
        return new Intl.Collator('en', { sensitivity: 'base', ignorePunctuation: true }).compare(String(isAscending ? x : y), String(isAscending ? y : x));
    };
};
var sortTableRows = function (sortParams) {
    return function (arr) {
        return arr.sort(rowsComparator(sortParams));
    };
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var compose = function () {
    var fs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fs[_i] = arguments[_i];
    }
    return fs.reduceRight(function (f1, f2) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return f2(f1.apply(void 0, args));
        };
    });
};
addEventListener('message', function (e) {
    var _a = e.data, currentPage = _a.currentPage, currentActions = _a.currentActions, perPage = _a.perPage, sortParams = _a.sortParams, rows = _a.rows;
    var filteredRows = currentActions.length > 0 ? rows.filter(function (_a) {
        var typeId = _a.typeId;
        return currentActions.includes(typeId);
    }) : rows;
    postMessage({
        rows: compose(function (rows) { return rows.slice(perPage * (currentPage - 1), perPage * currentPage); }, sortTableRows(sortParams))(filteredRows),
        total: filteredRows.length,
    });
});
export {};
