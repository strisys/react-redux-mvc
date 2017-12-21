import * as _ from 'lodash';
import * as reactredux from 'react-redux';
import * as redux from 'redux';

const logObject = (value: any, prefix?: string): string => {
  let str: string = JSON.stringify(value);
  return ((prefix) ? `{${prefix}: ${str}` : str);
};

export class ControllerRegistry {
  public static readonly current: ControllerRegistry = new ControllerRegistry();
  private readonly reducers: redux.ReducersMapObject = {};
  private readonly controllers: ControllerBase[] = [];

  private constructor() {
  }

  public rootReducer = (): redux.Reducer<any> => {
    return redux.combineReducers(ControllerRegistry.current.reducers);
  }

  public add = (controller: ControllerBase): ControllerBase => {
    ControllerRegistry.current.controllers.push(controller);
    ControllerRegistry.current.reducers[controller.storeSliceName] = controller.reduce;
    return controller;
  }

  public addRange = (controllers: ControllerBase[]): ControllerRegistry => {
    controllers.forEach((controller) => {
      ControllerRegistry.current.add(controller);
    });

    return ControllerRegistry.current;
  }
}

export class Action implements redux.AnyAction {
  public readonly type: string;
  public readonly state: any;
  public readonly reducer: (currentState: StoreSliceStateBase, action: Action) => StoreSliceStateBase;

  constructor(type: string, state: any, reducer?: (currentState: StoreSliceStateBase, action: Action) => StoreSliceStateBase) {
    this.type = type;
    this.state = state;
    this.reducer = reducer;
  }

  public static getName(storeSliceName: string, actionName: string) {
    return `${storeSliceName.toUpperCase()}:${actionName.toUpperCase()}`;
  }

  public isType(type: string): boolean {
    return (this.type === type);
  }

  public toPlainObject = (): {} => {
    return { type: this.type, state: this.state, reducer: this.reducer };
  }

  public toString(): string {
    return logObject(this);
  }

  public static cloneObject = (original: {[key: string]: any}): {[key: string]: any} => {
    return (_.merge({}, original));
  }
}

export abstract class StoreSliceStateBase {
  private static _versionCounter: number = 0;
  private readonly _version: number;
  private _storeSliceName: string;

  constructor(storeSliceName?: string) {
    this._storeSliceName = (storeSliceName || '');
    this._version = StoreSliceStateBase._versionCounter++;
  }

  public get storeSliceName(): string {
    return this._storeSliceName;
  }

  public set storeSliceName(value: string) {
    this._storeSliceName = value;
  }

  public get version(): number {
    return this._version;
  }

  public toString(prefix?: string): string {
    return logObject(this);
  }

  public abstract clone(): any;
}

export abstract class ControllerBase {
  private static _counter: number = 0;
  private readonly _storeSliceName: string;
  private _dispatchFunc: (action: redux.Action) => void;

  constructor(storeSliceName: string) {
    this._storeSliceName = storeSliceName;
  }

  public get storeSliceName(): string {
    return this._storeSliceName;
  }

  public connect(component: reactredux.Component<any>) {
    const connectStateAndProps: any = reactredux.connect(this.onGetMapStoreStateSliceToProps, this.getMapDispatchToProps);
    return connectStateAndProps(component);
  }

  protected onGetMapStoreStateSliceToProps = (storeState: { [key: string]: any }, componentProps?: { [key: string]: any }): { [key: string]: any } => {
    let mappedProps: { [key: string]: any } = {};
    mappedProps[this.storeSliceName] = storeState[this.storeSliceName];

    if (this.isLoggingEnabled) {
      console.log(`Map store-state-to-component-props [store slice:=${this.storeSliceName}, storeState:=${JSON.stringify(storeState)}, mappedProps:=${JSON.stringify(mappedProps)}, componentProps=${JSON.stringify(componentProps)}]`);
    }

    return mappedProps;
  }

  private getMapDispatchToProps = (dispatch: (action: redux.Action) => void) => {
    this._dispatchFunc = dispatch;
    return { dispatch: this.onGetDispatchActions() };
  }

  protected abstract onGetDispatchActions: () => { [actionName: string]: any };

  public dispatchAction(actionName: string, state: any, reducer?: (currentState: any, action: Action) => StoreSliceStateBase): any {
    let actionObject: any = this.createAction(actionName, state, reducer);
    return this._dispatchFunc(actionObject);
  }

  public dispatch(reducer: (currentState: any) => StoreSliceStateBase): any {
    return this._dispatchFunc(this.createAction((ControllerBase._counter++).toString(), {}, (currentState: StoreSliceStateBase, action: redux.AnyAction) => {
      return reducer(currentState);
    }));
  }

  public createAction(name: string, state?: any, reducer?: (currentState: any, action: Action) => StoreSliceStateBase): any {
    return (new Action(name, state, reducer)).toPlainObject();
  }

  protected get isLoggingEnabled(): boolean {
    return false;
  }

  public reduce = (currentState: StoreSliceStateBase, action: redux.AnyAction): StoreSliceStateBase => {
    let copy: any;

    if (currentState) {
      copy = currentState.clone();
      copy.storeSliceName = this.storeSliceName;
    }

    let actionVal: Action = (action as Action);

    if (!actionVal) {
      return copy;
    }

    let reducer: (currentState: any, action: Action) => StoreSliceStateBase = (action.reducer || this.onReduce);
    let newState: StoreSliceStateBase = reducer(copy, actionVal);

    if (newState) {
      newState.storeSliceName = this.storeSliceName;
    }

    if (this.isLoggingEnabled) {
      console.log(`storeSliceName:=${this.storeSliceName}, actionType:=${action.type}, action:=${JSON.stringify(action)}, currentState:=${JSON.stringify(currentState)}, newState:=${JSON.stringify(newState)}`);
    }

    return newState;
  }

  public logObject = (prefix: string, values: any): string => {
    return logObject(values, prefix);
  }

  protected onReduce = (currentState: any, action: Action): StoreSliceStateBase => {
    return this.onGetInitialState();
  }

  protected abstract onGetInitialState(): any;
}