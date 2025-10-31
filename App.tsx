import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from './stores';
import { AIPrompts, DEFAULT_AI_PROMPTS } from './services/geminiService';
import { ComponentStyles, ObjectiveSettings } from './types';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import EditProfileModal from './components/EditProfileModal';
import ObjectiveSidePanel from './components/ObjectiveSidePanel';
import ObjectiveCreationWizard from './components/ObjectiveCreationWizard';
import SmartObjectiveWizard from './components/SmartObjectiveWizard';
import EditObjectiveModal from './components/EditObjectiveModal';
import ConfirmationModal from './components/ConfirmationModal';
import ArchivedItemsModal from './components/ArchivedItemsModal';
import EditKeyResultModal from './components/EditKeyResultModal';
import UpdateKRModal from './components/UpdateKRModal';
import AddKeyResultModal from './components/AddKeyResultModal';

const App: React.FC = () => {
    const { dataStore, uiStore } = useStore();

    // These settings can remain as local component state or be moved to a settings store later.
    const [aiPrompts] = React.useState<AIPrompts>(DEFAULT_AI_PROMPTS);
    const [objectiveSettings] = React.useState<ObjectiveSettings>({ hierarchicalViewStyle: 'ADVANCED_ORG_CHART' });
    const [componentStyles] = React.useState<ComponentStyles>({
        popups: { fontFamily: 'Vazirmatn, sans-serif', fontSize: 'base', primaryColor: '#2563EB', backgroundColor: 'bg-white' },
        strategyCards: { fontFamily: 'Vazirmatn, sans-serif', fontSize: 'base', primaryColor: '#2563EB', backgroundColor: 'bg-white' },
    });
    
    if (!dataStore.currentUser) {
        return <LoginPage onLogin={dataStore.login} error={dataStore.loginError} isLoading={dataStore.isLoggingIn} />;
    }
    
    const objectivePanelProps = {
        objective: uiStore.selectedObjective,
        users: dataStore.users,
        objectives: dataStore.objectives,
        onClose: uiStore.closeObjectiveSidePanel,
        onDeleteKeyResult: (objectiveId: string, krId: string) => uiStore.showConfirmation('حذف نتیجه کلیدی', 'آیا از حذف این نتیجه کلیدی اطمینان دارید؟', () => dataStore.deleteKeyResult(objectiveId, krId)),
        onUpdateKeyResultDetails: dataStore.updateKeyResult,
        onEditKeyResult: (krId: string) => { if (uiStore.selectedObjectiveId) uiStore.editKeyResult(uiStore.selectedObjectiveId, krId) },
        onArchiveKeyResult: (objectiveId: string, krId: string) => dataStore.updateKeyResult(objectiveId, krId, { isArchived: true }),
        onCheckin: dataStore.checkInKeyResult,
        onAddComment: dataStore.addCommentToKeyResult,
        challengeTags: [],
        currentUser: dataStore.currentUser!,
        isFullscreen: false,
        onToggleFullscreen: () => {},
        onOpenProgramDesigner: (objId: string, krId: string) => {},
        projects: [], tasks: [], documents: [], boards: [],
        onNavigateToBoardFromKR: () => {}, onOpenDocument: () => {},
        onSelectTask: () => {}, strategies: [], indices: [],
        initialKRId: uiStore.initialKRId,
    };

    return (
        <div className="flex h-screen bg-brand-secondary dark:bg-slate-900" dir="rtl">
            <Sidebar
                currentUser={dataStore.currentUser}
                onLogout={dataStore.logout}
                onEditProfile={uiStore.openEditProfileModal}
                onViewProfile={() => {}}
                sidebarConfig={{ navItems: [] } as any}
            />
            
            <div className={`flex-1 flex flex-row overflow-hidden md:mr-64`}>
                <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                    <Header
                        pageTitle="اهداف"
                        onOpenArchivedModal={uiStore.openArchivedModal}
                        onExportProgram={() => window.dispatchEvent(new CustomEvent('exportProgramView'))}
                    />
                    <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-800">
                        <div className="p-4 md:p-6 h-full">
                            <DashboardPage 
                                objectives={dataStore.visibleObjectives} users={dataStore.users} onSelectObjective={(obj) => uiStore.selectObjective(obj.id)}
                                onAddNewObjective={uiStore.openObjectiveWizard}
                                onAddKeyResult={uiStore.openAddKrModalForObjective}
                                onSelectKeyResult={uiStore.selectObjective}
                                onOpenAddKrModal={uiStore.openAddKrModal}
                                onEditObjective={uiStore.editObjective}
                                onDeleteObjective={(id) => uiStore.showConfirmation('حذف هدف', 'آیا از حذف این هدف اطمینان دارید؟', () => dataStore.deleteObjective(id))}
                                onDeleteKeyResult={(objId, krId) => uiStore.showConfirmation('حذف نتیجه کلیدی', 'آیا از حذف این نتیجه کلیدی اطمینان دارید؟', () => dataStore.deleteKeyResult(objId, krId))}
                                onUpdateKeyResultDetails={dataStore.updateKeyResult}
                                objectiveSettings={objectiveSettings}
                                onArchiveObjective={(id) => dataStore.updateObjective(id, { isArchived: true })}
                                onArchiveKeyResult={(objId, krId) => dataStore.updateKeyResult(objId, krId, { isArchived: true })}
                                onStartSmartWizard={uiStore.openSmartWizard}
                                onEditKeyResult={uiStore.editKeyResult}
                            />
                        </div>
                    </main>
                </div>
            </div>

            {/* Global Modals & Side Panels */}
            {uiStore.isEditProfileModalOpen && <EditProfileModal isOpen={uiStore.isEditProfileModalOpen} onClose={uiStore.closeEditProfileModal} user={dataStore.currentUser} onSubmit={(userId, name, username, password, signatureUrl) => dataStore.updateUser(userId, { name, username, password, signatureUrl: signatureUrl === null ? undefined : signatureUrl })} />}
            {uiStore.selectedObjective && <ObjectiveSidePanel {...objectivePanelProps} />}
            {uiStore.isObjectiveWizardOpen && <ObjectiveCreationWizard isOpen={uiStore.isObjectiveWizardOpen} onClose={uiStore.closeObjectiveWizard} onSubmit={dataStore.createObjective as any} users={dataStore.users} objectives={dataStore.objectives} defaultOwnerId={dataStore.currentUser.id} styleSettings={componentStyles.popups} aiPrompts={aiPrompts} />}
            {uiStore.isAddKrModalOpen && <AddKeyResultModal isOpen={uiStore.isAddKrModalOpen} onClose={uiStore.closeAddKrModal} objective={uiStore.objectiveForNewKR!} users={dataStore.users} onSubmit={(krData) => dataStore.createKeyResult(krData)} aiPrompts={aiPrompts} styleSettings={componentStyles.popups} />}
            {uiStore.isSmartWizardOpen && <SmartObjectiveWizard isOpen={uiStore.isSmartWizardOpen} onClose={uiStore.closeSmartWizard} onSubmit={dataStore.createObjective as any} users={dataStore.users} defaultOwnerId={dataStore.currentUser.id} styleSettings={componentStyles.popups} aiPrompts={aiPrompts} companyVision={dataStore.companyVision} />}
            {uiStore.objectiveToEdit && <EditObjectiveModal isOpen={!!uiStore.objectiveToEdit} onClose={uiStore.closeEditObjectiveModal} objective={uiStore.objectiveToEdit} objectives={dataStore.objectives} onSubmit={dataStore.updateObjectiveDetails} />}
            {uiStore.keyResultToEditData && (
                <EditKeyResultModal
                    isOpen={!!uiStore.keyResultToEditData}
                    onClose={uiStore.closeEditKeyResultModal}
                    kr={uiStore.keyResultToEditData.kr}
                    objectiveId={uiStore.keyResultToEditData.objectiveId}
                    users={dataStore.users}
                    onUpdate={dataStore.updateKeyResult}
                />
            )}
            {uiStore.confirmation.isOpen && <ConfirmationModal isOpen={uiStore.confirmation.isOpen} onClose={uiStore.hideConfirmation} onConfirm={() => { uiStore.confirmation.onConfirm(); uiStore.hideConfirmation(); }} title={uiStore.confirmation.title} message={uiStore.confirmation.message} />}
            {uiStore.isArchivedModalOpen && <ArchivedItemsModal isOpen={uiStore.isArchivedModalOpen} onClose={uiStore.closeArchivedModal} objectives={dataStore.objectives} onUnarchiveObjective={(id) => dataStore.updateObjective(id, { isArchived: false })} onUnarchiveKeyResult={(objId, krId) => dataStore.updateKeyResult(objId, krId, { isArchived: false })} />}
            {uiStore.krToCheckinData && (
                <UpdateKRModal
                    isOpen={!!uiStore.krToCheckinData}
                    onClose={uiStore.closeKrCheckinModal}
                    kr={uiStore.krToCheckinData}
                    onSubmit={dataStore.checkInKeyResult as any}
                    challengeTags={[]}
                    objectives={dataStore.objectives}
                />
            )}
        </div>
    );
};

export default observer(App);