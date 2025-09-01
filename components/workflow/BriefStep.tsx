"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdGeneratorStore } from '@/lib/store';

interface StepProps {
  onComplete: () => void;
}

export function BriefStep({ onComplete }: StepProps) {
  const { brief, updateBrief } = useAdGeneratorStore();
  const [localBrief, setLocalBrief] = useState(brief);

  const handleContinue = () => {
    updateBrief(localBrief);
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Campaign Brief</h3>
        <p className="text-sm text-muted-foreground">
          Define your campaign objectives and target audience. This information will guide the creative generation.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="objective">Campaign Objective</Label>
          <Select
            value={localBrief.objective}
            onValueChange={(value: 'awareness' | 'leads' | 'sales') =>
              setLocalBrief({ ...localBrief, objective: value })
            }
          >
            <SelectTrigger id="objective" className="mt-2">
              <SelectValue placeholder="Select objective" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="awareness">Brand Awareness</SelectItem>
              <SelectItem value="leads">Lead Generation</SelectItem>
              <SelectItem value="sales">Direct Sales</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="audience">Target Audience</Label>
          <Input
            id="audience"
            className="mt-2"
            placeholder="e.g., Families in Florida, Young professionals, Senior citizens"
            value={localBrief.audience}
            onChange={(e) =>
              setLocalBrief({ ...localBrief, audience: e.target.value })
            }
          />
          <p className="text-xs text-muted-foreground mt-1">
            Describe your target audience demographics and interests
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleContinue}
          disabled={!localBrief.objective || !localBrief.audience}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}