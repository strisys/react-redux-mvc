"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReactDOM = require("react-dom");
var controller_1 = require("./controller");
var store_1 = require("./store");
var StoreProvider_1 = require("./StoreProvider");
exports.getProvider = function (reducers) {
    var store = store_1.StoreRegistry.create(controller_1.ControllerRegistry.current.addRange(reducers).rootReducer());
    return StoreProvider_1.StoreProvider;
};
exports.render = function (reducers, element, mountElementId) {
    var mountPoint = document.getElementById(mountElementId);
    var providerStore = exports.getProvider(reducers);
    ReactDOM.render(providerStore(element), mountPoint);
};
//# sourceMappingURL=configuration.js.map