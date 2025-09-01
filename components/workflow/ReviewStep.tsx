"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdGeneratorStore } from '@/lib/store';
import { Loader2, Download, CheckCircle, AlertCircle, Eye } from 'lucide-react';

interface StepProps {
  onComplete: () => void;
}

export function ReviewStep({ onComplete }: StepProps) {
  const store = useAdGeneratorStore();
  const [generating, setGenerating] = useState(false);
  const [previews, setPreviews] = useState<{ size: string; url: string }[]>([]);
  const [validationResults, setValidationResults] = useState<{
    contrast: boolean;
    fileSize: boolean;
    copy: boolean;
  }>({ contrast: true, fileSize: true, copy: true });

  const handleGenerate = async () => {
    setGenerating(true);
    
    try {
      // Generate AdSpec JSON
      const adSpec = {
        sizes: store.sizes,
        brief: store.brief,
        branding: store.branding,
        copy: store.copy,
        subjects: store.subjects,
        background: store.background,
        layout: store.layout,
        animation: store.animation,
      };

      // Generate for each size
      const generatedPreviews = [];
      for (const size of store.sizes) {
        const response = await fetch('/api/compose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adSpec, size }),
        });
        
        if (response.ok) {
          const data = await response.json();
          generatedPreviews.push({ size, url: data.previewUrl });
        }
      }
      
      setPreviews(generatedPreviews);
      
      // Run validation
      const validationResponse = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adSpec }),
      });
      
      if (validationResponse.ok) {
        const validation = await validationResponse.json();
        setValidationResults(validation);
      }
    } catch (err) {
      console.error('Error generating ads:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adSpec: {
            sizes: store.sizes,
            brief: store.brief,
            branding: store.branding,
            copy: store.copy,
            subjects: store.subjects,
            background: store.background,
            layout: store.layout,
            animation: store.animation,
          },
        }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ad-assets.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error exporting ads:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Review & Generate</h3>
        <p className="text-sm text-muted-foreground">
          Review your configuration and generate the final ad assets.
        </p>
      </div>

      {/* Configuration Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <div><span className="font-medium">Objective:</span> {store.brief.objective}</div>
            <div><span className="font-medium">Audience:</span> {store.brief.audience}</div>
            <div><span className="font-medium">Themes:</span> {store.brief.theme.join(', ')}</div>
            <div><span className="font-medium">Sizes:</span> {store.sizes.length} selected</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Creative Elements</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <div><span className="font-medium">Headlines:</span> {store.copy.headlines.length} variants</div>
            <div><span className="font-medium">CTAs:</span> {store.copy.ctas.length} variants</div>
            <div><span className="font-medium">Subjects:</span> {store.subjects.length} configured</div>
            <div><span className="font-medium">Layout:</span> {store.layout}</div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Status */}
      {(previews.length > 0 || generating) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quality Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {validationResults.contrast ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                )}
                <span className="text-sm">Contrast ratio (WCAG AA)</span>
              </div>
              <div className="flex items-center gap-2">
                {validationResults.fileSize ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                )}
                <span className="text-sm">File size limits</span>
              </div>
              <div className="flex items-center gap-2">
                {validationResults.copy ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                )}
                <span className="text-sm">Copy legibility (OCR check)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Generated Previews</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previews.map((preview, index) => (
              <Card key={index}>
                <CardContent className="p-3">
                  <div className="aspect-video bg-gray-100 rounded mb-2 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="text-sm font-medium">{preview.size}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        {previews.length === 0 ? (
          <Button 
            onClick={handleGenerate}
            disabled={generating}
            size="lg"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              'Generate Ads'
            )}
          </Button>
        ) : (
          <>
            <Button 
              onClick={handleGenerate}
              variant="outline"
              disabled={generating}
            >
              Regenerate
            </Button>
            <Button 
              onClick={handleExport}
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Assets
            </Button>
          </>
        )}
      </div>
    </div>
  );
}