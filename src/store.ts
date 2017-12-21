import * as redux from 'redux';
import immutableStateInvariantMiddleware from 'redux-immutable-state-invariant';

// TODO: Add support for hot-reloading, add support for redux-dev-tools Chrome ext
// Check out react slingshot for more info.

const getMiddleware = (): redux.GenericStoreEnhancer => {
  let middlewares: redux.Middleware[] = [];
  middlewares.push(immutableStateInvariantMiddleware());
  return redux.applyMiddleware(...middlewares);
};

export class StoreRegistry {
  private static store: redux.Store<any>;

  public static create = (rootReducer: redux.Reducer<any>, initialState?: any): redux.Store<any> => {
    if (StoreRegistry.store) {
      throw new Error('Invalid operation exception.  The redux store has already been created and cannot be created again.');
    }

    return (StoreRegistry.store = redux.createStore(rootReducer, initialState, getMiddleware()));
  }

  public static get = (): redux.Store<any> => {
    if (!StoreRegistry.store) {
      throw new Error('Invalid operation exception.  The redux store has NOT yet been created and cannot be returned.');
    }

    return StoreRegistry.store;
  }
}