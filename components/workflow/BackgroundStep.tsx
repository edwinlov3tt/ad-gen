"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAdGeneratorStore } from '@/lib/store';
import { Loader2, Wand2, Check } from 'lucide-react';

interface StepProps {
  onComplete: () => void;
}

const baseTypes = [
  { id: 'clean', label: 'Clean', description: 'Solid color or gradient' },
  { id: 'gradient', label: 'Gradient', description: 'Smooth color transition' },
  { id: 'pattern', label: 'Pattern', description: 'Repeating elements' },
  { id: 'photo', label: 'Photo', description: 'Photographic background' },
  { id: 'illustrated', label: 'Illustrated', description: 'Hand-drawn style' },
];

const textures = [
  { id: 'grunge', label: 'Grunge' },
  { id: 'diamond-plate', label: 'Diamond Plate' },
  { id: 'tire-tracks', label: 'Tire Tracks' },
  { id: 'paper-grain', label: 'Paper Grain' },
  { id: 'bokeh', label: 'Bokeh' },
  { id: 'noise', label: 'Noise' },
  { id: 'watercolor', label: 'Watercolor' },
  { id: 'halftone', label: 'Halftone' },
];

export function BackgroundStep({ onComplete }: StepProps) {
  const { background, updateBackground, branding } = useAdGeneratorStore();
  const [localBackground, setLocalBackground] = useState(background);
  const [loading, setLoading] = useState(false);
  const [generatedPreviews, setGeneratedPreviews] = useState<string[]>([]);

  const handleTextureToggle = (textureId: string) => {
    const newTextures = localBackground.textures.includes(textureId)
      ? localBackground.textures.filter(t => t !== textureId)
      : [...localBackground.textures, textureId];
    
    setLocalBackground({
      ...localBackground,
      textures: newTextures,
    });
  };

  const handleGenerateBackgrounds = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/backgrounds/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base: localBackground.base,
          textures: localBackground.textures,
          brandBlend: localBackground.brandBlend,
          brandColors: branding.colors,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate backgrounds');
      }
      
      const data = await response.json();
      setGeneratedPreviews(data.previews || []);
      setLocalBackground({
        ...localBackground,
        variants: data.previews || [],
      });
    } catch (err) {
      console.error('Error generating backgrounds:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVariant = (variantUrl: string) => {
    setLocalBackground({
      ...localBackground,
      variants: [variantUrl],
    });
  };

  const handleContinue = () => {
    updateBackground(localBackground);
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Background Generation</h3>
        <p className="text-sm text-muted-foreground">
          Choose a base style and optional textures for your ad backgrounds.
        </p>
      </div>

      {/* Base Type Selection */}
      <div>
        <Label>Background Base</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {baseTypes.map((type) => (
            <Button
              key={type.id}
              variant={localBackground.base === type.id ? 'default' : 'outline'}
              size="sm"
              className="h-auto py-2 px-3"
              onClick={() => setLocalBackground({
                ...localBackground,
                base: type.id as typeof localBackground.base,
              })}
            >
              <div className="text-left">
                <div className="font-medium">{type.label}</div>
                <div className="text-xs opacity-70">{type.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Texture Selection */}
      <div>
        <Label>Texture Overlays (Optional)</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {textures.map((texture) => {
            const isSelected = localBackground.textures.includes(texture.id);
            return (
              <Button
                key={texture.id}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTextureToggle(texture.id)}
              >
                {isSelected && <Check className="w-3 h-3 mr-1" />}
                {texture.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Brand Blend Toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="brand-blend"
          checked={localBackground.brandBlend}
          onChange={(e) => setLocalBackground({
            ...localBackground,
            brandBlend: e.target.checked,
          })}
          className="w-4 h-4"
        />
        <Label htmlFor="brand-blend" className="cursor-pointer">
          Blend with brand colors
          <span className="text-xs text-muted-foreground ml-2">
            (Uses your brand palette for cohesive look)
          </span>
        </Label>
      </div>

      {/* Generate Button */}
      <div>
        <Button 
          onClick={handleGenerateBackgrounds}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Wand2 className="w-4 h-4 mr-2" />
          )}
          Generate 6 Background Previews
        </Button>
      </div>

      {/* Generated Previews */}
      {generatedPreviews.length > 0 && (
        <div>
          <Label>Select a Background</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {generatedPreviews.map((preview, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all ${
                  localBackground.variants[0] === preview
                    ? 'ring-2 ring-primary'
                    : 'hover:border-gray-400'
                }`}
                onClick={() => handleSelectVariant(preview)}
              >
                <CardContent className="p-2">
                  <div className="aspect-video bg-gray-200 rounded overflow-hidden">
                    <img
                      src={preview}
                      alt={`Background preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full hidden items-center justify-center bg-gray-200">
                      <span className="text-xs text-gray-500">Preview {index + 1}</span>
                    </div>
                  </div>
                  {localBackground.variants[0] === preview && (
                    <div className="text-center mt-2">
                      <Check className="w-4 h-4 mx-auto text-primary" />
                      <span className="text-xs text-primary">Selected</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleContinue}
          disabled={localBackground.variants.length === 0 && generatedPreviews.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}