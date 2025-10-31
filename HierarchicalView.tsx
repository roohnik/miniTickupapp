import React from 'react';
import { Objective, User, HierarchicalViewStyle } from './types';

interface HierarchicalViewProps {
  objectives: Objective[];
  users: User[];
  onSelectObjective: (objective: Objective) => void;
  hierarchicalViewStyle: HierarchicalViewStyle;
  onEditObjective: (objective: Objective) => void;
  onArchiveObjective: (objectiveId: string) => void;
  onDeleteObjective: (objectiveId: string) => void;
}

const HierarchicalView: React.FC<HierarchicalViewProps> = ({ objectives, users, onSelectObjective }) => {
  const visibleObjectives = objectives.filter(o => !o.isArchived);

  return (
    <div className="p-8 bg-gray-50/70 rounded-lg">
      <div className="space-y-4">
        {visibleObjectives.map(objective => (
          <div 
            key={objective.id}
            onClick={() => onSelectObjective(objective)}
            className="p-4 bg-white rounded-lg border shadow-sm cursor-pointer hover:bg-gray-50"
          >
            <p className="font-semibold">{objective.title}</p>
            <p className="text-sm text-gray-600 mt-1">{objective.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HierarchicalView;
