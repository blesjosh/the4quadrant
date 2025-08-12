"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

// Update the shape of the data the form will output
interface TaskData {
  title: string;
  description: string;
  deadline?: Date; // Deadline is optional
  delegated_to: string; // Changed from delegatedTo to match the database column
}

// Update the props the modal will accept
interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskData) => void;
}

export function CreateTaskModal({ isOpen, onClose, onSubmit }: CreateTaskModalProps) {
  // Add new state variables for the new fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<Date>();
  const [isDelegated, setIsDelegated] = useState(false);
  const [delegated_to, setDelegatedTo] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    onSubmit({ title, description, deadline, delegated_to: isDelegated ? delegated_to : '' });

    // Reset all fields after submission
    setTitle('');
    setDescription('');
    setDeadline(undefined);
    setIsDelegated(false);
    setDelegatedTo('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="">
            <DialogTitle className="text-black text-base font-semibold tracking-wide">CREATE & ASSIGN TASKS</DialogTitle>
          </div>
          <DialogDescription>
            Add the details for your new task. Click add when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Task Title (no change) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Task</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          {/* Description (no change) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          {/* NEW: Deadline Picker */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deadline" className="text-right">Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className="col-span-3 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          {/* NEW: Delegate Switch and Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="delegate" className="text-right">Delegate?</Label>
            <Switch id="delegate" checked={isDelegated} onCheckedChange={setIsDelegated} />
          </div>
          {isDelegated && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="delegated_to" className="text-right">To</Label>
              <Input id="delegated_to" value={delegated_to} onChange={(e) => setDelegatedTo(e.target.value)} placeholder="Delegate to..." className="col-span-3" />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}