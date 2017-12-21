/// <reference types="react" />
import { ControllerBase } from './controller';
export declare const getProvider: (reducers: ControllerBase[]) => (element: JSX.Element) => JSX.Element;
export declare const render: (reducers: ControllerBase[], element: JSX.Element, mountElementId: string) => void;
