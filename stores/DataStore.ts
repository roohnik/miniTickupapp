import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import { User, Objective, CompanyVision, KeyResult, ObjectiveCategoryId, KRStatus } from '../types';
import { getSocket } from '../services/socketService';

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
        this.socket = getSocket();

        this.socket.on('connect', () => {
            console.log('✅ Connected to backend server');
            // Load initial data after connection
            this.loadInitialData();
        });

        this.socket.on('disconnect', () => console.log('❌ Disconnected from backend server'));

        // Listen for broadcast events (backend uses colon notation)
        this.socket.on('login:success', (user: User) => {
            runInAction(() => {
                this.currentUser = user;
                this.isLoggingIn = false;
                this.loginError = '';
            });
        });
        
        this.socket.on('login:fail', (error: string) => {
            runInAction(() => {
                this.loginError = error;
                this.isLoggingIn = false;
            });
        });

        // Broadcast listeners for real-time updates
        this.socket.on('objectives:created', (objective: Objective) => {
            runInAction(() => {
                this.objectives = [...this.objectives, objective];
            });
        });

        this.socket.on('objectives:updated', (objective: Objective) => {
            runInAction(() => {
                this.objectives = this.objectives.map(o => 
                    o.id === objective.id ? objective : o
                );
            });
        });
        
        this.socket.on('objectives:deleted', (id: string) => {
            runInAction(() => {
                this.objectives = this.objectives.filter(o => o.id !== id);
            });
        });

        this.socket.on('users:created', (user: User) => {
            runInAction(() => {
                this.users = [...this.users, user];
            });
        });

        this.socket.on('users:updated', (user: User) => {
            runInAction(() => {
                this.users = this.users.map(u => u.id === user.id ? user : u);
                if (this.currentUser && this.currentUser.id === user.id) {
                    this.currentUser = user;
                }
            });
        });

        this.socket.on('users:deleted', (id: string) => {
            runInAction(() => {
                this.users = this.users.filter(u => u.id !== id);
            });
        });
    }

    loadInitialData = () => {
        // Load users
        this.socket.emit('users:list', null, (response: any) => {
            if (response?.ok) {
                runInAction(() => {
                    this.users = response.users || [];
                });
            }
        });

        // Load objectives
        this.socket.emit('objectives:list', null, (response: any) => {
            if (response?.ok) {
                runInAction(() => {
                    this.objectives = response.objectives || [];
                });
            }
        });
    }

    login = (username: string, password: string) => {
        this.isLoggingIn = true;
        this.loginError = '';
        
        this.socket.emit('login', { username, password }, (response: any) => {
            runInAction(() => {
                if (response?.ok) {
                    this.currentUser = response.user;
                    this.isLoggingIn = false;
                    this.loginError = '';
                    
                    // Store tokens
                    if (response.token) {
                        localStorage.setItem('accessToken', response.token);
                    }
                    if (response.refreshToken) {
                        localStorage.setItem('refreshToken', response.refreshToken);
                    }
                    
                    // Load initial data
                    this.loadInitialData();
                } else {
                    this.loginError = response?.error || 'Login failed';
                    this.isLoggingIn = false;
                }
            });
        });
    }

    logout = () => {
        const refreshToken = localStorage.getItem('refreshToken');
        this.socket.emit('auth:logout', { refreshToken }, (response: any) => {
            runInAction(() => {
                this.currentUser = null;
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            });
        });
    }

    updateUser = (userId: string, updates: Partial<User>) => {
        this.socket.emit('users:update', { id: userId, ...updates }, (response: any) => {
            if (!response?.ok) {
                console.error('Failed to update user:', response?.error);
            }
        });
    }
    
    createObjective = (objectiveData: Omit<Objective, 'id' | 'keyResults'>, keyResultsData: Omit<KeyResult, 'id'>[]) => {
        this.socket.emit('objectives:create', { ...objectiveData, keyResults: keyResultsData }, (response: any) => {
            if (response?.ok) {
                this.rootStore.uiStore.closeObjectiveWizard();
                this.rootStore.uiStore.closeSmartWizard();
            } else {
                console.error('Failed to create objective:', response?.error);
            }
        });
    }
    
    createKeyResult = (krData: Omit<KeyResult, 'id'> & { objectiveId?: string }) => {
        const { objectiveId, ...rest } = krData;
        if (objectiveId) {
            this.socket.emit('keyResults:create', { objectiveId, ...rest }, (response: any) => {
                if (response?.ok) {
                    this.rootStore.uiStore.closeAddKrModal();
                } else {
                    console.error('Failed to create key result:', response?.error);
                }
            });
        }
    }

    updateObjective = (objectiveId: string, updates: Partial<Objective>) => {
        this.socket.emit('objectives:update', { id: objectiveId, ...updates }, (response: any) => {
            if (!response?.ok) {
                console.error('Failed to update objective:', response?.error);
            }
        });
    }

    updateObjectiveDetails = (objectiveId: string, title: string, description: string, category: ObjectiveCategoryId, parentId: string | undefined, color: string, endDate: string | undefined, isDefault: boolean, quarter: string | undefined) => {
      this.updateObjective(objectiveId, { title, description, category, parentId, color, endDate, isDefault, quarter });
    }
    
    deleteObjective = (objectiveId: string) => {
        this.socket.emit('objectives:delete', objectiveId, (response: any) => {
            if (!response?.ok) {
                console.error('Failed to delete objective:', response?.error);
            }
        });
    }
    
    updateKeyResult = (objectiveId: string, krId: string, updates: Partial<KeyResult>) => {
        this.socket.emit('keyResults:update', { id: krId, objectiveId, ...updates }, (response: any) => {
            if (!response?.ok) {
                console.error('Failed to update key result:', response?.error);
            }
        });
    }
    
    deleteKeyResult = (objectiveId: string, krId: string) => {
        this.socket.emit('keyResults:delete', krId, (response: any) => {
            if (!response?.ok) {
                console.error('Failed to delete key result:', response?.error);
            }
        });
    }
    
    checkInKeyResult = (data: { objectiveId: string; krId: string; value: number; rating: number; report: object; challengeDifficulty: number; challengeTagIds: string[]; status?: KRStatus; }) => {
        this.socket.emit('krCheckins:create', data, (response: any) => {
            if (!response?.ok) {
                console.error('Failed to check in key result:', response?.error);
            }
        });
    }
    
    addCommentToKeyResult = (data: { objectiveId: string; krId: string; authorId: string; text: string }) => {
        // Comments might be handled differently in the backend - this is a placeholder
        console.log('Add comment to key result:', data);
    }

    get visibleObjectives() {
        return this.objectives.filter(o => !o.isArchived);
    }
}
