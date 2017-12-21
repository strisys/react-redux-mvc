import * as React from 'react';
import { Provider } from 'react-redux';
import { StoreRegistry } from './store';

export const StoreProvider = (component: JSX.Element): JSX.Element => {
  return (
    <Provider store={StoreRegistry.get()}>
      {component}
    </Provider>
  );
};