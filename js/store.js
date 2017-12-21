"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux = require("redux");
var redux_immutable_state_invariant_1 = require("redux-immutable-state-invariant");
var getMiddleware = function () {
    var middlewares = [];
    middlewares.push(redux_immutable_state_invariant_1.default());
    return redux.applyMiddleware.apply(redux, middlewares);
};
var StoreRegistry = (function () {
    function StoreRegistry() {
    }
    StoreRegistry.create = function (rootReducer, initialState) {
        if (StoreRegistry.store) {
            throw new Error('Invalid operation exception.  The redux store has already been created and cannot be created again.');
        }
        return (StoreRegistry.store = redux.createStore(rootReducer, initialState, getMiddleware()));
    };
    StoreRegistry.get = function () {
        if (!StoreRegistry.store) {
            throw new Error('Invalid operation exception.  The redux store has NOT yet been created and cannot be returned.');
        }
        return StoreRegistry.store;
    };
    return StoreRegistry;
}());
exports.StoreRegistry = StoreRegistry;
//# sourceMappingURL=store.js.map