# MyWave API 문서

## 📚 개요

MyWave API는 통합 물놀이 활동 데이터를 제공하는 서비스 계층입니다. 싱글톤 패턴과 어댑터 패턴을 사용하여 다양한 데이터 소스를 통합 관리합니다.

## 🏗️ 아키텍처

```
┌─────────────────────────────────────┐
│         WaterActivityService         │  ← 통합 서비스 (싱글톤)
└───────────────┬─────────────────────┘
                │
    ┌───────────┼───────────┬───────────┐
    │           │           │           │
┌───▼───┐ ┌────▼────┐ ┌────▼────┐ ┌────▼─────┐
│ Beach │ │ Valley  │ │ Mudflat │ │  Marine  │  ← 어댑터 계층
│Adapter│ │ Adapter │ │ Adapter │ │  Sports  │
└───┬───┘ └────┬────┘ └────┬────┘ └────┬─────┘
    │          │           │            │
    │          │           │            │
┌───▼───┐ ┌────▼────┐ ┌────▼────┐ ┌────▼─────┐
│Public │ │ Public  │ │ Public  │ │  Public  │  ← 외부 API
│  API  │ │   API   │ │   API   │ │    API   │
└───────┘ └─────────┘ └─────────┘ └──────────┘
```

## 🔑 주요 클래스 및 메서드

### WaterActivityService

#### 인스턴스 가져오기

```typescript
import { WaterActivityService } from '@/lib/api/services/WaterActivityService'

const service = WaterActivityService.getInstance()
```

#### 메서드 목록

##### 1. `getAllLocations()`

모든 물놀이 장소를 가져옵니다.

```typescript
const locations = await service.getAllLocations()
// Returns: WaterLocation[]
```

**응답 예시:**
```json
[
  {
    "id": "beach-1",
    "type": "beach",
    "name": "해운대해수욕장",
    "nameEn": "Haeundae Beach",
    "region": "부산",
    "district": "해운대구",
    "coordinates": {
      "latitude": 35.1587,
      "longitude": 129.1604
    },
    "rating": 4.7,
    "reviews": 15234
  }
  // ... more locations
]
```

##### 2. `getLocationsByType(type)`

특정 유형의 장소만 가져옵니다.

```typescript
const beaches = await service.getLocationsByType('beach')
const valleys = await service.getLocationsByType('valley')
const mudflats = await service.getLocationsByType('mudflat')
const marineSports = await service.getLocationsByType('marine_sports')
```

**매개변수:**
- `type`: `'beach' | 'valley' | 'mudflat' | 'marine_sports'`

##### 3. `getLocationDetail(id, type)`

특정 장소의 상세 정보를 가져옵니다.

```typescript
const detail = await service.getLocationDetail('beach-1', 'beach')
```

**매개변수:**
- `id`: 장소 ID
- `type`: 장소 유형

##### 4. `getRecommendations(userPreferences, userLocation)`

사용자 맞춤 추천을 제공합니다.

```typescript
const recommendations = await service.getRecommendations(
  {
    activityTypes: ['beach', 'valley'],
    maxDistance: 50, // km
    crowdSensitivity: 'prefer_quiet',
    accessibility: {
      needsParking: true,
      publicTransportOnly: false,
      wheelchairAccess: false
    }
  },
  {
    latitude: 35.1796,
    longitude: 129.0756
  }
)
```

**매개변수:**
- `userPreferences`: 사용자 선호도 설정
- `userLocation`: 사용자 현재 위치 좌표

**응답 구조:**
```typescript
interface WaterActivityRecommendation {
  location: WaterLocation
  matchScore: number // 0-100
  matchReasons: string[]
  weather: WeatherInfo
  distance: number // km
  estimatedTime: number // minutes
  recommendation: 'highly_recommended' | 'recommended' | 'possible' | 'not_recommended'
}
```

##### 5. `getNearbyLocations(coordinates, radius)`

특정 위치 주변의 장소를 검색합니다.

```typescript
const nearby = await service.getNearbyLocations(
  { latitude: 35.1796, longitude: 129.0756 },
  10 // 10km 반경
)
```

##### 6. `getPopularLocations(limit)`

인기 장소를 가져옵니다.

```typescript
const popular = await service.getPopularLocations(10)
```

## 🔧 어댑터 사용법

각 어댑터는 독립적으로 사용할 수도 있습니다.

### BeachAdapter

```typescript
import { BeachAdapter } from '@/lib/api/adapters/BeachAdapter'

const adapter = new BeachAdapter()
const beaches = await adapter.getLocations()
const beachDetail = await adapter.getLocationDetail('beach-1')
```

### ValleyAdapter

```typescript
import { ValleyAdapter } from '@/lib/api/adapters/ValleyAdapter'

const adapter = new ValleyAdapter()
const valleys = await adapter.getLocations()

// 계곡 전용 메서드
const waterQuality = await adapter.getWaterQuality('valley-1')
const waterLevel = await adapter.getWaterLevel('valley-1')
```

### MudflatAdapter

```typescript
import { MudflatAdapter } from '@/lib/api/adapters/MudflatAdapter'

const adapter = new MudflatAdapter()
const mudflats = await adapter.getLocations()

// 갯벌 전용 메서드
const tideSchedule = await adapter.getTideSchedule('mudflat-1', new Date())
const programs = await adapter.getExperiencePrograms('mudflat-1')
```

### MarineSportsAdapter

```typescript
import { MarineSportsAdapter } from '@/lib/api/adapters/MarineSportsAdapter'

const adapter = new MarineSportsAdapter()
const locations = await adapter.getLocations()

// 해양 스포츠 전용 메서드
const surfingSpots = await adapter.findBestLocationForActivity('surfing')
const availability = adapter.checkActivityAvailability(activity, currentWeather)
```

## 💾 캐싱 시스템

ApiCache를 사용하여 API 응답을 캐싱합니다.

```typescript
import { ApiCache } from '@/lib/api/cache/ApiCache'

const cache = new ApiCache()

// 캐시 저장
cache.set('key', data, 300) // 5분 TTL

// 캐시 가져오기
const cached = cache.get('key')

// 캐시 삭제
cache.delete('key')

// 전체 캐시 클리어
cache.clear()
```

## 📊 데이터 타입

### 기본 타입

```typescript
interface Coordinates {
  latitude: number
  longitude: number
}

interface AccessibilityInfo {
  parkingAvailable: boolean
  publicTransport: boolean
  wheelchairAccessible: boolean
  nearestStation?: string
  parkingCapacity?: number
}

interface SafetyInfo {
  lifeguard: boolean
  emergencyContact: string
  hazards?: string[]
  safetyEquipment?: string[]
  restrictions?: string[]
}

interface RealTimeData {
  lastUpdated: Date
  currentVisitors?: number
  crowdLevel?: 'low' | 'medium' | 'high'
  waterQuality?: 'excellent' | 'good' | 'fair' | 'poor'
  status?: 'open' | 'closed' | 'warning'
  temperature?: number
  alerts?: string[]
}
```

### 확장 타입

#### BeachData

```typescript
interface BeachData extends WaterLocation {
  beachType: 'sand' | 'pebble' | 'rock'
  beachLength: number // meters
  averageWidth: number // meters
  waveInfo?: {
    height: number
    period: number
    direction: string
  }
  amenities: BeachAmenity[]
  activities: string[]
  bestSeason: string[]
}
```

#### ValleyData

```typescript
interface ValleyData extends WaterLocation {
  valleyInfo: {
    waterDepth: { min: number; max: number }
    waterFlow: 'fast' | 'moderate' | 'slow'
    rockFormations: boolean
    naturalPools: number
  }
  waterQuality: {
    ph: number
    turbidity: number
    bacteria: 'safe' | 'caution' | 'danger'
  }
  campingAllowed: boolean
  hikingTrails: HikingTrail[]
}
```

#### MudflatData

```typescript
interface MudflatData extends WaterLocation {
  mudflatInfo: {
    area: number // hectares
    type: 'sandy' | 'muddy' | 'mixed'
    tidalRange: number // meters
  }
  tideSchedule: TideInfo[]
  marineLife: string[]
  experiencePrograms: ExperienceProgram[]
  bestVisitTime: {
    lowTideOffset: number // minutes
    duration: number // hours
  }
}
```

#### MarineSportsData

```typescript
interface MarineSportsData extends WaterLocation {
  sportsInfo: {
    mainActivities: SportActivity[]
    waterDepth: { min: number; max: number }
    bestSeason: string[]
    suitableFor: ('beginner' | 'intermediate' | 'advanced')[]
  }
  weatherRequirements: WeatherRequirement
  rentalServices: RentalService[]
  lessons: LessonProgram[]
  nearbyAmenities: Amenity[]
}
```

## 🚦 에러 처리

API 호출 시 발생할 수 있는 에러들:

```typescript
try {
  const locations = await service.getAllLocations()
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    // 네트워크 에러 처리
  } else if (error.code === 'API_KEY_INVALID') {
    // API 키 에러 처리
  } else {
    // 기타 에러 처리
  }
}
```

## 🌐 환경 변수

필요한 환경 변수를 `.env.local`에 설정:

```env
# 해수욕장 API
NEXT_PUBLIC_BEACH_API_URL=https://api.beach.go.kr
NEXT_PUBLIC_BEACH_API_KEY=your_api_key

# 계곡 API
NEXT_PUBLIC_VALLEY_API_URL=https://api.valley.go.kr
NEXT_PUBLIC_VALLEY_API_KEY=your_api_key

# 갯벌 API
NEXT_PUBLIC_MUDFLAT_API_URL=https://api.mudflat.go.kr
NEXT_PUBLIC_MUDFLAT_API_KEY=your_api_key

# 해양 스포츠 API
NEXT_PUBLIC_MARINE_SPORTS_API_URL=https://api.marine.go.kr
NEXT_PUBLIC_MARINE_SPORTS_API_KEY=your_api_key

# 날씨 API
NEXT_PUBLIC_WEATHER_API_URL=https://api.weather.go.kr
NEXT_PUBLIC_WEATHER_API_KEY=your_api_key
```

## 📝 사용 예시

### 기본 사용

```typescript
import { WaterActivityService } from '@/lib/api/services/WaterActivityService'

export default function MyComponent() {
  const [locations, setLocations] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const service = WaterActivityService.getInstance()
      const data = await service.getAllLocations()
      setLocations(data)
    }
    loadData()
  }, [])

  return (
    <div>
      {locations.map(location => (
        <div key={location.id}>{location.name}</div>
      ))}
    </div>
  )
}
```

### 추천 시스템 사용

```typescript
const getPersonalizedRecommendations = async () => {
  const service = WaterActivityService.getInstance()

  // 사용자 위치 가져오기
  const position = await getCurrentPosition()

  // 사용자 선호도
  const preferences = {
    activityTypes: ['beach', 'marine_sports'],
    maxDistance: 30,
    crowdSensitivity: 'moderate',
    accessibility: {
      needsParking: true,
      publicTransportOnly: false,
      wheelchairAccess: false
    }
  }

  // 추천 받기
  const recommendations = await service.getRecommendations(
    preferences,
    {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }
  )

  return recommendations
}
```

## 🔄 실시간 데이터 업데이트

```typescript
// 5분마다 데이터 새로고침
useEffect(() => {
  const interval = setInterval(async () => {
    const service = WaterActivityService.getInstance()
    const updated = await service.getAllLocations()
    setLocations(updated)
  }, 5 * 60 * 1000) // 5분

  return () => clearInterval(interval)
}, [])
```

## 📱 React Hook 예시

```typescript
// hooks/useWaterActivities.ts
export function useWaterActivities(type?: string) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const service = WaterActivityService.getInstance()
        const result = type
          ? await service.getLocationsByType(type)
          : await service.getAllLocations()
        setData(result)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [type])

  return { data, loading, error }
}
```

## 🧪 Mock 데이터

현재 모든 어댑터는 개발 중 Mock 데이터를 반환합니다. 실제 API 연동 시:

1. 각 어댑터의 `getLocations()` 메서드 수정
2. 환경 변수에 실제 API 엔드포인트 설정
3. API 응답을 WaterLocation 형식으로 변환

```typescript
// 실제 API 연동 예시
async getLocations(): Promise<BeachData[]> {
  const response = await axios.get(this.apiUrl, {
    params: { apiKey: this.apiKey }
  })
  return this.transformApiResponse(response.data)
}

private transformApiResponse(data: any[]): BeachData[] {
  return data.map(item => ({
    id: item.id,
    type: 'beach',
    name: item.beachName,
    // ... 나머지 매핑
  }))
}
```