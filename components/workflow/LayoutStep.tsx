"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAdGeneratorStore } from '@/lib/store';
import { AlignLeft, AlignCenter, AlignRight, LayoutGrid } from 'lucide-react';

interface StepProps {
  onComplete: () => void;
}

const layoutTemplates = [
  {
    id: 'text-left',
    name: 'Text Left',
    icon: AlignLeft,
    description: 'Content aligned to the left',
  },
  {
    id: 'text-top',
    name: 'Text Top',
    icon: AlignCenter,
    description: 'Content at the top',
  },
  {
    id: 'centered',
    name: 'Centered',
    icon: AlignCenter,
    description: 'Everything centered',
  },
  {
    id: 'poster',
    name: 'Poster',
    icon: LayoutGrid,
    description: 'Poster-style layout',
  },
];

export function LayoutStep({ onComplete }: StepProps) {
  const { layout, updateLayout } = useAdGeneratorStore();
  const [selectedLayout, setSelectedLayout] = useState(layout);

  const handleContinue = () => {
    updateLayout(selectedLayout);
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Layout Templates</h3>
        <p className="text-sm text-muted-foreground">
          Choose how text and visual elements are arranged in your ads.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {layoutTemplates.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedLayout === template.id;
          
          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary ring-2 ring-primary ring-opacity-20'
                  : 'hover:border-gray-400'
              }`}
              onClick={() => setSelectedLayout(template.id as typeof layout)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className={`mb-3 p-3 rounded-lg ${
                    isSelected ? 'bg-primary/10' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-8 h-8 ${
                      isSelected ? 'text-primary' : 'text-gray-600'
                    }`} />
                  </div>
                  <h4 className="font-medium text-sm mb-1">{template.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Layout Preview */}
      <div className="p-6 border rounded-lg bg-gray-50">
        <Label className="mb-3 block">Layout Preview</Label>
        <div className="aspect-video bg-white border rounded flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">Preview</div>
            <div className="text-xs text-gray-400">
              Layout: {layoutTemplates.find(t => t.id === selectedLayout)?.name}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}