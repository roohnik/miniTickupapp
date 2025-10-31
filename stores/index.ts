import React from 'react';
import { RootStore } from './RootStore';

export const rootStore = new RootStore();
export const StoreContext = React.createContext(rootStore);
export const StoreProvider = StoreContext.Provider;
export const useStore = () => React.useContext(StoreContext);
