import React from 'react';

interface ObjectiveCreateMenuProps {
  onCreateBasic: () => void;
  onCreateSmart: () => void;
  onClose: () => void;
}

const ObjectiveCreateMenu: React.FC<ObjectiveCreateMenuProps> = ({ onCreateBasic, onCreateSmart, onClose }) => {
  return (
    <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg p-2 z-50 min-w-[200px]" dir="rtl">
      <button
        onClick={() => { onCreateBasic(); onClose(); }}
        className="w-full text-right px-4 py-2 hover:bg-gray-100 rounded-lg"
      >
        ایجاد هدف معمولی
      </button>
      <button
        onClick={() => { onCreateSmart(); onClose(); }}
        className="w-full text-right px-4 py-2 hover:bg-gray-100 rounded-lg"
      >
        ایجاد هدف هوشمند
      </button>
    </div>
  );
};

export default ObjectiveCreateMenu;
