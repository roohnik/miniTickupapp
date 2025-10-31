import React from 'react';

interface DueDateSelectorProps {
  value?: string;
  onChange: (date: string) => void;
}

const DueDateSelector: React.FC<DueDateSelectorProps> = ({ value, onChange }) => {
  return (
    <input
      type="date"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg"
    />
  );
};

export default DueDateSelector;
