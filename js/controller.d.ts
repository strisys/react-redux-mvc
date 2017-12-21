import * as reactredux from 'react-redux';
import * as redux from 'redux';
export declare class ControllerRegistry {
    static readonly current: ControllerRegistry;
    private readonly reducers;
    private readonly controllers;
    private constructor();
    rootReducer: () => redux.Reducer<any>;
    add: (controller: ControllerBase) => ControllerBase;
    addRange: (controllers: ControllerBase[]) => ControllerRegistry;
}
export declare class Action implements redux.AnyAction {
    readonly type: string;
    readonly state: any;
    readonly reducer: (currentState: StoreSliceStateBase, action: Action) => StoreSliceStateBase;
    constructor(type: string, state: any, reducer?: (currentState: StoreSliceStateBase, action: Action) => StoreSliceStateBase);
    static getName(storeSliceName: string, actionName: string): string;
    isType(type: string): boolean;
    toPlainObject: () => {};
    toString(): string;
    static cloneObject: (original: {
        [key: string]: any;
    }) => {
        [key: string]: any;
    };
}
export declare abstract class StoreSliceStateBase {
    private static _versionCounter;
    private readonly _version;
    private _storeSliceName;
    constructor(storeSliceName?: string);
    storeSliceName: string;
    readonly version: number;
    toString(prefix?: string): string;
    abstract clone(): any;
}
export declare abstract class ControllerBase {
    private static _counter;
    private readonly _storeSliceName;
    private _dispatchFunc;
    constructor(storeSliceName: string);
    readonly storeSliceName: string;
    connect(component: reactredux.Component<any>): any;
    protected onGetMapStoreStateSliceToProps: (storeState: {
        [key: string]: any;
    }, componentProps?: {
        [key: string]: any;
    }) => {
        [key: string]: any;
    };
    private getMapDispatchToProps;
    protected abstract onGetDispatchActions: () => {
        [actionName: string]: any;
    };
    dispatchAction(actionName: string, state: any, reducer?: (currentState: any, action: Action) => StoreSliceStateBase): any;
    dispatch(reducer: (currentState: any) => StoreSliceStateBase): any;
    createAction(name: string, state?: any, reducer?: (currentState: any, action: Action) => StoreSliceStateBase): any;
    protected readonly isLoggingEnabled: boolean;
    reduce: (currentState: StoreSliceStateBase, action: redux.AnyAction) => StoreSliceStateBase;
    logObject: (prefix: string, values: any) => string;
    protected onReduce: (currentState: any, action: Action) => StoreSliceStateBase;
    protected abstract onGetInitialState(): any;
}
