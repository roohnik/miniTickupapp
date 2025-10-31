import React from 'react';
import { Objective, User, KeyResult } from './types';

interface ObjectiveSidePanelProps {
  objective: Objective | null;
  users: User[];
  objectives: Objective[];
  onClose: () => void;
  onDeleteKeyResult: (objectiveId: string, krId: string) => void;
  onUpdateKeyResultDetails: (objectiveId: string, krId: string, updates: Partial<KeyResult>) => void;
  onEditKeyResult: (krId: string) => void;
  onArchiveKeyResult: (objectiveId: string, krId: string) => void;
  onCheckin: (data: any) => void;
  onAddComment: (data: any) => void;
  challengeTags: any[];
  currentUser: User;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenProgramDesigner: (objId: string, krId: string) => void;
  projects: any[];
  tasks: any[];
  documents: any[];
  boards: any[];
  onNavigateToBoardFromKR: () => void;
  onOpenDocument: () => void;
  onSelectTask: () => void;
  strategies: any[];
  indices: any[];
  initialKRId?: string;
}

const ObjectiveSidePanel: React.FC<ObjectiveSidePanelProps> = ({
  objective,
  users,
  onClose,
  onDeleteKeyResult,
  onEditKeyResult,
  onArchiveKeyResult,
}) => {
  if (!objective) return null;

  const owner = users.find(u => u.id === objective.ownerId);

  return (
    <div 
      className="fixed top-0 left-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col z-40"
      dir="rtl"
    >
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h2 className="text-lg font-bold">جزئیات هدف</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          ✕
        </button>
      </div>

      <div className="flex-grow p-6 overflow-y-auto space-y-6">
        <div>
          <h3 className="text-2xl font-bold">{objective.title}</h3>
          <p className="mt-2 text-gray-600">{objective.description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">مالک:</span>
            <span className="font-medium">{owner?.name || 'نامشخص'}</span>
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold mb-4">نتایج کلیدی</h4>
          <div className="space-y-3">
            {objective.keyResults && objective.keyResults.length > 0 ? (
              objective.keyResults.map(kr => (
                <div key={kr.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium">{kr.title}</h5>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditKeyResult(kr.id)}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => onArchiveKeyResult(objective.id, kr.id)}
                        className="text-gray-600 text-sm hover:underline"
                      >
                        بایگانی
                      </button>
                      <button
                        onClick={() => onDeleteKeyResult(objective.id, kr.id)}
                        className="text-red-600 text-sm hover:underline"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {kr.startValue} → {kr.targetValue} ({kr.type})
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">هیچ نتیجه کلیدی وجود ندارد</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectiveSidePanel;
