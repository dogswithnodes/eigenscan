addEventListener('message', function (e) {
    var types = new Set();
    e.data.forEach(function (_a) {
        var typeId = _a.typeId;
        types.add(typeId);
    });
    postMessage(Array.from(types));
});
export {};
