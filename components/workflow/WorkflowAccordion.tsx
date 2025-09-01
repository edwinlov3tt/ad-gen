"use client"

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useAdGeneratorStore } from '@/lib/store';
import { PlacementStep } from './PlacementStep';
import { BriefStep } from './BriefStep';
import { ThemeStep } from './ThemeStep';
import { BrandingStep } from './BrandingStep';
import { CopyStep } from './CopyStep';
import { SubjectsStep } from './SubjectsStep';
import { BackgroundStep } from './BackgroundStep';
import { LayoutStep } from './LayoutStep';
import { AnimationStep } from './AnimationStep';
import { ReviewStep } from './ReviewStep';
import { Check } from 'lucide-react';

const steps = [
  { id: 'placement', title: '1. Placements & Sizes', component: PlacementStep },
  { id: 'brief', title: '2. Campaign Brief', component: BriefStep },
  { id: 'theme', title: '3. Theme & Style', component: ThemeStep },
  { id: 'branding', title: '4. Branding', component: BrandingStep },
  { id: 'copy', title: '5. Copy & CTAs', component: CopyStep },
  { id: 'subjects', title: '6. Subjects / Concepts', component: SubjectsStep },
  { id: 'background', title: '7. Background Generation', component: BackgroundStep },
  { id: 'layout', title: '8. Layout Templates', component: LayoutStep },
  { id: 'animation', title: '9. Animation', component: AnimationStep },
  { id: 'review', title: '10. Review & Generate', component: ReviewStep },
];

export function WorkflowAccordion() {
  const { currentStep, completedSteps, setCurrentStep } = useAdGeneratorStore();
  const [expandedItems, setExpandedItems] = useState<string[]>(['placement']);

  const handleStepComplete = (stepIndex: number) => {
    const store = useAdGeneratorStore.getState();
    store.markStepComplete(stepIndex);
    
    // Auto-expand next step
    if (stepIndex < steps.length - 1) {
      const nextStepId = steps[stepIndex + 1].id;
      setExpandedItems([nextStepId]);
      setCurrentStep(stepIndex + 1);
    }
  };

  const canAccessStep = (stepIndex: number) => {
    if (stepIndex === 0) return true;
    return completedSteps.includes(stepIndex - 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Progressive Ad Generator</h1>
      
      <Accordion 
        type="multiple" 
        value={expandedItems}
        onValueChange={setExpandedItems}
        className="space-y-4"
      >
        {steps.map((step, index) => {
          const StepComponent = step.component;
          const isCompleted = completedSteps.includes(index);
          const isDisabled = !canAccessStep(index);
          const isCurrent = currentStep === index;
          
          return (
            <AccordionItem 
              key={step.id} 
              value={step.id}
              disabled={isDisabled}
              className={`border rounded-lg ${
                isDisabled ? 'opacity-50' : ''
              } ${
                isCurrent ? 'border-primary' : ''
              }`}
            >
              <AccordionTrigger 
                className="px-4 hover:no-underline"
                disabled={isDisabled}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    isCompleted ? 'bg-green-500 text-white' : 
                    isCurrent ? 'bg-primary text-white' : 
                    'bg-gray-200'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <span className={`font-medium ${
                    isCompleted ? 'text-green-600' : ''
                  }`}>
                    {step.title}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-4">
                <StepComponent onComplete={() => handleStepComplete(index)} />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}