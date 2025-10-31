import React from 'react';
import { Objective, User } from './types';

interface ProgramViewProps {
  objectives: Objective[];
  users: User[];
  onSelectObjective: (objective: Objective) => void;
}

const ProgramView: React.FC<ProgramViewProps> = ({ objectives, onSelectObjective }) => {
  return (
    <div className="p-8 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Program View</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {objectives.map(objective => (
          <div
            key={objective.id}
            onClick={() => onSelectObjective(objective)}
            className="p-4 bg-white rounded-lg border cursor-pointer hover:border-blue-400"
          >
            <h4 className="font-semibold">{objective.title}</h4>
            <p className="text-sm text-gray-600 mt-2">{objective.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramView;
