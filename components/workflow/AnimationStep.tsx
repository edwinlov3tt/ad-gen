"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAdGeneratorStore } from '@/lib/store';
import { AnimationFrame } from '@/types/ad-spec';
import { Plus, Play, Pause, RotateCw, Film, X } from 'lucide-react';

interface StepProps {
  onComplete: () => void;
}

export function AnimationStep({ onComplete }: StepProps) {
  const { animation, updateAnimation, background, subjects, copy } = useAdGeneratorStore();
  const [enabled, setEnabled] = useState(animation?.enabled || false);
  const [frames, setFrames] = useState<AnimationFrame[]>(animation?.frames || []);
  const [loop, setLoop] = useState(animation?.loop ?? true);
  const [transition, setTransition] = useState(animation?.transition || 'fade');

  const handleAddFrame = () => {
    const newFrame: AnimationFrame = {
      bg: background.variants[0] || '',
      subjects: subjects.slice(0, 1).map(s => s.id),
      copy: {
        headline: copy.headlines[0] || '',
        subhead: copy.subheads[0] || '',
        cta: '',
      },
      durationMs: 1500,
    };
    setFrames([...frames, newFrame]);
  };

  const handleRemoveFrame = (index: number) => {
    setFrames(frames.filter((_, i) => i !== index));
  };

  const handleUpdateFrame = (index: number, frame: AnimationFrame) => {
    const newFrames = [...frames];
    newFrames[index] = frame;
    setFrames(newFrames);
  };

  const handleContinue = () => {
    updateAnimation({
      enabled,
      frames,
      loop,
      transition: transition as 'fade' | 'slide' | 'none',
    });
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Animation (Optional)</h3>
        <p className="text-sm text-muted-foreground">
          Create animated banners with multiple frames and transitions.
        </p>
      </div>

      {/* Enable Animation Toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="enable-animation"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="w-4 h-4"
        />
        <Label htmlFor="enable-animation" className="cursor-pointer">
          Enable Animated Banner
        </Label>
      </div>

      {enabled && (
        <>
          {/* Animation Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Transition Type</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {(['fade', 'slide', 'none'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={transition === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTransition(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label>Loop Animation</Label>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  id="loop"
                  checked={loop}
                  onChange={(e) => setLoop(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="loop" className="cursor-pointer">
                  <RotateCw className="w-4 h-4 inline mr-1" />
                  Loop continuously
                </Label>
              </div>
            </div>
          </div>

          {/* Storyboard Frames */}
          <div>
            <Label>Storyboard Frames</Label>
            <div className="space-y-3 mt-2">
              {frames.map((frame, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Film className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Frame {index + 1}</span>
                        <span className="text-sm text-muted-foreground">
                          ({frame.durationMs}ms)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFrame(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Copy</Label>
                        <div className="text-sm mt-1 space-y-1">
                          <div>H: {frame.copy.headline || 'No headline'}</div>
                          <div>S: {frame.copy.subhead || 'No subhead'}</div>
                          <div>CTA: {frame.copy.cta || 'No CTA'}</div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Duration (ms)</Label>
                        <input
                          type="number"
                          value={frame.durationMs}
                          onChange={(e) => handleUpdateFrame(index, {
                            ...frame,
                            durationMs: parseInt(e.target.value) || 1000,
                          })}
                          className="w-full mt-1 px-2 py-1 border rounded text-sm"
                          min="500"
                          max="5000"
                          step="100"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button
                variant="outline"
                onClick={handleAddFrame}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Frame
              </Button>
            </div>
          </div>

          {/* Animation Templates */}
          <div>
            <Label>Quick Templates</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Two-step CTA template
                  setFrames([
                    {
                      bg: background.variants[0] || '',
                      subjects: subjects.map(s => s.id),
                      copy: {
                        headline: copy.headlines[0] || '',
                        subhead: copy.subheads[0] || '',
                      },
                      durationMs: 2000,
                    },
                    {
                      bg: background.variants[0] || '',
                      subjects: subjects.map(s => s.id),
                      copy: {
                        headline: copy.headlines[0] || '',
                        cta: copy.ctas[0] || '',
                      },
                      durationMs: 2000,
                    },
                  ]);
                }}
              >
                Two-step CTA
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Before/After template
                  setFrames([
                    {
                      bg: background.variants[0] || '',
                      subjects: [],
                      copy: {
                        headline: 'Before',
                      },
                      durationMs: 1500,
                    },
                    {
                      bg: background.variants[0] || '',
                      subjects: subjects.map(s => s.id),
                      copy: {
                        headline: 'After',
                        cta: copy.ctas[0] || '',
                      },
                      durationMs: 2500,
                    },
                  ]);
                }}
              >
                Before/After
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Narrative template
                  setFrames([
                    {
                      bg: background.variants[0] || '',
                      subjects: [],
                      copy: {
                        headline: copy.headlines[0] || '',
                      },
                      durationMs: 1200,
                    },
                    {
                      bg: background.variants[0] || '',
                      subjects: subjects.slice(0, 1).map(s => s.id),
                      copy: {
                        subhead: copy.subheads[0] || '',
                      },
                      durationMs: 1200,
                    },
                    {
                      bg: background.variants[0] || '',
                      subjects: subjects.map(s => s.id),
                      copy: {
                        cta: copy.ctas[0] || '',
                      },
                      durationMs: 1600,
                    },
                  ]);
                }}
              >
                Narrative
              </Button>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end">
        <Button onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}