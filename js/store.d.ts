import * as redux from 'redux';
export declare class StoreRegistry {
    private static store;
    static create: (rootReducer: redux.Reducer<any>, initialState?: any) => redux.Store<any>;
    static get: () => redux.Store<any>;
}
