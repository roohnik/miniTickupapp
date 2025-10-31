import { makeAutoObservable } from 'mobx';
import { UiStore } from './UiStore';
import { DataStore } from './DataStore';

export class RootStore {
    uiStore: UiStore;
    dataStore: DataStore;

    constructor() {
        makeAutoObservable(this);
        this.uiStore = new UiStore(this);
        this.dataStore = new DataStore(this);
    }
}
