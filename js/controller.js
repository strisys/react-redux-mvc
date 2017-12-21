"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var reactredux = require("react-redux");
var redux = require("redux");
var logObject = function (value, prefix) {
    if (prefix) {
        return "{" + prefix + ": " + JSON.stringify(value);
    }
    return JSON.stringify(value);
};
var ControllerRegistry = (function () {
    function ControllerRegistry() {
        this.reducers = {};
        this.controllers = [];
        this.rootReducer = function () {
            return redux.combineReducers(ControllerRegistry.current.reducers);
        };
        this.add = function (controller) {
            ControllerRegistry.current.controllers.push(controller);
            ControllerRegistry.current.reducers[controller.storeSliceName] = controller.reduce;
            return controller;
        };
        this.addRange = function (controllers) {
            controllers.forEach(function (controller) {
                ControllerRegistry.current.add(controller);
            });
            return ControllerRegistry.current;
        };
    }
    ControllerRegistry.current = new ControllerRegistry();
    return ControllerRegistry;
}());
exports.ControllerRegistry = ControllerRegistry;
var Action = (function () {
    function Action(type, state, reducer) {
        var _this = this;
        this.toPlainObject = function () {
            return { type: _this.type, state: _this.state, reducer: _this.reducer };
        };
        this.type = type;
        this.state = state;
        this.reducer = reducer;
    }
    Action.getName = function (storeSliceName, actionName) {
        return storeSliceName.toUpperCase() + ":" + actionName.toUpperCase();
    };
    Action.prototype.isType = function (type) {
        return (this.type === type);
    };
    Action.prototype.toString = function () {
        return logObject(this);
    };
    Action.cloneObject = function (original) {
        return (_.merge({}, original));
    };
    return Action;
}());
exports.Action = Action;
var StoreSliceStateBase = (function () {
    function StoreSliceStateBase(storeSliceName) {
        this._storeSliceName = (storeSliceName || '');
        this._version = StoreSliceStateBase._versionCounter++;
    }
    Object.defineProperty(StoreSliceStateBase.prototype, "storeSliceName", {
        get: function () {
            return this._storeSliceName;
        },
        set: function (value) {
            this._storeSliceName = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StoreSliceStateBase.prototype, "version", {
        get: function () {
            return this._version;
        },
        enumerable: true,
        configurable: true
    });
    StoreSliceStateBase.prototype.toString = function (prefix) {
        return logObject(this);
    };
    StoreSliceStateBase._versionCounter = 0;
    return StoreSliceStateBase;
}());
exports.StoreSliceStateBase = StoreSliceStateBase;
var ControllerBase = (function () {
    function ControllerBase(storeSliceName) {
        var _this = this;
        this.onGetMapStoreStateSliceToProps = function (storeState, componentProps) {
            var mappedProps = {};
            mappedProps[_this.storeSliceName] = storeState[_this.storeSliceName];
            if (_this.isLoggingEnabled) {
                console.log("Map store-state-to-component-props [store slice:=" + _this.storeSliceName + ", storeState:=" + JSON.stringify(storeState) + ", mappedProps:=" + JSON.stringify(mappedProps) + ", componentProps=" + JSON.stringify(componentProps) + "]");
            }
            return mappedProps;
        };
        this.getMapDispatchToProps = function (dispatch) {
            _this._dispatchFunc = dispatch;
            return { dispatch: _this.onGetDispatchActions() };
        };
        this.reduce = function (currentState, action) {
            var copy;
            if (currentState) {
                copy = currentState.clone();
                copy.storeSliceName = _this.storeSliceName;
            }
            var actionVal = action;
            if (!actionVal) {
                return copy;
            }
            var reducer = (action.reducer || _this.onReduce);
            var newState = reducer(copy, actionVal);
            if (newState) {
                newState.storeSliceName = _this.storeSliceName;
            }
            if (_this.isLoggingEnabled) {
                console.log("storeSliceName:=" + _this.storeSliceName + ", actionType:=" + action.type + ", action:=" + JSON.stringify(action) + ", currentState:=" + JSON.stringify(currentState) + ", newState:=" + JSON.stringify(newState));
            }
            return newState;
        };
        this.logObject = function (prefix, values) {
            return logObject(values, prefix);
        };
        this.onReduce = function (currentState, action) {
            return _this.onGetInitialState();
        };
        this._storeSliceName = storeSliceName;
    }
    Object.defineProperty(ControllerBase.prototype, "storeSliceName", {
        get: function () {
            return this._storeSliceName;
        },
        enumerable: true,
        configurable: true
    });
    ControllerBase.prototype.connect = function (component) {
        var connectStateAndProps = reactredux.connect(this.onGetMapStoreStateSliceToProps, this.getMapDispatchToProps);
        return connectStateAndProps(component);
    };
    ControllerBase.prototype.dispatchAction = function (actionName, state, reducer) {
        var actionObject = this.createAction(actionName, state, reducer);
        return this._dispatchFunc(actionObject);
    };
    ControllerBase.prototype.dispatch = function (reducer) {
        return this._dispatchFunc(this.createAction((ControllerBase._counter++).toString(), {}, function (currentState, action) {
            return reducer(currentState);
        }));
    };
    ControllerBase.prototype.createAction = function (name, state, reducer) {
        return (new Action(name, state, reducer)).toPlainObject();
    };
    Object.defineProperty(ControllerBase.prototype, "isLoggingEnabled", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    ControllerBase._counter = 0;
    return ControllerBase;
}());
exports.ControllerBase = ControllerBase;
//# sourceMappingURL=controller.js.map