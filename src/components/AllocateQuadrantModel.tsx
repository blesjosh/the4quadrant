"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AllocateQuadrantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuadrant: (status: 'q1' | 'q2' | 'q3' | 'q4') => void;
}

export function AllocateQuadrantModal({ isOpen, onClose, onSelectQuadrant }: AllocateQuadrantModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Allocate to Quadrant</DialogTitle>
        </DialogHeader>
        <div className="flex justify-around p-4">
          <Button onClick={() => onSelectQuadrant('q1')} className="bg-red-500 hover:bg-red-600 w-16 h-16">Q1</Button>
          <Button onClick={() => onSelectQuadrant('q2')} className="bg-green-500 hover:bg-green-600 w-16 h-16">Q2</Button>
          <Button onClick={() => onSelectQuadrant('q3')} className="bg-yellow-500 hover:bg-yellow-600 w-16 h-16">Q3</Button>
          <Button onClick={() => onSelectQuadrant('q4')} className="bg-gray-500 hover:bg-gray-600 w-16 h-16">Q4</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}