export interface AdSize {
  w: number;
  h: number;
  name: string;
}

export interface AdBrief {
  objective: 'awareness' | 'leads' | 'sales';
  audience: string;
  theme: string[];
  style: string[];
}

export interface AdBranding {
  colors: string[];
  fonts: string[];
  logo?: string;
  logoUrl?: string;
  logoConfidence?: number;
  screenshot?: string;
  ogImage?: string;
  favicon?: string;
  brandImages?: string[];
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  context?: {
    title?: string;
    h1?: string;
    h2s?: string[];
  };
}

export interface AdCopy {
  headlines: string[];
  subheads: string[];
  ctas: string[];
  phone?: string;
  url?: string;
  disclaimer?: string;
}

export interface SubjectPlacement {
  grid: string; // e.g., "bottom-left"
  depth: 'foreground' | 'middle' | 'background';
  offset: {
    x: number;
    y: number;
  };
  scalePct: number;
}

export interface AdSubject {
  id: string;
  type: 'generated' | 'uploaded' | 'library';
  name: string;
  placement: SubjectPlacement;
  imageUrl?: string;
}

export interface AdBackground {
  base: 'clean' | 'gradient' | 'pattern' | 'photo' | 'illustrated';
  textures: string[];
  brandBlend: boolean;
  variants: string[];
}

export interface AnimationFrame {
  bg: string;
  subjects: string[];
  copy: {
    headline?: string;
    subhead?: string;
    cta?: string;
  };
  durationMs: number;
}

export interface AdAnimation {
  enabled: boolean;
  frames: AnimationFrame[];
  loop: boolean;
  transition: 'fade' | 'slide' | 'none';
}

export interface AdSpec {
  sizes: string[]; // e.g., ["1080x1080", "1080x1920"]
  brief: AdBrief;
  branding: AdBranding;
  copy: AdCopy;
  subjects: AdSubject[];
  background: AdBackground;
  layout: 'text-left' | 'text-top' | 'centered' | 'poster';
  animation?: AdAnimation;
}

export interface WorkflowState extends AdSpec {
  currentStep: number;
  completedSteps: number[];
  brandUrl?: string;
}