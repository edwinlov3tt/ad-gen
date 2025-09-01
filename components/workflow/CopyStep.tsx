"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdGeneratorStore } from '@/lib/store';
import { Loader2, Wand2, Plus, X } from 'lucide-react';

interface StepProps {
  onComplete: () => void;
}

export function CopyStep({ onComplete }: StepProps) {
  const { copy, updateCopy, brief } = useAdGeneratorStore();
  const [localCopy, setLocalCopy] = useState(copy);
  const [loading, setLoading] = useState(false);

  const handleGenerateCopy = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/copy/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate copy');
      }
      
      const data = await response.json();
      setLocalCopy({
        headlines: data.headlines || [],
        subheads: data.subheads || [],
        ctas: data.ctas || [],
        phone: data.phone || localCopy.phone || '',
        url: data.url || localCopy.url || '',
        disclaimer: data.disclaimer || localCopy.disclaimer || '',
      });
    } catch (err) {
      console.error('Error generating copy:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHeadline = () => {
    setLocalCopy({
      ...localCopy,
      headlines: [...localCopy.headlines, ''],
    });
  };

  const handleHeadlineChange = (index: number, value: string) => {
    const newHeadlines = [...localCopy.headlines];
    newHeadlines[index] = value;
    setLocalCopy({ ...localCopy, headlines: newHeadlines });
  };

  const handleRemoveHeadline = (index: number) => {
    setLocalCopy({
      ...localCopy,
      headlines: localCopy.headlines.filter((_, i) => i !== index),
    });
  };

  const handleAddSubhead = () => {
    setLocalCopy({
      ...localCopy,
      subheads: [...localCopy.subheads, ''],
    });
  };

  const handleSubheadChange = (index: number, value: string) => {
    const newSubheads = [...localCopy.subheads];
    newSubheads[index] = value;
    setLocalCopy({ ...localCopy, subheads: newSubheads });
  };

  const handleRemoveSubhead = (index: number) => {
    setLocalCopy({
      ...localCopy,
      subheads: localCopy.subheads.filter((_, i) => i !== index),
    });
  };

  const handleAddCTA = () => {
    setLocalCopy({
      ...localCopy,
      ctas: [...localCopy.ctas, ''],
    });
  };

  const handleCTAChange = (index: number, value: string) => {
    const newCTAs = [...localCopy.ctas];
    newCTAs[index] = value;
    setLocalCopy({ ...localCopy, ctas: newCTAs });
  };

  const handleRemoveCTA = (index: number) => {
    setLocalCopy({
      ...localCopy,
      ctas: localCopy.ctas.filter((_, i) => i !== index),
    });
  };

  const handleContinue = () => {
    updateCopy(localCopy);
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Copy & CTAs</h3>
        <p className="text-sm text-muted-foreground">
          Generate AI-powered copy or write your own. Add multiple variants for A/B testing.
        </p>
      </div>

      {/* Generate Copy Button */}
      <div>
        <Button 
          onClick={handleGenerateCopy}
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Wand2 className="w-4 h-4 mr-2" />
          )}
          Generate AI Copy
        </Button>
      </div>

      <div className="space-y-4">
        {/* Headlines */}
        <div>
          <Label>Headlines</Label>
          <div className="space-y-2 mt-2">
            {localCopy.headlines.map((headline, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={headline}
                  onChange={(e) => handleHeadlineChange(index, e.target.value)}
                  placeholder="Enter headline"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveHeadline(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddHeadline}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Headline
            </Button>
          </div>
        </div>

        {/* Subheads */}
        <div>
          <Label>Subheads</Label>
          <div className="space-y-2 mt-2">
            {localCopy.subheads.map((subhead, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={subhead}
                  onChange={(e) => handleSubheadChange(index, e.target.value)}
                  placeholder="Enter subhead"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveSubhead(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddSubhead}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Subhead
            </Button>
          </div>
        </div>

        {/* CTAs */}
        <div>
          <Label>Call-to-Actions</Label>
          <div className="space-y-2 mt-2">
            {localCopy.ctas.map((cta, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={cta}
                  onChange={(e) => handleCTAChange(index, e.target.value)}
                  placeholder="Enter CTA"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCTA(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddCTA}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add CTA
            </Button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              className="mt-2"
              value={localCopy.phone || ''}
              onChange={(e) => setLocalCopy({ ...localCopy, phone: e.target.value })}
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              className="mt-2"
              value={localCopy.url || ''}
              onChange={(e) => setLocalCopy({ ...localCopy, url: e.target.value })}
              placeholder="example.com"
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div>
          <Label htmlFor="disclaimer">Legal Disclaimer</Label>
          <Input
            id="disclaimer"
            className="mt-2"
            value={localCopy.disclaimer || ''}
            onChange={(e) => setLocalCopy({ ...localCopy, disclaimer: e.target.value })}
            placeholder="Terms and conditions apply. See website for details."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleContinue}
          disabled={localCopy.headlines.length === 0 || localCopy.ctas.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}