# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is an AI-powered ad generator built with Next.js 14, React, and TypeScript. It creates digital advertisements through a multi-step workflow that combines user inputs with AI-generated content.

## Commands

### Development
```bash
npm run dev      # Start development server on http://localhost:3000
npm run build    # Build production bundle
npm run start    # Start production server
npm run lint     # Run ESLint checks
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **UI Components**: Radix UI primitives with Tailwind CSS
- **State Management**: Zustand for workflow state persistence
- **AI Integration**: OpenAI API for content generation
- **Image Processing**: Sharp for image manipulation, Canvas API for composition

### Core Workflow Structure
The application implements a 10-step ad creation workflow:
1. **Placements & Sizes** - Select ad dimensions (social media formats)
2. **Campaign Brief** - Define objective, audience, themes
3. **Theme & Style** - Visual style preferences
4. **Branding** - Extract brand colors, fonts, logos from URLs
5. **Copy & CTAs** - Generate headlines, subheads, call-to-actions
6. **Subjects/Concepts** - AI-generated or uploaded visual elements
7. **Background Generation** - AI-generated backgrounds matching brand
8. **Layout Templates** - Composition layouts (text-left, centered, etc.)
9. **Animation** - Multi-frame animated sequences
10. **Review & Generate** - Final composition and export

### Key Type Definitions
All ad specifications are defined in `types/ad-spec.ts`:
- `AdSpec` - Complete ad specification
- `WorkflowState` - Extended AdSpec with UI state
- Component-specific interfaces for each workflow step

### API Routes Pattern
All AI generation endpoints follow similar patterns in `app/api/`:
- `/brand/analyze` - Extracts branding from website URLs
- `/copy/generate` - Generates ad copy based on brief
- `/subjects/generate` - Creates subject/concept images
- `/backgrounds/generate` - Generates background images
- `/compose` - Combines all elements into final ads
- `/export` - Packages ads for download

### State Management
Global workflow state is managed via Zustand (`lib/store.ts`):
- Persists all ad configuration across steps
- Tracks completion status per step
- Provides update methods for each workflow section

### Component Structure
- `components/ui/` - Reusable UI primitives (buttons, cards, inputs)
- `components/workflow/` - Step-specific components
- Each step component connects to the global store and updates its section

## Important Notes
- API keys are stored in `.env.local` (OPENAI_API_KEY required)
- Canvas API is used for server-side image composition
- All generated assets are handled as base64 data URLs or temporary files