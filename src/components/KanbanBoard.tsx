"use client";

import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core';
import QuadrantColumn from './QuadrantColumn';
import TaskCard from './TaskCard';
import { CreateTaskModal } from './CreateTaskModal';
import { AllocateQuadrantModal } from './AllocateQuadrantModel';
import { Button } from '@/components/ui/button';
import { Task } from '@/types';
import { createTask, updateTaskStatus, completeTask, undoTask, deleteTask } from '@/app/actions/taskActions';
import { Inter, Instrument_Serif } from 'next/font/google';

// 1. Define the props the component will receive
interface KanbanBoardProps {
  initialTasks: Task[];
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400'], // Choose weights you need
  style: ['normal'], // Ensure normal style for consistency
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  weight: ['400'],
  style: ['italic', 'normal'],
});

// 2. Accept the props
function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  // 3. Use the prop to set the initial state, instead of hardcoded data
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // State for the main creation modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // State for the allocation modal
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);

  // State to remember which task we need to allocate
  const [taskToAllocateId, setTaskToAllocateId] = useState<number | null>(null);

  // Track which task is expanded
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  // Droppable component for completed tasks
  const CompletedTasksDropZone = ({ children }: { children: React.ReactNode }) => {
    const { setNodeRef } = useDroppable({
      id: 'completed',
    });

    return (
      <div ref={setNodeRef} className="border p-4 space-y-2 min-h-[100px] bg-gray-50 rounded-lg">
        {children}
      </div>
    );
  };

  // Updated: handleAddTask now uses the server action and opens allocation modal
  const handleAddTask = async (taskData: {
    title: string;
    description: string;
    deadline?: Date;
    delegated_to: string; // Changed from delegatedTo to match the database column name
  }) => {
    try {
      console.log("Submitting task with data:", taskData);
      
      // This calls your backend to create the task in Supabase
      const result = await createTask(taskData);
      
      console.log("Task creation result:", result);

      if (result && 'error' in result) {
        console.error("Failed to create task:", result.error);
        alert(`Failed to create task: ${result.error}`);
        return; // Stop execution
      }
      
      // Close the creation modal
      setIsCreateModalOpen(false);
      
      // Add the new task to state
      if (result) {
        setTasks(prev => [...prev, result as Task]);
        
        // Open allocation modal for the new task
        setTaskToAllocateId(result.id);
        setIsAllocateModalOpen(true);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      // Show an error message to the user
      alert("An unexpected error occurred while creating the task. Please try again.");
    }
  };

  // Handle selecting a quadrant for allocation
  const handleSelectQuadrant = (status: 'q1' | 'q2' | 'q3' | 'q4') => {
    if (taskToAllocateId === null) return;

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskToAllocateId ? { ...task, status } : task
      )
    );

    setIsAllocateModalOpen(false);
    setTaskToAllocateId(null);
  };

  // Mark a task as completed with optimistic update
  const handleCompleteTask = async (currentStatus: string, taskId: number) => {
    // Keep a copy of the original tasks state to restore if there's an error
    const originalTasks = [...tasks];
    
    // 1. Optimistic Update: Update the state locally right away
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: 'completed', last_active_status: currentStatus } : task
      )
    );

    // 2. Backend Update: Call the server action
    const result = await completeTask(taskId, currentStatus);
    
    if (result && 'error' in result) {
      console.error("Failed to complete task:", result.error);
      // Revert the UI change in case of error
      setTasks(originalTasks);
      alert(`Failed to complete task: ${result.error}`);
    } else {
      console.log("Task marked as completed successfully");
    }
  };

  // Undo a completed task with optimistic update
  const handleUndoTask = async (previousStatus: string, taskId: number) => {
    // Keep a copy of the original tasks state to restore if there's an error
    const originalTasks = [...tasks];
    
    // 1. Optimistic Update: Update the state locally right away
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: previousStatus, last_active_status: undefined } : task
      )
    );

    // 2. Backend Update: Call the server action
    const result = await undoTask(taskId, previousStatus);
    
    if (result && 'error' in result) {
      console.error("Failed to undo task completion:", result.error);
      // Revert the UI change in case of error
      setTasks(originalTasks);
      alert(`Failed to undo task: ${result.error}`);
    } else {
      console.log("Task undone successfully");
    }
  };

  // Delete a task with optimistic update
  const handleDeleteTask = async (taskId: number) => {
    // Keep a copy of the original tasks state to restore if there's an error
    const originalTasks = [...tasks];
    
    // 1. Optimistic Update: Remove from local state
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

    // 2. Backend Update: Call the server action
    const result = await deleteTask(taskId);
    
    if (result && 'error' in result) {
      console.error("Failed to delete task:", result.error);
      // Restore the original state
      setTasks(originalTasks);
      alert(`Failed to delete task: ${result.error}`);
    } else {
      console.log("Task deleted successfully");
    }
  };

  // Drag and drop handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = active.id as number;
    const newStatus = over.id as string;
    
    if (newStatus === 'completed') {
      // Find the current task to get its current status
      const currentTask = tasks.find(task => task.id === taskId);
      if (currentTask) {
        handleCompleteTask(currentTask.status, taskId);
      }
      return;
    }

    // Optimistic UI update - update local state immediately
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    // Backend Update: Send the change to the server
    updateTaskStatus(taskId, newStatus)
      .then(() => {
        console.log(`Task ${taskId} status updated to ${newStatus} in database`);
      })
      .catch((error) => {
        console.error("Failed to save drag-and-drop change:", error);
        // Revert the UI change on error
        setTasks((prevTasks) => 
          prevTasks.map((task) => 
            task.id === taskId ? { ...task, status: task.status } : task
          )
        );
        // Show a user-friendly error message
        alert("Failed to update task. Please try again.");
      });
  };

  // Filters
  const unallocatedTasks = tasks.filter(task => task.status === 'unallocated');
  const q1Tasks = tasks.filter(task => task.status === 'q1');
  const q2Tasks = tasks.filter(task => task.status === 'q2');
  const q3Tasks = tasks.filter(task => task.status === 'q3');
  const q4Tasks = tasks.filter(task => task.status === 'q4');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleAddTask}
      />
      <AllocateQuadrantModal
        isOpen={isAllocateModalOpen}
        onClose={() => setIsAllocateModalOpen(false)}
        onSelectQuadrant={handleSelectQuadrant}
      />

      <div className="bg-transparent w-full flex flex-col items-center pt-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-3xl lg:max-w-6xl justify-center">
          {/* Left: Create & Assign Tasks */}
          <div className="flex-1 border border-gray-300 rounded-xl bg-white p-4 shadow-sm flex flex-col min-h-[200px]">
            <div className="flex justify-between items-center mb-4">
              <div className="inline-block rounded-full bg-gray-900 px-3 py-1">
                <h2 className={`${inter.className} text-white text-xs sm:text-sm font-semibold tracking-wide font-sans`}>CREATE & ASSIGN</h2>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)} className="rounded-full w-8 h-8 text-lg font-bold bg-gray-900 text-white hover:bg-gray-700 flex items-center justify-center">+</Button>
            </div>
            <div className="space-y-2 flex-1">
              {unallocatedTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isExpanded={expandedTaskId === task.id}
                  onExpand={() =>
                    setExpandedTaskId(expandedTaskId === task.id ? null : task.id)
                  }
                  onComplete={(currentStatus) => handleCompleteTask(currentStatus, task.id)}
                  onDelete={() => handleDeleteTask(task.id)}
                  onUndo={(previousStatus) => handleUndoTask(previousStatus, task.id)}
                />
              ))}
            </div>
          </div>

          {/* Right: Completed Tasks */}
          <div className="flex-1 border border-gray-300 rounded-xl bg-gradient-to-br from-gray-800 to-gray-600 p-4 shadow-sm flex flex-col min-h-[200px]">
            <div className="inline-block rounded-full bg-gray-100 px-3 py-1 mb-4">
              <h2 className={`${inter.className} text-gray-800 text-xs sm:text-sm font-semibold tracking-wide font-sans`}>COMPLETED</h2>
            </div>
            <CompletedTasksDropZone>
              {completedTasks.length === 0 ? (
                <div className="text-center text-gray-300 py-8">
                  <p className={`${inter.className} text-sm sm:text-base`}>Drag tasks here to complete</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {completedTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isExpanded={expandedTaskId === task.id}
                      onExpand={() =>
                        setExpandedTaskId(expandedTaskId === task.id ? null : task.id)
                      }
                      onComplete={(currentStatus) => {
                        // Task is already complete, nothing to do
                        console.log("Task is already complete");
                      }}
                      onDelete={() => handleDeleteTask(task.id)}
                      onUndo={(previousStatus) => handleUndoTask(previousStatus, task.id)}
                    />
                  ))}
                </div>
              )}
            </CompletedTasksDropZone>
          </div>
        </div>

        {/* Title and Quadrants */}
        <div className="w-full flex flex-col items-center my-8">
          <h1 className={`${instrumentSerif.className} text-3xl sm:text-4xl font-serif italic text-center`}>the4<span className="not-italic">Quadrants</span></h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Q1 */}
          <div className="rounded-xl border border-red-200 bg-red-100 p-4 shadow-sm flex flex-col min-h-[220px]">
            <div className={`${instrumentSerif.className} text-sm sm:text-base text-gray-700 mb-2`}><span className="font-semibold">Tackle these <span className="italic">critical tasks</span> now to manage crises and <span className="italic">meet deadlines</span>.</span></div>
            <QuadrantColumn
              quadrantId="q1"
              bgColor="bg-[#E2442F]"
              tasks={q1Tasks}
              expandedTaskId={expandedTaskId}
              setExpandedTaskId={setExpandedTaskId}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
              onUndo={handleUndoTask}
            />
          </div>
          {/* Q2 */}
          <div className="rounded-xl border border-green-200 bg-green-100 p-4 shadow-sm flex flex-col min-h-[220px]">
            <div className={`${instrumentSerif.className} text-sm sm:text-base text-gray-700 mb-2`}><span className="font-semibold">Invest your time here to <span className="italic">plan, strategize, and achieve long-term growth</span>.</span></div>
            <QuadrantColumn
              quadrantId="q2"
              bgColor="bg-[#17AD21]"
              tasks={q2Tasks}
              expandedTaskId={expandedTaskId}
              setExpandedTaskId={setExpandedTaskId}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
              onUndo={handleUndoTask}
            />
          </div>
          {/* Q3 */}
          <div className="rounded-xl border border-yellow-200 bg-yellow-100 p-4 shadow-sm flex flex-col min-h-[220px]">
            <div className={`${instrumentSerif.className} text-sm text-gray-700 mb-2`}><span className="font-semibold">Minimize or <span className="italic">delegate</span> these interruptions to protect your valuable focus.</span></div>
            <QuadrantColumn
              quadrantId="q3"
              bgColor="bg-[#F4F401]"
              tasks={q3Tasks}
              expandedTaskId={expandedTaskId}
              setExpandedTaskId={setExpandedTaskId}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
              onUndo={handleUndoTask}
            />
          </div>
          {/* Q4 */}
          <div className="rounded-xl border border-gray-300 bg-gray-100 p-4 shadow-sm flex flex-col min-h-[220px]">
            <div className={`${instrumentSerif.className} text-sm text-gray-700 mb-2`}><span className="font-semibold">Limit these <span className="italic">low-value activities</span> to reclaim your time for what truly matters.</span></div>
            <QuadrantColumn
              quadrantId="q4"
              bgColor="bg-[#797979]"
              tasks={q4Tasks}
              expandedTaskId={expandedTaskId}
              setExpandedTaskId={setExpandedTaskId}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
              onUndo={handleUndoTask}
            />
          </div>
        </div>
      </div>
    </DndContext>
  );
}

export default KanbanBoard;