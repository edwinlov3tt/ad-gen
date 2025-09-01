"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { useAdGeneratorStore } from '@/lib/store';
import { Check } from 'lucide-react';

interface StepProps {
  onComplete: () => void;
}

const presets = [
  {
    id: 'display',
    name: 'Display Ads',
    sizes: ['300x250', '300x600', '728x90', '160x600', '970x250'],
    description: 'Standard display banner sizes',
  },
  {
    id: 'social-feed',
    name: 'Social Ad',
    sizes: ['1080x1080', '1080x1920'],
    description: 'Instagram & Facebook feed posts',
  },
  {
    id: 'social-stories',
    name: 'Social Stories',
    sizes: ['1080x1920'],
    description: 'Instagram & Facebook stories',
  },
  {
    id: 'social-landscape',
    name: 'Social Landscape',
    sizes: ['1200x628'],
    description: 'Facebook link posts & Twitter cards',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    sizes: ['1280x720'],
    description: 'YouTube thumbnail',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    sizes: ['1000x1500'],
    description: 'Pinterest pins',
  },
];

export function PlacementStep({ onComplete }: StepProps) {
  const { sizes, updateSizes } = useAdGeneratorStore();
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);

  const handlePresetToggle = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;

    let newSelectedPresets: string[];
    let newSizes: string[];

    if (selectedPresets.includes(presetId)) {
      // Remove preset
      newSelectedPresets = selectedPresets.filter(id => id !== presetId);
      // Remove sizes from this preset
      newSizes = sizes.filter(size => !preset.sizes.includes(size));
    } else {
      // Add preset
      newSelectedPresets = [...selectedPresets, presetId];
      // Add sizes from this preset (avoiding duplicates)
      newSizes = [...new Set([...sizes, ...preset.sizes])];
    }

    setSelectedPresets(newSelectedPresets);
    updateSizes(newSizes);
  };

  const handleContinue = () => {
    if (sizes.length > 0) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Ad Placements</h3>
        <p className="text-sm text-muted-foreground">
          Choose one or more placement presets. Each includes optimized sizes for the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {presets.map((preset) => {
          const isSelected = selectedPresets.includes(preset.id);
          return (
            <Card
              key={preset.id}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary ring-2 ring-primary ring-opacity-20'
                  : 'hover:border-gray-400'
              }`}
              onClick={() => handlePresetToggle(preset.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{preset.name}</h4>
                    <CardDescription className="text-xs mb-2">
                      {preset.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-1">
                      {preset.sizes.map((size) => (
                        <span
                          key={size}
                          className="text-xs px-2 py-1 bg-gray-100 rounded"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="ml-2">
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sizes.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium mb-2">Selected sizes ({sizes.length}):</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <span key={size} className="text-sm px-2 py-1 bg-white border rounded">
                {size}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleContinue}
          disabled={sizes.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}