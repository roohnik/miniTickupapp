import React, { useState } from 'react';

interface ExportFormatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string) => void;
}

const ExportFormatModal: React.FC<ExportFormatModalProps> = ({ isOpen, onClose, onExport }) => {
  const [selectedFormat, setSelectedFormat] = useState('png');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <h2 className="text-xl font-bold mb-4">انتخاب فرمت خروجی</h2>
        
        <div className="space-y-2 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="png"
              checked={selectedFormat === 'png'}
              onChange={(e) => setSelectedFormat(e.target.value)}
            />
            <span>PNG</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="pdf"
              checked={selectedFormat === 'pdf'}
              onChange={(e) => setSelectedFormat(e.target.value)}
            />
            <span>PDF</span>
          </label>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            انصراف
          </button>
          <button
            onClick={() => {
              onExport(selectedFormat);
              onClose();
            }}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-blue-600"
          >
            خروجی
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportFormatModal;
