import React, { useState } from 'react';
import { Objective, KeyResult, User, ObjectiveCategoryId } from '../types';
import { AIPrompts } from '../services/geminiService';

interface ObjectiveCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (objectiveData: Omit<Objective, 'id' | 'keyResults'>, keyResults: Omit<KeyResult, 'id'>[]) => void;
  users: User[];
  objectives: Objective[];
  defaultOwnerId: string;
  styleSettings: any;
  aiPrompts: AIPrompts;
}

const ObjectiveCreationWizard: React.FC<ObjectiveCreationWizardProps> = ({
  isOpen,
  onClose,
  onSubmit,
  users,
  defaultOwnerId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category] = useState<ObjectiveCategoryId>('BUSINESS_GROWTH');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const objectiveData: Omit<Objective, 'id' | 'keyResults'> = {
      title,
      description,
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
        <h2 className="text-2xl font-bold mb-4">ایجاد هدف جدید</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">عنوان هدف</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="عنوان هدف را وارد کنید"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">توضیحات</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              rows={4}
              placeholder="توضیحات هدف را وارد کنید"
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
              className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-blue-600"
            >
              ایجاد هدف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ObjectiveCreationWizard;
