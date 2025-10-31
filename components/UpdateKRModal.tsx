import React, { useState } from 'react';
import { KeyResult, Objective } from '../types';

interface UpdateKRModalProps {
  isOpen: boolean;
  onClose: () => void;
  kr: KeyResult;
  onSubmit: (data: any) => void;
  challengeTags: any[];
  objectives: Objective[];
}

const UpdateKRModal: React.FC<UpdateKRModalProps> = ({
  isOpen,
  onClose,
  kr,
  onSubmit,
}) => {
  const [value, setValue] = useState(kr.currentValue || kr.startValue || 0);
  const [rating, setRating] = useState(3);
  const [report, setReport] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      objectiveId: kr.objectiveId || '',
      krId: kr.id,
      value,
      rating,
      report: { text: report },
      challengeDifficulty: 0,
      challengeTagIds: [],
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold mb-4">به‌روزرسانی نتیجه کلیدی</h2>
        <p className="text-gray-600 mb-4">{kr.title}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              مقدار جدید ({kr.type === 'PERCENTAGE' ? '%' : kr.type === 'CURRENCY' ? 'تومان' : ''})
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ارزیابی پیشرفت</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRating(r)}
                  className={`px-4 py-2 rounded-lg ${
                    rating === r ? 'bg-brand-primary text-white' : 'bg-gray-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">گزارش</label>
            <textarea
              value={report}
              onChange={(e) => setReport(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              rows={4}
              placeholder="توضیحات پیشرفت را بنویسید..."
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
              ثبت به‌روزرسانی
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateKRModal;
