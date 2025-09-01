"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAdGeneratorStore } from '@/lib/store';
import { AdSubject } from '@/types/ad-spec';
import { Plus, Upload, Wand2, Grid3x3, Move, Maximize2, X } from 'lucide-react';

interface StepProps {
  onComplete: () => void;
}

const placementGrid = [
  { id: 'top-left', label: 'Top Left' },
  { id: 'top-center', label: 'Top Center' },
  { id: 'top-right', label: 'Top Right' },
  { id: 'center-left', label: 'Center Left' },
  { id: 'center-center', label: 'Center' },
  { id: 'center-right', label: 'Center Right' },
  { id: 'bottom-left', label: 'Bottom Left' },
  { id: 'bottom-center', label: 'Bottom Center' },
  { id: 'bottom-right', label: 'Bottom Right' },
];

export function SubjectsStep({ onComplete }: StepProps) {
  const { subjects, updateSubjects } = useAdGeneratorStore();
  const [localSubjects, setLocalSubjects] = useState<AdSubject[]>(subjects);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<AdSubject | null>(null);

  const handleAddSubject = () => {
    const newSubject: AdSubject = {
      id: `subj-${Date.now()}`,
      type: 'generated',
      name: '',
      placement: {
        grid: 'center-center',
        depth: 'foreground',
        offset: { x: 0, y: 0 },
        scalePct: 100,
      },
    };
    setEditingSubject(newSubject);
    setShowModal(true);
  };

  const handleSaveSubject = () => {
    if (!editingSubject) return;
    if (!editingSubject.name.trim()) return; // Require a name

    const existingIndex = localSubjects.findIndex(s => s.id === editingSubject.id);
    if (existingIndex >= 0) {
      // Update existing
      setLocalSubjects(localSubjects.map(s => 
        s.id === editingSubject.id ? editingSubject : s
      ));
    } else {
      // New subject
      setLocalSubjects([...localSubjects, editingSubject]);
    }
    setShowModal(false);
    setEditingSubject(null);
  };

  const handleRemoveSubject = (id: string) => {
    setLocalSubjects(localSubjects.filter(s => s.id !== id));
  };

  const handleContinue = () => {
    updateSubjects(localSubjects);
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Subjects / Concepts</h3>
        <p className="text-sm text-muted-foreground">
          Add subjects to your ad - characters, products, or decorative elements.
        </p>
      </div>

      {/* Subjects List */}
      <div className="space-y-4">
        {localSubjects.map((subject) => (
          <Card key={subject.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{subject.name || 'Unnamed Subject'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {subject.type} • {subject.placement.grid} • {subject.placement.depth}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingSubject(subject);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSubject(subject.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outline"
          onClick={handleAddSubject}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Subject
        </Button>
      </div>

      {/* Subject Edit Modal */}
      {showModal && editingSubject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Configure Subject</h3>
            
            <div className="space-y-4">
              {/* Subject Name */}
              <div>
                <Label>Subject Name/Description</Label>
                <Input
                  className="mt-2"
                  value={editingSubject.name}
                  onChange={(e) => setEditingSubject({
                    ...editingSubject,
                    name: e.target.value,
                  })}
                  placeholder="e.g., Alligator family, Product shot"
                />
              </div>

              {/* Subject Type */}
              <div>
                <Label>Type</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button
                    variant={editingSubject.type === 'generated' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEditingSubject({
                      ...editingSubject,
                      type: 'generated',
                    })}
                  >
                    <Wand2 className="w-4 h-4 mr-1" />
                    Generated
                  </Button>
                  <Button
                    variant={editingSubject.type === 'uploaded' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEditingSubject({
                      ...editingSubject,
                      type: 'uploaded',
                    })}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                  <Button
                    variant={editingSubject.type === 'library' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEditingSubject({
                      ...editingSubject,
                      type: 'library',
                    })}
                  >
                    Library
                  </Button>
                </div>
              </div>

              {/* Placement Grid */}
              <div>
                <Label>Placement</Label>
                <div className="grid grid-cols-3 gap-1 mt-2 p-2 border rounded">
                  {placementGrid.map((pos) => (
                    <Button
                      key={pos.id}
                      variant={editingSubject.placement.grid === pos.id ? 'default' : 'outline'}
                      size="sm"
                      className="h-12"
                      onClick={() => setEditingSubject({
                        ...editingSubject,
                        placement: {
                          ...editingSubject.placement,
                          grid: pos.id,
                        },
                      })}
                    >
                      <Grid3x3 className="w-3 h-3" />
                    </Button>
                  ))}
                </div>
              </div>

              {/* Depth */}
              <div>
                <Label>Depth Layer</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {(['background', 'middle', 'foreground'] as const).map((depth) => (
                    <Button
                      key={depth}
                      variant={editingSubject.placement.depth === depth ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEditingSubject({
                        ...editingSubject,
                        placement: {
                          ...editingSubject.placement,
                          depth,
                        },
                      })}
                    >
                      {depth}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Scale */}
              <div>
                <Label>Scale: {editingSubject.placement.scalePct}%</Label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={editingSubject.placement.scalePct}
                  onChange={(e) => setEditingSubject({
                    ...editingSubject,
                    placement: {
                      ...editingSubject.placement,
                      scalePct: parseInt(e.target.value),
                    },
                  })}
                  className="w-full mt-2"
                />
              </div>

              {/* Offset */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>X Offset: {editingSubject.placement.offset.x}px</Label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={editingSubject.placement.offset.x}
                    onChange={(e) => setEditingSubject({
                      ...editingSubject,
                      placement: {
                        ...editingSubject.placement,
                        offset: {
                          ...editingSubject.placement.offset,
                          x: parseInt(e.target.value),
                        },
                      },
                    })}
                    className="w-full mt-2"
                  />
                </div>
                <div>
                  <Label>Y Offset: {editingSubject.placement.offset.y}px</Label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={editingSubject.placement.offset.y}
                    onChange={(e) => setEditingSubject({
                      ...editingSubject,
                      placement: {
                        ...editingSubject.placement,
                        offset: {
                          ...editingSubject.placement.offset,
                          y: parseInt(e.target.value),
                        },
                      },
                    })}
                    className="w-full mt-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setEditingSubject(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveSubject}>
                Save Subject
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}