# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyWave is a comprehensive water activity recommendation platform for Busan, developed for the Pusan National University Vibe Coding Hackathon. It provides personalized recommendations for beaches, valleys, mudflats, and marine sports based on user preferences, real-time weather data, and location.

**Key Philosophy**: The platform avoids "AI" terminology in user-facing text. Use "Wave" or generic terms like "맞춤 추천" (personalized recommendations) instead.

## Development Commands

### Docker Development (Recommended)
```bash
# Start development server (accessible at http://localhost:3001)
docker-compose up --build

# Stop containers
docker-compose down

# View logs
docker-compose logs --tail=50
```

### Local Development
```bash
# Install dependencies
npm install

# Start development server (port 3000, uses Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

**Port Configuration**:
- Local: http://localhost:3000
- Docker: http://localhost:3001 (external) → 3000 (internal)

## Architecture Overview

### 1. Multi-Type Water Activity System

The platform unifies four distinct activity types under a single interface:
- **Beach** (해수욕장): Swimming, surfing, sand activities
- **Valley** (계곡): Mountain streams, camping, hiking
- **Mudflat** (갯벌): Tidal exploration, marine life observation
- **Marine Sports** (해양스포츠): Surfing, jet ski, snorkeling

**Key Files**:
- `/types/water-activities.ts`: Unified type system with `WaterLocation` base interface
- `/lib/api/services/WaterActivityService.ts`: Singleton service with 9-factor scoring algorithm
- `/lib/api/adapters/`: Separate adapters for each activity type

### 2. Recommendation Algorithm

**Weighted Scoring System** (9 factors):
1. Weather conditions (temperature, wind, visibility)
2. Activity type matching
3. Crowd sensitivity preference
4. Companion type (solo, couple, family, friends, group)
5. Preferred time of day (morning, afternoon, evening, night)
6. Budget range (free, budget, moderate, premium)
7. Accessibility needs (parking, public transport, wheelchair)
8. Location rating and popularity
9. Age group appropriateness

**Implementation**: `WaterActivityService.calculateMatchScore()` returns score (0-100) and reasons array.

**Purpose-based Weights**:
```typescript
{
  swimming: { weather: 1.2, activity: 1.0, crowd: 0.8 },
  surfing: { weather: 1.5, activity: 1.3, crowd: 0.5 },
  family: { weather: 0.8, activity: 1.2, crowd: 1.0 },
  walking: { weather: 1.0, activity: 0.5, crowd: 0.8 }
}
```

### 3. Internationalization (i18n) System

**localStorage-based WITHOUT URL routing**:
- Key: `locale` (values: ko, en, ja, zh)
- Key: `language-selected` (tracks if user has chosen language)
- `ClientWrapper.tsx` manages translations client-side
- Translation files: `/messages/{locale}.json`
- Language changes trigger full page reload
- **NO URL-based routing** (/ko, /en paths don't exist)

**Language Selection Flow**:
1. First visit → `LanguageSelectionModal` (blocks everything else)
2. After language selection → sets `language-selected` in localStorage
3. Then shows onboarding if needed

### 4. Onboarding System (7 Steps)

Enhanced from 4 to 7 steps for detailed personalization:

1. **Purpose**: swimming, surfing, family, walking
2. **Water Temperature**: cold, moderate, warm
3. **Crowd Sensitivity**: low, medium, high
4. **Age Group**: teens, twenties, thirties, forties, fifties, sixties_plus
5. **Companion Type**: solo, couple, family, friends, group
6. **Preferred Activities**: Multi-select checkboxes
7. **Time & Budget**: morning/afternoon/evening/night, free/budget/moderate/premium
8. **Special Needs**: Pet-friendly, wheelchair access, baby facilities, senior-friendly

**Key Component**: `/components/onboarding/OnboardingModal.tsx`

**Access Points**:
- Main page header: "Wave 맞춤 추천" button (always visible)
- Recommendations page: "설정 변경" button
- Onboarding completion redirects to `/recommendations`

### 5. State Management (Zustand)

**Persisted State** (localStorage key: `mywave-storage`):
- `userPreferences`: Complete user preference object
- `hasCompletedOnboarding`: Boolean flag

**Session State** (not persisted):
- `recommendations`: Current recommendation results
- `selectedBeach`: Selected location for detail view
- `isLoading`: Loading indicator state

### 6. Component Architecture

```
components/
├── ClientWrapper.tsx              # i18n provider, manages locale
├── ui/
│   ├── Button.tsx                # Base button (primary, outline, ghost variants)
│   ├── Badge.tsx                 # Status badges (success, warning, danger, info)
│   ├── Card.tsx                  # Base card component
│   ├── LanguageSwitcher.tsx      # Dropdown language selector
│   ├── MatchScoreVisual.tsx      # Circular progress for match scores
│   ├── SkeletonLoader.tsx        # Loading placeholders (card, hero, list, text)
│   ├── Toast.tsx                 # Individual toast notification
│   ├── ToastContainer.tsx        # Toast management system
│   └── AIReasonBubble.tsx        # Floating recommendation reason bubble
├── water/
│   ├── WaterLocationCard.tsx     # 3D glassmorphism card with tilt effect
│   └── WaterLocationList.tsx     # Filterable location grid
├── recommendation/
│   └── RecommendationHero.tsx    # Top recommendation showcase
├── onboarding/
│   └── OnboardingModal.tsx       # 7-step preference wizard
├── beach/
│   ├── BeachCard.tsx             # Legacy beach card
│   └── BeachDetailModal.tsx      # Detailed location modal
└── weather/
    └── WeatherWidget.tsx          # Current weather display
```

### 7. Design System

**Colors** (Tailwind custom theme):
- `beach-*`: Primary blue tones (50-900)
- `wave-*`: Secondary cyan tones (50-900)
- `coral-*`: Accent coral colors (50-900)

**Visual Effects**:
- **Glassmorphism**: `backdrop-blur-xl`, `bg-white/80`, transparency layers
- **3D Transforms**: `rotateX`, `rotateY` with mouse tracking (`useMotionValue`, `useTransform`)
- **Animations**: Framer Motion throughout (page transitions, card hover, score reveal)
- **Dark Mode**: Full support via Tailwind `dark:` classes

**Key Visual Components**:
- `WaterLocationCard`: Mouse-tracking 3D tilt effect
- `MatchScoreVisual`: Animated circular progress with SVG
- `RecommendationHero`: Confetti effect for 90+ scores
- `AIReasonBubble`: Typing animation with auto-cycling reasons

### 8. Page Structure

```
app/
├── page.tsx                      # Main landing page with location grid
├── recommendations/page.tsx      # Personalized recommendation results
├── layout.tsx                    # Root layout with ClientWrapper
└── test-water-activities/        # Development testing page
```

**Navigation Flow**:
1. **Main Page** (`/`): Browse all locations, filter by type, see popular spots
2. **Recommendations** (`/recommendations`): After onboarding, shows personalized matches with hero section and sorted grid

## Important Implementation Details

### Type Safety Rules

**Avoid `any` types** - The codebase has been cleaned of all `any` types. Use:
- `unknown` for truly unknown values
- Specific union types for parameters (e.g., `'swimming' | 'surfing' | 'family' | 'walking'`)
- `Record<string, T>` for object dictionaries
- React component types: `React.ComponentType<{ className?: string }>`

### Recommendation Display Pattern

When showing recommendations:
1. **Hero Section**: Top recommendation (highest match score)
2. **Match Score Visual**: Circular progress with score-based colors
3. **Reason Bubble**: Floating bubble at `bottom-24 right-8` with `position="top"`
4. **Other Recommendations**: Grid of remaining locations sorted by score

### Naming Conventions

**DO NOT use "AI" in user-facing text**. Instead:
- ✅ "Wave 맞춤 추천" (Wave personalized recommendations)
- ✅ "추천 이유" (recommendation reasons)
- ✅ "맞춤 추천 다시 받기" (get recommendations again)
- ❌ "AI 맞춤 추천" (AI recommendations)
- ❌ "AI가 분석" (AI analyzed)
- ❌ "AI 어시스턴트" (AI assistant)

### Docker Volume Configuration

The docker-compose setup preserves:
- `node_modules`: Cached in named volume
- `.next`: Build cache in named volume
- Source code: Mounted from host for hot-reload

**Hot Reload**: File changes are detected via volume mounts, triggering Fast Refresh.

### Lint Configuration

**Current Status**: 0 errors, ~25 warnings (acceptable)

Warnings are primarily:
- Unused axios imports (for future API integration)
- Unused type imports (future features)
- React Hook dependency warnings (intentional exclusions)

**Never commit code with ESLint errors**.

## Data Flow

### User Journey
```
Language Selection Modal (first visit)
  ↓
Main Page (browse all locations)
  ↓
Click "Wave 맞춤 추천" (header button)
  ↓
Onboarding Modal (7 steps)
  ↓
Preferences saved to Zustand + localStorage
  ↓
Redirect to /recommendations
  ↓
WaterActivityService.getRecommendations()
  ↓
9-factor scoring algorithm
  ↓
Display hero + grid + reason bubble
  ↓
"설정 변경" button → re-open onboarding → refresh recommendations
```

### API Service Pattern

```typescript
// Singleton instance
const service = WaterActivityService.getInstance()

// Get recommendations
const results = await service.getRecommendations(
  userPreferences,  // From Zustand store
  userLocation      // GPS coordinates
)

// Results include:
interface WaterActivityRecommendation {
  location: WaterLocation
  matchScore: number        // 0-100
  matchReasons: string[]   // Explanation array
  distance: number         // km from user
  weather?: WeatherInfo
}
```

## Common Development Tasks

### Adding a New Activity Type

1. Extend `WaterLocation` interface in `/types/water-activities.ts`
2. Create adapter in `/lib/api/adapters/`
3. Register adapter in `WaterActivityService.getAllLocations()`
4. Add type filter to `ActivityTypeSelector.tsx`
5. Add icon mapping in `WaterLocationCard.tsx`

### Modifying Recommendation Algorithm

Edit `WaterActivityService.calculateMatchScore()`:
- Adjust weights in `getWeightsByPurpose()`
- Add new scoring factors
- Update `matchReasons` array for user feedback

### Adding Translation

1. Edit all files in `/messages/`: `ko.json`, `en.json`, `ja.json`, `zh.json`
2. Use nested keys: `"home": { "title": "..." }`
3. Access in components: `const t = useTranslations(); t('home.title')`

## Testing

Development test page: http://localhost:3001/test-water-activities

Shows:
- Raw API data from all adapters
- Location filtering
- Type statistics
- Debug information

## Git Workflow

- **Remote**: https://github.com/PNUops/vibe-hackathon.git
- **Branch**: `main`
- **Commit format**: Use conventional commits with Claude Code footer
  ```
  feat: Add feature description

  Detailed changes...

  🤖 Generated with [Claude Code](https://claude.com/claude-code)

  Co-Authored-By: Claude <noreply@anthropic.com>
  ```

## Current Status

**Production Ready**:
- Complete UI/UX with 3D effects and glassmorphism
- 7-step onboarding with comprehensive preferences
- 9-factor recommendation algorithm
- 4 language support (ko, en, ja, zh)
- Docker containerization
- TypeScript type safety (0 errors)
- Responsive design with dark mode

**Using Mock Data**:
- All water activity data is currently mocked in adapters
- Weather data embedded in mock responses
- Replace with real API calls when endpoints available

**Future Enhancements** (noted in README):
- Real API integration with Busan public APIs
- Map view with location markers
- User review system
- Favorites functionality
- Weather forecast integration
- PWA support with offline mode