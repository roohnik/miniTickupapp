import { makeAutoObservable } from 'mobx';
import { RootStore } from './RootStore';
import { Objective, KeyResult } from '../types';

export class UiStore {
    rootStore: RootStore;
    
    // Modal states
    isEditProfileModalOpen = false;
    isObjectiveWizardOpen = false;
    isSmartWizardOpen = false;
    isArchivedModalOpen = false;
    isAddKrModalOpen = false;
    
    // Entity editing/selection states
    objectiveToEditId: string | null = null;
    keyResultToEdit: { objectiveId: string; krId: string } | null = null;
    krToCheckin: { objectiveId: string; krId: string } | null = null;
    objectiveForNewKR: Objective | null = null;

    // Confirmation modal state
    confirmation: { isOpen: boolean, title: string, message: string, onConfirm: () => void } = { isOpen: false, title: '', message: '', onConfirm: () => {} };
    
    // Side panel state
    selectedObjectiveId: string | null = null;
    initialKRId: string | null = null;

    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    // Actions
    openEditProfileModal = () => { this.isEditProfileModalOpen = true; }
    closeEditProfileModal = () => { this.isEditProfileModalOpen = false; }
    
    openObjectiveWizard = () => { this.isObjectiveWizardOpen = true; }
    closeObjectiveWizard = () => { this.isObjectiveWizardOpen = false; }

    openAddKrModal = () => { this.isAddKrModalOpen = true; }
    closeAddKrModal = () => { this.isAddKrModalOpen = false; this.objectiveForNewKR = null; }
    openAddKrModalForObjective = (objectiveId: string) => {
        const objective = this.rootStore.dataStore.objectives.find(o => o.id === objectiveId);
        if (objective) {
            this.objectiveForNewKR = objective;
            this.isAddKrModalOpen = true;
        }
    }
    
    openSmartWizard = () => { this.isSmartWizardOpen = true; }
    closeSmartWizard = () => { this.isSmartWizardOpen = false; }
    
    openArchivedModal = () => { this.isArchivedModalOpen = true; }
    closeArchivedModal = () => { this.isArchivedModalOpen = false; }

    selectObjective = (objectiveId: string, krId: string | null = null) => {
        this.selectedObjectiveId = objectiveId;
        this.initialKRId = krId;
    }
    
    closeObjectiveSidePanel = () => {
        this.selectedObjectiveId = null;
        this.initialKRId = null;
    }
    
    editObjective = (objective: Objective) => { this.objectiveToEditId = objective.id; }
    closeEditObjectiveModal = () => { this.objectiveToEditId = null; }
    
    editKeyResult = (objectiveId: string, krId: string) => { this.keyResultToEdit = { objectiveId, krId }; }
    closeEditKeyResultModal = () => { this.keyResultToEdit = null; }

    openKrCheckinModal = (objectiveId: string, krId: string) => { this.krToCheckin = { objectiveId, krId }; }
    closeKrCheckinModal = () => { this.krToCheckin = null; }
    
    showConfirmation = (title: string, message: string, onConfirm: () => void) => {
        this.confirmation = { isOpen: true, title, message, onConfirm };
    }
    
    hideConfirmation = () => {
        this.confirmation = { ...this.confirmation, isOpen: false };
    }
    
    // Computed values
    get selectedObjective(): Objective | null {
        if (!this.selectedObjectiveId) return null;
        return this.rootStore.dataStore.objectives.find(o => o.id === this.selectedObjectiveId) || null;
    }
    
    get objectiveToEdit(): Objective | null {
        if (!this.objectiveToEditId) return null;
        return this.rootStore.dataStore.objectives.find(o => o.id === this.objectiveToEditId) || null;
    }
    
    get keyResultToEditData(): { objectiveId: string; kr: KeyResult } | null {
        if (!this.keyResultToEdit) return null;
        const objective = this.rootStore.dataStore.objectives.find(o => o.id === this.keyResultToEdit!.objectiveId);
        const kr = objective?.keyResults.find(k => k.id === this.keyResultToEdit!.krId);
        if (!objective || !kr) return null;
        return { objectiveId: objective.id, kr };
    }

    get krToCheckinData(): KeyResult | null {
        if (!this.krToCheckin) return null;
        const objective = this.rootStore.dataStore.objectives.find(o => o.id === this.krToCheckin!.objectiveId);
        return objective?.keyResults.find(k => k.id === this.krToCheckin!.krId) || null;
    }
}
