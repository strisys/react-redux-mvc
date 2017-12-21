"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_redux_1 = require("react-redux");
var store_1 = require("./store");
exports.StoreProvider = function (component) {
    return (React.createElement(react_redux_1.Provider, { store: store_1.StoreRegistry.get() }, component));
};
//# sourceMappingURL=StoreProvider.js.map