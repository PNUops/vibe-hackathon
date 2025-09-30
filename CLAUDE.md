# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyWave (formerly BeachMate 부산) is a personalized beach recommendation service for Busan, developed for the Pusan National University Vibe Coding Hackathon. It recommends optimal beaches based on real-time weather data and user preferences.

## Development Commands

### Docker Development (Recommended)
```bash
# Start development server with Docker (port 3001)
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

## Architecture & Key Design Patterns

### 1. Internationalization System
The app uses a **localStorage-based i18n system** without URL routing:
- Language selection stored in localStorage (key: `locale`)
- `ClientWrapper` component manages translations client-side
- Translation files in `/messages/{locale}.json` for ko, en, ja, zh
- No URL-based locale routing (/ko, /en paths are NOT used)
- Language change triggers page reload for simplicity

### 2. Component Architecture
```
components/
├── ClientWrapper.tsx        # Wraps app with NextIntlClientProvider, manages locale
├── ui/                      # Base UI components (Button, Badge, Card)
│   └── LanguageSwitcher.tsx # Language selector, updates localStorage
├── beach/                   # Beach-related components
│   ├── BeachCard.tsx       # Beach recommendation card
│   └── BeachDetailModal.tsx # Detailed beach information modal
├── weather/                 # Weather display components
│   └── WeatherWidget.tsx   # Real-time weather widget
└── onboarding/             # User preference collection
    └── OnboardingModal.tsx # 4-step preference wizard
```

### 3. State Management (Zustand)
Central store in `/store/useStore.ts` manages:
- User preferences (activity purpose, water temp preference, crowd sensitivity)
- Beach recommendations array
- Selected beach for detail view
- Loading states
- Onboarding completion status

### 4. Type System
Core types defined in `/types/index.ts`:
- `UserPreferences`: User's beach preferences
- `BeachInfo`: Beach static data
- `WeatherData`: Real-time weather conditions
- `BeachRecommendation`: Combined beach + weather + matching data
- `Event`: Beach events (festivals, fireworks)

### 5. Styling Approach
- Tailwind CSS with custom theme colors:
  - `beach-*`: Primary blue tones
  - `wave-*`: Secondary cyan tones
  - `coral-*`: Accent coral colors
- Dark mode support via Tailwind classes
- Framer Motion for animations

## Important Implementation Details

### Mock Data Structure
Currently using mock data in `app/page.tsx`. Real API integration points:
- Beach data: Line 18-110 (mockRecommendations)
- Weather data: Embedded in beach recommendations
- Replace with actual API calls in `/lib/api/` directory

### User Preference Flow
1. First visit triggers onboarding modal
2. 4-step wizard collects: activity purpose → water temperature → crowd sensitivity → max distance
3. Preferences stored in Zustand store
4. Recommendations filtered based on preferences

### Docker Configuration
- Container name: `beachmate-busan`
- External port: 3001 (maps to internal 3000)
- Volume mounts preserve hot-reload in development
- Node modules and .next cached in volumes

## Current Project Status

### Completed Features
- Full UI/UX implementation with responsive design
- Multi-language support (Korean, English, Japanese, Chinese)
- User preference onboarding flow
- Beach recommendation cards with match scoring
- Detailed beach information modals
- Real-time weather widget
- Docker containerization

### Pending Implementation
- Real API integration (currently using mock data)
- Actual beach data from Busan public APIs
- Weather API integration (Korea Meteorological Administration)
- Beach crowd prediction algorithm
- Event data integration

## Git Repository
- Remote: https://github.com/PNUops/vibe-hackathon.git
- Main branch: `main`
- Project located in `/beachmate-busan` directory