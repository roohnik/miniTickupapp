import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import { User, Objective, CompanyVision, KeyResult, ObjectiveCategoryId, KRStatus } from '../types';

declare const io: (url: string) => any;

interface InitialData {
    users: User[];
    objectives: Objective[];
    companyVision: CompanyVision;
}

export class DataStore {
    rootStore: RootStore;
    socket: any = null;

    currentUser: User | null = null;
    loginError = '';
    isLoggingIn = false;
    
    users: User[] = [];
    objectives: Objective[] = [];
    companyVision: CompanyVision | null = null;
    
    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
        this.initSocket();
    }
    
    initSocket() {
        this.socket = io('http://localhost:4001');

        this.socket.on('connect', () => console.log('Connected to socket server'));
        this.socket.on('disconnect', () => console.log('Disconnected from socket server'));

        this.socket.on('initial_data', (data: InitialData) => {
            runInAction(() => {
                this.users = data.users;
                this.objectives = data.objectives;
                this.companyVision = data.companyVision;
            });
        });
        
        this.socket.on('login_success', (user: User) => {
            runInAction(() => {
                this.currentUser = user;
                this.isLoggingIn = false;
                this.loginError = '';
                this.socket.emit('get_initial_data');
            });
        });
        
        this.socket.on('login_error', ({ message }: { message: string }) => {
            runInAction(() => {
                this.loginError = message;
                this.isLoggingIn = false;
            });
        });

        this.socket.on('objectives_updated', (objectives: Objective[]) => {
            runInAction(() => { this.objectives = objectives; });
        });
        
        this.socket.on('users_updated', (users: User[]) => {
             runInAction(() => {
                this.users = users;
                if(this.currentUser) {
                    const updatedCurrentUser = users.find(u => u.id === this.currentUser!.id);
                    if (updatedCurrentUser) this.currentUser = updatedCurrentUser;
                }
            });
        });
    }

    login = (username: string, password: string) => {
        this.isLoggingIn = true;
        this.loginError = '';
        this.socket.emit('login', { username, password });
    }

    logout = () => {
        this.socket.emit('logout');
        this.currentUser = null;
    }

    updateUser = (userId: string, updates: Partial<User>) => {
        this.socket.emit('user:update', { userId, updates });
    }
    
    createObjective = (objectiveData: Omit<Objective, 'id' | 'keyResults'>, keyResultsData: Omit<KeyResult, 'id'>[]) => {
        this.socket.emit('objective:create', { objectiveData, keyResultsData });
        this.rootStore.uiStore.closeObjectiveWizard();
        this.rootStore.uiStore.closeSmartWizard();
    }
    
    createKeyResult = (krData: Omit<KeyResult, 'id'> & { objectiveId?: string }) => {
        const { objectiveId, ...rest } = krData;
        if (objectiveId) {
            this.socket.emit('key_result:create', { objectiveId, krData: rest });
        }
        this.rootStore.uiStore.closeAddKrModal();
    }

    updateObjective = (objectiveId: string, updates: Partial<Objective>) => {
        this.socket.emit('objective:update', { objectiveId, updates });
    }

    updateObjectiveDetails = (objectiveId: string, title: string, description: string, category: ObjectiveCategoryId, parentId: string | undefined, color: string, endDate: string | undefined, isDefault: boolean, quarter: string | undefined) => {
      this.updateObjective(objectiveId, { title, description, category, parentId, color, endDate, isDefault, quarter });
    }
    
    deleteObjective = (objectiveId: string) => {
        this.socket.emit('objective:delete', { objectiveId });
    }
    
    updateKeyResult = (objectiveId: string, krId: string, updates: Partial<KeyResult>) => {
        this.socket.emit('key_result:update', { objectiveId, krId, updates });
    }
    
    deleteKeyResult = (objectiveId: string, krId: string) => {
        this.socket.emit('key_result:delete', { objectiveId, krId });
    }
    
    checkInKeyResult = (data: { objectiveId: string; krId: string; value: number; rating: number; report: object; challengeDifficulty: number; challengeTagIds: string[]; status?: KRStatus; }) => {
        this.socket.emit('key_result:check_in', data);
    }
    
    addCommentToKeyResult = (data: { objectiveId: string; krId: string; authorId: string; text: string }) => {
        this.socket.emit('key_result:add_comment', data);
    }

    get visibleObjectives() {
        return this.objectives.filter(o => !o.isArchived);
    }
}
