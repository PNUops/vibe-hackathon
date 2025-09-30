# 🌊 MyWave - 부산 물놀이 통합 추천 플랫폼

> 부산대학교 바이브코딩 해커톤 프로젝트

## 📱 프로젝트 소개

MyWave는 부산 지역의 모든 물놀이 활동을 한 곳에서 추천받을 수 있는 통합 플랫폼입니다. 해수욕장, 계곡, 갯벌 체험, 해양 스포츠 등 다양한 물놀이 정보를 제공하며, 사용자의 선호도와 현재 위치를 기반으로 맞춤형 추천을 제공합니다.

### 주요 기능

- 🏖️ **해수욕장** - 부산의 주요 해수욕장 정보 및 실시간 혼잡도
- ⛰️ **계곡** - 시원한 계곡 정보와 수질 상태
- 🦀 **갯벌 체험** - 조수 시간표와 체험 프로그램
- 🏄 **해양 스포츠** - 서핑, 스노클링, 제트스키 등 다양한 해양 레저
- 🌍 **다국어 지원** - 한국어, 영어, 일본어, 중국어
- 📍 **위치 기반 추천** - GPS 기반 가까운 물놀이 장소 추천
- 🤖 **AI 추천 시스템** - 날씨, 혼잡도, 개인 선호도 기반 맞춤 추천

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0.0 이상
- Docker & Docker Compose (선택사항)
- npm 또는 yarn

### 설치 방법

#### 1. 로컬 개발 환경

```bash
# 저장소 클론
git clone https://github.com/PNUops/vibe-hackathon.git
cd beachmate-busan

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

#### 2. Docker 환경

```bash
# Docker Compose로 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d --build
```

Docker 환경에서는 [http://localhost:3001](http://localhost:3001)에서 실행됩니다.

### 환경 변수 설정

`.env.local` 파일을 생성하고 필요한 API 키를 설정하세요:

```env
# 공공 API 키
NEXT_PUBLIC_BEACH_API_KEY=your_beach_api_key
NEXT_PUBLIC_VALLEY_API_KEY=your_valley_api_key
NEXT_PUBLIC_MUDFLAT_API_KEY=your_mudflat_api_key
NEXT_PUBLIC_MARINE_SPORTS_API_KEY=your_marine_sports_api_key

# 날씨 API
NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key

# 지도 API
NEXT_PUBLIC_MAP_API_KEY=your_map_api_key
```

## 🏗️ 프로젝트 구조

```
beachmate-busan/
├── app/                      # Next.js App Router
│   ├── page.tsx             # 메인 페이지
│   ├── layout.tsx           # 루트 레이아웃
│   └── test-water-activities/ # 테스트 페이지
├── components/              # React 컴포넌트
│   ├── BeachList.tsx       # 해수욕장 목록
│   ├── BeachCard.tsx       # 해수욕장 카드
│   ├── ActivityTypeSelector.tsx # 활동 유형 선택기
│   ├── OnboardingModal.tsx # 온보딩 모달
│   └── LanguageSelectionModal.tsx # 언어 선택 모달
├── lib/                    # 비즈니스 로직
│   ├── api/
│   │   ├── services/      # API 서비스
│   │   │   └── WaterActivityService.ts # 통합 서비스
│   │   ├── adapters/      # 데이터 어댑터
│   │   │   ├── BeachAdapter.ts
│   │   │   ├── ValleyAdapter.ts
│   │   │   ├── MudflatAdapter.ts
│   │   │   └── MarineSportsAdapter.ts
│   │   └── cache/         # 캐싱 시스템
│   │       └── ApiCache.ts
│   └── stores/            # 상태 관리 (Zustand)
│       └── preferenceStore.ts
├── types/                 # TypeScript 타입 정의
│   └── water-activities.ts # 통합 데이터 모델
├── locales/              # 다국어 파일
│   ├── ko/
│   ├── en/
│   ├── ja/
│   └── zh/
└── public/               # 정적 파일
```

## 📊 데이터 모델

### 통합 WaterLocation 인터페이스

```typescript
interface WaterLocation {
  id: string
  type: 'beach' | 'valley' | 'mudflat' | 'marine_sports'
  name: string
  nameEn?: string
  region: string
  district: string
  coordinates: Coordinates
  accessibility: AccessibilityInfo
  safetyInfo: SafetyInfo
  realTimeData?: RealTimeData
  rating?: number
  reviews?: number
  tags?: string[]
}
```

각 활동 유형별로 확장된 인터페이스:
- `BeachData` - 해수욕장 전용 정보 (모래 타입, 파도 높이 등)
- `ValleyData` - 계곡 전용 정보 (수심, 수질, 캠핑 가능 여부 등)
- `MudflatData` - 갯벌 전용 정보 (조수 시간, 체험 프로그램 등)
- `MarineSportsData` - 해양 스포츠 정보 (장비 대여, 강습 프로그램 등)

## 🔌 API 서비스

### WaterActivityService

통합 물놀이 활동 서비스는 싱글톤 패턴으로 구현되어 있습니다:

```typescript
const service = WaterActivityService.getInstance()

// 모든 장소 가져오기
const allLocations = await service.getAllLocations()

// 특정 유형의 장소만 가져오기
const beaches = await service.getLocationsByType('beach')

// 추천 받기
const recommendations = await service.getRecommendations(
  userPreferences,
  userLocation
)

// 인기 장소
const popularSpots = await service.getPopularLocations(10)
```

### 어댑터 패턴

각 데이터 소스별로 독립적인 어댑터가 구현되어 있어, 새로운 API를 쉽게 통합할 수 있습니다:

```typescript
class BeachAdapter {
  async getLocations(): Promise<BeachData[]>
  async getLocationDetail(id: string): Promise<BeachData | null>
}
```

## 🎨 UI 컴포넌트

### ActivityTypeSelector
물놀이 활동 유형을 선택할 수 있는 필터 컴포넌트

### BeachCard
각 장소의 정보를 카드 형태로 표시

### OnboardingModal
첫 방문 사용자를 위한 온보딩 모달

### LanguageSelectionModal
다국어 선택 모달

## 🌐 다국어 지원

지원 언어:
- 🇰🇷 한국어 (기본)
- 🇺🇸 영어
- 🇯🇵 일본어
- 🇨🇳 중국어

언어 설정은 `localStorage`에 저장되며, URL 경로와는 독립적으로 작동합니다.

## 📝 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 타입 체크
npm run type-check

# 린트
npm run lint
```

## 🧪 테스트

테스트 페이지에서 통합 플랫폼 기능을 확인할 수 있습니다:

- [http://localhost:3001/test-water-activities](http://localhost:3001/test-water-activities)

## 📈 향후 계획

- [ ] 실제 공공 API 연동
- [ ] 지도 뷰 구현
- [ ] 사용자 리뷰 시스템
- [ ] 즐겨찾기 기능
- [ ] 날씨 예보 통합
- [ ] PWA 지원
- [ ] 오프라인 모드

## 🤝 기여하기

1. Fork 하기
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 🏆 팀 정보

**부산대학교 바이브코딩 해커톤**

- 프로젝트명: MyWave
- 개발 기간: 2025년 1월
- 기술 스택: Next.js 14, TypeScript, Tailwind CSS, Docker

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

Made with ❤️ in Busan