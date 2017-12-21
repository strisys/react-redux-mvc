import * as ReactDOM from 'react-dom';
import * as redux from 'redux';
import { ControllerBase, ControllerRegistry } from './controller';
import { StoreRegistry } from './store';
import { StoreProvider } from './StoreProvider';

export const getProvider = (reducers: ControllerBase[]): (element: JSX.Element) => JSX.Element => {
  let store: redux.Store<any> = StoreRegistry.create(ControllerRegistry.current.addRange(reducers).rootReducer());
  return StoreProvider;
};

export const render = (reducers: ControllerBase[], element: JSX.Element, mountElementId: string): void  => {
  let mountPoint: (HTMLElement | null) = document.getElementById(mountElementId);
  let providerStore: (element: JSX.Element) => JSX.Element = getProvider(reducers);
  ReactDOM.render(providerStore(element), mountPoint);
};