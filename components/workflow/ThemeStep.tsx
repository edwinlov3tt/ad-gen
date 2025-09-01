"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAdGeneratorStore } from '@/lib/store';
import { Check, Sparkles, Briefcase, Zap, Palette, Clock } from 'lucide-react';

interface StepProps {
  onComplete: () => void;
}

const themes = [
  {
    id: 'playful',
    name: 'Playful',
    description: 'Fun, energetic, vibrant colors',
    icon: Sparkles,
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
    style: ['cartoon', 'illustration'],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Elegant, sophisticated, luxury',
    icon: Briefcase,
    colors: ['#2C3E50', '#E67E22', '#ECF0F1'],
    style: ['photo', 'minimal'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, simple, focused',
    icon: Clock,
    colors: ['#000000', '#FFFFFF', '#E0E0E0'],
    style: ['minimal', 'geometric'],
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Strong, impactful, high contrast',
    icon: Zap,
    colors: ['#FF0000', '#000000', '#FFFF00'],
    style: ['bold', 'dynamic'],
  },
  {
    id: 'retro',
    name: 'Retro',
    description: 'Vintage, nostalgic, classic',
    icon: Palette,
    colors: ['#FF6B35', '#F7931E', '#FDC830'],
    style: ['retro', 'vintage'],
  },
];

export function ThemeStep({ onComplete }: StepProps) {
  const { brief, updateBrief } = useAdGeneratorStore();
  const [selectedThemes, setSelectedThemes] = useState<string[]>(brief.theme || []);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(brief.style || []);

  const handleThemeToggle = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    let newSelectedThemes: string[];
    let newSelectedStyles: string[];

    if (selectedThemes.includes(themeId)) {
      // Remove theme
      newSelectedThemes = selectedThemes.filter(id => id !== themeId);
      // Remove associated styles
      newSelectedStyles = selectedStyles.filter(s => !theme.style.includes(s));
    } else {
      // Add theme
      newSelectedThemes = [...selectedThemes, themeId];
      // Add associated styles (avoiding duplicates)
      newSelectedStyles = [...new Set([...selectedStyles, ...theme.style])];
    }

    setSelectedThemes(newSelectedThemes);
    setSelectedStyles(newSelectedStyles);
  };

  const handleContinue = () => {
    updateBrief({
      ...brief,
      theme: selectedThemes,
      style: selectedStyles,
    });
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Theme & Style</h3>
        <p className="text-sm text-muted-foreground">
          Select one or more visual themes. These will guide the overall aesthetic of your ads.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => {
          const Icon = theme.icon;
          const isSelected = selectedThemes.includes(theme.id);
          
          return (
            <Card
              key={theme.id}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary ring-2 ring-primary ring-opacity-20'
                  : 'hover:border-gray-400'
              }`}
              onClick={() => handleThemeToggle(theme.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <Icon className="w-8 h-8 text-primary" />
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                <h4 className="font-medium mb-1">{theme.name}</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  {theme.description}
                </p>
                
                {/* Color preview */}
                <div className="flex gap-1 mb-2">
                  {theme.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                
                {/* Style tags */}
                <div className="flex flex-wrap gap-1">
                  {theme.style.map((style) => (
                    <span
                      key={style}
                      className="text-xs px-2 py-1 bg-gray-100 rounded"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedThemes.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium mb-2">Selected themes:</p>
          <div className="flex flex-wrap gap-2">
            {selectedThemes.map((themeId) => {
              const theme = themes.find(t => t.id === themeId);
              return theme ? (
                <span key={themeId} className="text-sm px-3 py-1 bg-white border rounded-full">
                  {theme.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleContinue}
          disabled={selectedThemes.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}