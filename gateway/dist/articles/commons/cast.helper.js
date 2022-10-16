"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNumber = exports.trim = exports.toLowerCase = void 0;
function toLowerCase(value) {
    return value.toLowerCase();
}
exports.toLowerCase = toLowerCase;
function trim(value) {
    return value.trim();
}
exports.trim = trim;
function toNumber(value, defaultVal = 10) {
    let newValue = Number.parseInt(value || String(defaultVal), 10);
    if (Number.isNaN(newValue)) {
        newValue = defaultVal;
    }
    return newValue;
}
exports.toNumber = toNumber;
//# sourceMappingURL=cast.helper.js.map