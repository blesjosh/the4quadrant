"use client";

import React from 'react';
import { useDraggable } from '@dnd-kit/core'; // Import the hook
import { Task } from '@/types';
import { format } from 'date-fns';
import { Calendar, User, CheckCircle2, Trash2, Undo2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react'; // Import new icons
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
});

interface TaskCardProps {
  task: Task;
  isExpanded: boolean;
  onExpand: () => void;
  // We now need functions for complete, delete, and undo
  onComplete: (currentStatus: string) => void;
  onDelete: () => void;
  onUndo: (previousStatus: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isExpanded, onExpand, onComplete, onDelete, onUndo }) => {
  // --- START OF THE FIX ---

  // 1. Use the useDraggable hook
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id, // Give the draggable a unique ID, which is our task's ID
  });

  // 2. Create a style object to make the card move visually while dragging
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  // --- END OF THE FIX ---

  const isCompleted = task.status === 'completed';

  return (
    // 3. Apply the props from the hook to your main div, with position relative for z-index context
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white p-3 rounded-md shadow group relative ${inter.className}`} // Added relative positioning
    >
      <div className="flex justify-between items-start gap-2">
        {/* Drag handle and title area */}
        <div className="flex items-start gap-2 flex-1">
          {/* Dedicated drag handle */}
          <div 
            {...listeners}
            {...attributes}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-1 flex-shrink-0"
            title="Drag to move task"
          >
            <GripVertical size={16} />
          </div>
          
          {/* Title - no longer draggable */}
          <p className={`font-semibold flex-1 ${isCompleted ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </p>
        </div>
        
        {/* Action Buttons - completely separate from drag area */}
        <div className="flex items-center gap-2 flex-shrink-0 relative z-10">
          {/* Add expand/collapse button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onExpand();
            }}
            className="text-gray-400 hover:text-gray-600"
            title={isExpanded ? "Collapse" : "Expand"}
            type="button"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {!isCompleted && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onComplete(task.status);
              }}
              className="text-gray-300 hover:text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Mark as complete"
              type="button"
            >
              <CheckCircle2 size={20} />
            </button>
          )}

          {isCompleted && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onUndo(task.last_active_status || 'unallocated');
              }}
              className="text-gray-400 hover:text-blue-500"
              title="Undo"
              type="button"
            >
              <Undo2 size={20} />
            </button>
          )}
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete task"
            type="button"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2 pt-2 border-t text-sm text-gray-600 space-y-2">
          {task.description && <p className={isCompleted ? 'text-gray-400' : ''}>{task.description}</p>}
          {task.deadline && (
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span className={isCompleted ? 'text-gray-400' : ''}>{format(new Date(task.deadline), 'MMM d, yyyy')}</span>
            </div>
          )}
          {task.delegated_to && (
            <div className="flex items-center gap-2">
              <User size={14} />
              <span className={isCompleted ? 'text-gray-400' : ''}>Delegated to: {task.delegated_to}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;