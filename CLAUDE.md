# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Sexual Repression Index (SRI) Calculator** - a scientific psychological assessment tool based on validated psychometric scales. The application is a pure client-side React application that evaluates users' sexual psychological characteristics through standardized questionnaires and provides personalized analysis.

**Key Points:**
- 100% client-side processing - all data stays in browser localStorage
- No server-side data storage or transmission
- Based on validated psychological scales (SIS/SES, Mosher, KISS-9, SOS, BSAS)
- Bilingual support (Chinese/English) via i18next

## Build and Development Commands

### Installation
```bash
npm install --legacy-peer-deps
```
Note: Use `--legacy-peer-deps` to resolve dependency conflicts

### Development
```bash
npm run dev                    # Start development server (localhost:3000)
npm run type-check            # Run TypeScript type checking
npm run lint                  # Run ESLint
```

### Production Builds
```bash
npm run build                 # Build both client and server (dist/web + dist/server.cjs)
npm run build:client          # Build client only (dist/web)
npm run build:server          # Build server only (dist/server.cjs)
npm run start                 # Run production server with Deno
```

### Platform-Specific Builds
```bash
npm run build:cloudflare      # Build for Cloudflare Pages (dist/)
npm run cf:deploy             # Install deps + build for Cloudflare
npm run build:vercel          # Build for Vercel (dist/)
```

**Output Directories:**
- Default build: `dist/web` (client) + `dist/server.cjs` (server)
- Cloudflare/Vercel builds: `dist/` (static files only)

## Architecture Overview

### Core Calculation System

The application implements a sophisticated psychometric calculation engine with three main components:

**1. Scale System (`src/lib/scales/`)**
- **Main Scales** (`index.ts`): Contains 8 validated psychological scales
  - SIS/SES-SF (14 items) and Full (45 items) - Sexual Inhibition/Excitation
  - Mosher Sexual Guilt (10 items) and Full (28 items)
  - KISS-9 Sexual Shame (9 items)
  - SOS Screening (5 items) and Full (21 items) - Sexual Opinion Survey
  - BSAS Brief (23 items) - Sexual Attitudes Scale

- **Adaptive Scales** (`adaptive-scales.ts`): Age and experience-appropriate versions
  - Teen Sexual Attitudes (14-17 years old)
  - Sexual Cognition (inexperienced users)
  - SIS/SES Adapted (modified for inexperienced users)
  - Function `getAdaptiveScales(demographics)` dynamically selects appropriate scales

**2. Calculator Engine (`src/lib/calculator/index.ts`)**
- **Core Algorithm:**
  1. Calculates raw scores from user responses
  2. Applies z-score standardization using normative data
  3. Computes 4 dimension scores:
     - SOS Reversed (fear/avoidance of sexual stimuli)
     - Sexual Guilt
     - Sexual Shame
     - SIS over SES (inhibition vs excitation advantage)
  4. Synthesizes SRI index (0-100) using standard normal CDF
  5. Generates personalized interpretation and recommendations

- **Key Functions:**
  - `calculateAssessmentResults(responses, sessionId, norms?)` - Main entry point
  - `calculateRawScore(responses, scaleId)` - Handles reverse scoring
  - `calculateZScore(rawScore, mean, stdDev)` - Standardization
  - `calculateDimensionScores(responses, norms)` - 4-dimension computation
  - `calculateSRI(dimensionScores)` - Final SRI index (0-100)

**3. Storage System (`src/lib/storage/index.ts`)**
- **Privacy-First Design:**
  - All data stored in browser localStorage only
  - Auto-cleanup when storage exceeds 5MB (keeps newest 20 sessions)
  - Anonymization for exported data
  - Secure wipe function for complete data removal

- **Key Functions:**
  - `saveAssessmentSession(session)` - Saves/updates session
  - `getAssessmentSession(sessionId)` - Retrieves session by ID
  - `exportSessionData(sessionId)` - Anonymized export
  - `secureDataWipe()` - Complete privacy cleanup

### Assessment Flow

1. **Home Page** → User selects Quick (39 questions) or Full (117 questions) assessment
2. **Consent Form** → User acknowledges informed consent
3. **Demographics** → Age, gender, relationship status, sexual activity level
   - Determines adaptive scales via `getAdaptiveScales()` function
4. **Questionnaire** → Dynamic question list based on demographics
   - Progress auto-saved to localStorage
   - Supports resume after interruption
5. **Results Calculation** → `calculateAssessmentResults()` computes SRI
6. **Results Display** → Shows SRI score, 4-dimension breakdown, recommendations

### Key Technical Patterns

**Internationalization:**
- i18next integration with React (src/i18n/index.ts)
- Language switch affects scale text, interpretation, recommendations
- Both scale questions and interpretations support bilingual display

**Data Validation:**
- Scale questions define valid option ranges
- Response validation before calculation
- Reverse scoring handled automatically in calculator

**Normative Data:**
- Default norms based on literature (src/lib/calculator/index.ts:95-151)
- Means and standard deviations for each scale
- Future: Should be updated with local sample norms

## Important Development Notes

### When Working with Calculations

**DO NOT** modify the core calculation formulas without understanding the psychometric basis:
- Z-score standardization requires accurate normative means and standard deviations
- The 4-dimension model is based on specific scale combinations
- SRI synthesis uses equal weighting across dimensions
- Normal CDF transformation maps z-scores to 0-100 percentile

**If adding new scales:**
1. Define scale in `src/lib/scales/index.ts` following existing pattern
2. Add to `ALL_SCALES` object
3. Update normative data in `getDefaultNorms()` with literature-based values
4. Update `calculateDimensionScores()` if scale maps to a new dimension
5. Test calculation thoroughly with known inputs

### When Working with Storage

**Privacy is paramount:**
- Never add server-side data transmission
- Always anonymize exported data
- Respect user's data deletion requests
- Test storage quota handling (especially on mobile browsers)

### Build Configuration

The project uses **Rsbuild** (not Webpack or Vite) with three configurations:
- `rsbuild.config.ts` - Default client+server build
- `rsbuild.config.cloudflare.ts` - Cloudflare Pages static build
- `rsbuild.config.server.ts` - Server-side bundle (Deno runtime)

**Path aliases:**
- `@/` maps to `./src/` (configured in rsbuild.config.ts)

### Deployment-Specific Notes

**Cloudflare Pages:**
- Uses environment variables for abuse prevention: `ABUSE_REDIRECT_ENABLED`, `SHOW_ABUSE_POPUP`
- Comment out `functions/_middleware.js` copy in config when not using to avoid high request counts
- Build command: `npm run cf:deploy`

**Docker:**
- Production image available: `appe233/sexual-repression-calculator`
- Runs on port 8000
- Uses Deno runtime for server

## Component Structure

**Assessment Components** (`src/components/assessment/`):
- `consent-form.tsx` - Informed consent
- `demographics-form.tsx` - User demographics collection
- `questionnaire-list.tsx` - Main question display with progress tracking
- `question-card.tsx` - Individual question renderer
- `progress-indicator.tsx` - Visual progress bar

**Common Components** (`src/components/common/`):
- `share-*.tsx` - Social sharing functionality
- `language-switcher.tsx` - i18n language toggle
- `loading-screen.tsx` - Assessment loading state

**UI Components** (`src/components/ui/`):
- shadcn/ui component library
- Radix UI primitives
- Tailwind CSS styling

## Testing Guidance

**Type Checking:**
```bash
npm run type-check
```

**Manual Testing Priorities:**
1. Complete full assessment flow (consent → demographics → questions → results)
2. Test adaptive scales for different age groups and experience levels
3. Verify calculation accuracy with known inputs
4. Test storage quota handling (especially on Safari/iOS)
5. Test data export and secure wipe functionality
6. Verify internationalization switches language correctly

## Scientific Integrity

This tool is based on peer-reviewed psychological scales. When making changes:

- Maintain scientific accuracy of scale items
- Preserve validated question wording (translations should be reviewed by native speakers)
- Document any modifications to calculation algorithms
- Add appropriate disclaimers if adapting scales significantly
- Remember: This is an educational tool, not a clinical diagnostic instrument
