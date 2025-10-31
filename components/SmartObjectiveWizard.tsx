import React, { useState } from 'react';
import { Objective, KeyResult, User, ObjectiveCategoryId, CompanyVision } from '../types';
import { AIPrompts } from '../services/geminiService';

interface SmartObjectiveWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (objectiveData: Omit<Objective, 'id' | 'keyResults'>, keyResults: Omit<KeyResult, 'id'>[]) => void;
  users: User[];
  defaultOwnerId: string;
  styleSettings: any;
  aiPrompts: AIPrompts;
  companyVision: CompanyVision | null;
}

const SmartObjectiveWizard: React.FC<SmartObjectiveWizardProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultOwnerId,
}) => {
  const [goalDescription, setGoalDescription] = useState('');
  const [category] = useState<ObjectiveCategoryId>('BUSINESS_GROWTH');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const objectiveData: Omit<Objective, 'id' | 'keyResults'> = {
      title: goalDescription.substring(0, 100),
      description: goalDescription,
      ownerId: defaultOwnerId,
      category,
      isArchived: false,
    };

    onSubmit(objectiveData, []);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">ایجاد هدف هوشمند</h2>
        <p className="text-gray-600 mb-6">از هوش مصنوعی برای کمک در تعریف اهداف استفاده کنید</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">ایده اولیه شما</label>
            <textarea
              value={goalDescription}
              onChange={(e) => setGoalDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              rows={6}
              placeholder="چه هدف اجرایی در ذهن دارید؟ به طور خلاصه توصیف کنید..."
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              ایجاد هدف هوشمند
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SmartObjectiveWizard;
