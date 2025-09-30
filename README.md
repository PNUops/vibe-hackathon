# 🏖️ BeachMate 부산

> 부산대학교 바이브코딩 해커톤 프로젝트
> 공공데이터를 활용한 개인 맞춤형 해수욕장 추천 서비스

## 📋 프로젝트 소개

BeachMate 부산은 실시간 날씨 정보와 사용자 선호도를 기반으로 최적의 해수욕장을 추천하는 웹 서비스입니다. 부산시 공공데이터와 기상청 API를 활용하여 정확하고 유용한 정보를 제공합니다.

### 주요 기능

- 🎯 **개인 맞춤형 추천**: 사용자의 활동 목적, 물 온도 선호도, 혼잡도 민감도 등을 고려한 AI 추천
- 🌡️ **실시간 날씨 정보**: 기온, 수온, 파고, 풍속 등 해수욕에 필요한 모든 날씨 정보
- 🎪 **행사 연계 추천**: 불꽃축제, 페스티벌 등 주변 행사 정보와 연계된 일정 제안
- 📊 **혼잡도 예측**: 시간대별 예상 혼잡도 제공
- 🗺️ **상세 정보 제공**: 편의시설, 교통 정보, 주변 관광지 안내

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Docker Compose
- **API**: 부산시 공공데이터 API (예정), 기상청 API (예정)

## 🚀 실행 방법

### Docker Compose로 실행 (권장)

```bash
# 프로젝트 클론
git clone https://github.com/yourusername/beachmate-busan.git
cd beachmate-busan

# Docker Compose로 실행
docker-compose up -d

# 브라우저에서 접속
# http://localhost:3001
```

### 로컬에서 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 접속
# http://localhost:3000
```

## 📂 프로젝트 구조

```
beachmate-busan/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 메인 페이지
│   └── globals.css        # 글로벌 스타일
├── components/            # React 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   ├── beach/            # 해수욕장 관련 컴포넌트
│   ├── weather/          # 날씨 관련 컴포넌트
│   └── onboarding/       # 온보딩 관련 컴포넌트
├── lib/                   # 유틸리티 함수
│   └── api/              # API 연동 함수
├── store/                 # Zustand 상태 관리
├── types/                 # TypeScript 타입 정의
└── docker-compose.yml     # Docker 설정
```

## 🎨 주요 화면

### 1. 메인 화면
- 오늘의 추천 해수욕장 TOP 3
- 실시간 날씨 위젯
- 활동별 필터링 (수영, 서핑, 가족, 산책)
- 해수욕장 상태 정보 (수질, 자외선, 조류 등)

### 2. 온보딩
- 활동 목적 선택
- 물 온도 선호도 설정
- 혼잡도 민감도 선택
- 최대 이동 거리 설정

### 3. 해수욕장 상세 정보
- 실시간 날씨 정보
- 시간대별 혼잡도 예측
- 추천 활동 및 편의시설
- 교통 정보 및 길찾기

## 📊 공공데이터 활용

- **부산시 해수욕장 정보**: 위치, 규모, 편의시설
- **기상청 날씨 API**: 실시간 기온, 파고, 풍속
- **해양수산부 데이터**: 수온, 조류 정보
- **한국관광공사 API**: 주변 행사 및 축제 정보

## 🏆 해커톤 목표

1. **사용자 중심 설계**: 직관적이고 아름다운 UI/UX
2. **공공데이터 활용**: 실용적인 정보 제공
3. **기술적 완성도**: 안정적이고 빠른 성능
4. **확장 가능성**: 다른 지역 확대 적용 가능

## 👥 팀 정보

- **프로젝트명**: BeachMate 부산
- **해커톤**: 부산대학교 바이브코딩 해커톤
- **주제**: 공공데이터를 활용한 웹사이트 개발

## 📝 라이센스

MIT License

## 🔗 관련 링크

- [부산시 공공데이터 포털](https://data.busan.go.kr/)
- [기상청 날씨누리](https://www.weather.go.kr/)
- [한국관광공사 API](https://api.visitkorea.or.kr/)