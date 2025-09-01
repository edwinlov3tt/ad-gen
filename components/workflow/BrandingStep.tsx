"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdGeneratorStore } from '@/lib/store';
import { Loader2, Upload, Download, ExternalLink, Check } from 'lucide-react';

interface StepProps {
  onComplete: () => void;
}

export function BrandingStep({ onComplete }: StepProps) {
  const { branding, brandUrl, updateBranding, setBrandUrl } = useAdGeneratorStore();
  const [localBranding, setLocalBranding] = useState(branding);
  const [localBrandUrl, setLocalBrandUrl] = useState(brandUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBrandAnalyze = async () => {
    if (!localBrandUrl) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/brand/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: localBrandUrl }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze brand');
      }
      
      const data = await response.json();
      setLocalBranding({
        ...localBranding,
        colors: data.colors || [],
        fonts: data.fonts || [],
        logo: data.logoUrl || data.logo || '',
        logoUrl: data.logoUrl || '',
        logoConfidence: data.logoConfidence || 0,
        screenshot: data.screenshot || '',
        ogImage: data.ogImage || '',
        favicon: data.favicon || '',
        social: data.social || {},
        context: data.context || {},
        brandImages: [
          ...(data.screenshot ? [data.screenshot] : []),
          ...(data.logoUrl ? [data.logoUrl] : []),
          ...(data.ogImage ? [data.ogImage] : []),
          ...(data.favicon ? [data.favicon] : [])
        ].filter(Boolean)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze brand');
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...localBranding.colors];
    newColors[index] = value;
    setLocalBranding({ ...localBranding, colors: newColors });
  };

  const handleAddColor = () => {
    setLocalBranding({
      ...localBranding,
      colors: [...localBranding.colors, '#000000'],
    });
  };

  const handleRemoveColor = (index: number) => {
    const newColors = localBranding.colors.filter((_, i) => i !== index);
    setLocalBranding({ ...localBranding, colors: newColors });
  };

  const handleContinue = () => {
    updateBranding(localBranding);
    setBrandUrl(localBrandUrl);
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Branding</h3>
        <p className="text-sm text-muted-foreground">
          Import brand assets automatically from your website or configure manually.
        </p>
      </div>

      {/* Brand URL Input */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="brand-url">Brand Website URL</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="brand-url"
              type="url"
              placeholder="https://example.com"
              value={localBrandUrl}
              onChange={(e) => setLocalBrandUrl(e.target.value)}
            />
            <Button 
              onClick={handleBrandAnalyze}
              disabled={!localBrandUrl || loading}
              variant="outline"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span className="ml-2">Analyze</span>
            </Button>
          </div>
          {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}
        </div>

        {/* Brand Colors */}
        <div>
          <Label>Brand Colors</Label>
          <div className="space-y-2 mt-2">
            {localBranding.colors.map((color, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="w-20 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="flex-1"
                  placeholder="#000000"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveColor(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddColor}
              className="w-full"
            >
              Add Color
            </Button>
          </div>
        </div>

        {/* Brand Fonts */}
        <div>
          <Label htmlFor="fonts">Brand Fonts</Label>
          <Input
            id="fonts"
            className="mt-2"
            placeholder="e.g., Poppins, Inter, Arial"
            value={Array.isArray(localBranding.fonts) ? localBranding.fonts.join(', ') : ''}
            onChange={(e) =>
              setLocalBranding({
                ...localBranding,
                fonts: e.target.value.split(',').map(f => f.trim()).filter(Boolean),
              })
            }
          />
          <p className="text-xs text-muted-foreground mt-1">
            Comma-separated list of font names
          </p>
        </div>

        {/* Brand Assets Section */}
        {localBranding.screenshot && (
          <div>
            <Label>Website Preview</Label>
            <div className="mt-2 p-4 border rounded bg-gray-50">
              <img
                src={localBranding.screenshot}
                alt="Website screenshot"
                className="w-full max-h-48 object-contain rounded"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-600">Homepage Screenshot</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(localBranding.screenshot, '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Full Size
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Extracted Logo */}
        {localBranding.logoUrl && (
          <div>
            <Label>Extracted Logo</Label>
            <div className="mt-2 p-4 border rounded bg-white">
              <img
                src={localBranding.logoUrl}
                alt="Extracted logo"
                className="max-h-20 object-contain"
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Confidence: {localBranding.logoConfidence}%
                  </span>
                  {(localBranding.logoConfidence || 0) > 60 && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <Button
                  size="sm"
                  variant={localBranding.logo === localBranding.logoUrl ? "default" : "outline"}
                  onClick={() => 
                    setLocalBranding({
                      ...localBranding,
                      logo: localBranding.logoUrl || '',
                    })
                  }
                >
                  {localBranding.logo === localBranding.logoUrl ? "Using This Logo" : "Use This Logo"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Brand Images Collection */}
        {localBranding.brandImages && localBranding.brandImages.length > 0 && (
          <div>
            <Label>Brand Images</Label>
            <div className="mt-2 grid grid-cols-2 gap-4">
              {localBranding.brandImages.map((imageUrl, index) => (
                <div key={index} className="p-3 border rounded bg-gray-50">
                  <img
                    src={imageUrl}
                    alt={`Brand image ${index + 1}`}
                    className="w-full h-20 object-contain rounded"
                  />
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {imageUrl.includes('screenshot') ? 'Screenshot' : 
                       imageUrl.includes('logo') ? 'Logo' : 
                       imageUrl.includes('og') ? 'Social Image' : 'Image'}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const updatedImages = [...(localBranding.brandImages || [])];
                        updatedImages.splice(index, 1);
                        setLocalBranding({
                          ...localBranding,
                          brandImages: updatedImages
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Logo Upload */}
        <div>
          <Label htmlFor="logo">Upload Custom Logo</Label>
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <Input
                id="logo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setLocalBranding({
                        ...localBranding,
                        logo: reader.result as string,
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('logo')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo
              </Button>
              {localBranding.logo && !localBranding.logoUrl && (
                <span className="text-sm text-green-600">Custom logo uploaded</span>
              )}
            </div>
            {localBranding.logo && localBranding.logo !== localBranding.logoUrl && (
              <div className="mt-2 p-4 border rounded bg-white">
                <img
                  src={localBranding.logo}
                  alt="Custom logo"
                  className="max-h-20 object-contain"
                />
                <div className="mt-2">
                  <span className="text-sm text-gray-600">Custom Uploaded Logo</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleContinue}
          disabled={localBranding.colors.length === 0 || localBranding.fonts.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}