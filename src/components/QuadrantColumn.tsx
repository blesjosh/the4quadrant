import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import { Task } from '@/types';


// 1. Add quadrantId to the interface
interface QuadrantColumnProps {
  quadrantId: 'q1' | 'q2' | 'q3' | 'q4'; // Be specific about the possible values
  bgColor: string;
  tasks: Task[];
  expandedTaskId: number | null;
  setExpandedTaskId: React.Dispatch<React.SetStateAction<number | null>>;
  onComplete: (currentStatus: string, taskId: number) => void;
  onDelete: (taskId: number) => void;
  onUndo: (previousStatus: string, taskId: number) => void;
}

const QuadrantColumn: React.FC<QuadrantColumnProps> = ({
  quadrantId, // 2. Receive the prop here
  bgColor,
  tasks,
  expandedTaskId,
  setExpandedTaskId,
  onComplete,
  onDelete,
  onUndo,
}) => {
  const { setNodeRef } = useDroppable({
    id: quadrantId, // Use the prop here
  });

  const combinedClasses = `h-auto min-h-[16rem] rounded-lg p-4 ${bgColor}`;

  return (
    <div ref={setNodeRef} className={combinedClasses}>
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            isExpanded={expandedTaskId === task.id}
            onExpand={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
            onComplete={(currentStatus) => onComplete(currentStatus, task.id)}
            onDelete={() => onDelete(task.id)}
            onUndo={(previousStatus) => onUndo(previousStatus, task.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuadrantColumn;