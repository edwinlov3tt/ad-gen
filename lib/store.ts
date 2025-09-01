import { create } from 'zustand';
import { WorkflowState } from '@/types/ad-spec';

interface AdGeneratorStore extends WorkflowState {
  // State
  currentStep: number;
  completedSteps: number[];
  
  // Actions
  setCurrentStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  updateSizes: (sizes: string[]) => void;
  updateBrief: (brief: WorkflowState['brief']) => void;
  updateBranding: (branding: WorkflowState['branding']) => void;
  updateCopy: (copy: WorkflowState['copy']) => void;
  updateSubjects: (subjects: WorkflowState['subjects']) => void;
  updateBackground: (background: WorkflowState['background']) => void;
  updateLayout: (layout: WorkflowState['layout']) => void;
  updateAnimation: (animation: WorkflowState['animation']) => void;
  setBrandUrl: (url: string) => void;
  reset: () => void;
}

const initialState: WorkflowState = {
  currentStep: 0,
  completedSteps: [],
  sizes: [],
  brief: {
    objective: 'awareness',
    audience: '',
    theme: [],
    style: [],
  },
  branding: {
    colors: [],
    fonts: [],
  },
  copy: {
    headlines: [],
    subheads: [],
    ctas: [],
  },
  subjects: [],
  background: {
    base: 'clean',
    textures: [],
    brandBlend: false,
    variants: [],
  },
  layout: 'text-left',
};

export const useAdGeneratorStore = create<AdGeneratorStore>((set) => ({
  ...initialState,
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
  markStepComplete: (step) => 
    set((state) => ({
      completedSteps: [...new Set([...state.completedSteps, step])].sort((a, b) => a - b),
    })),
  
  updateSizes: (sizes) => set({ sizes }),
  
  updateBrief: (brief) => set({ brief }),
  
  updateBranding: (branding) => set({ branding }),
  
  updateCopy: (copy) => set({ copy }),
  
  updateSubjects: (subjects) => set({ subjects }),
  
  updateBackground: (background) => set({ background }),
  
  updateLayout: (layout) => set({ layout }),
  
  updateAnimation: (animation) => set({ animation }),
  
  setBrandUrl: (brandUrl) => set({ brandUrl }),
  
  reset: () => set(initialState),
}))