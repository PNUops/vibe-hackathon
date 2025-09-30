// 🌊 Water Activity Types - 통합 물놀이 데이터 모델

// 기본 좌표 타입
export interface Coordinates {
  latitude: number
  longitude: number
}

// 접근성 정보
export interface AccessibilityInfo {
  parkingAvailable: boolean
  publicTransport: boolean
  wheelchairAccessible: boolean
  nearestStation?: string
  parkingCapacity?: number
}

// 안전 정보
export interface SafetyInfo {
  lifeguard: boolean
  emergencyContact: string
  hazards: string[]
  safetyEquipment: string[]
  restrictions?: string[]
}

// 실시간 데이터
export interface RealTimeData {
  lastUpdated: Date
  currentVisitors?: number
  crowdLevel?: 'low' | 'medium' | 'high'
  status: 'open' | 'closed' | 'warning'
  alerts?: string[]
}

// 운영 정보
export interface OperatingInfo {
  openTime?: string
  closeTime?: string
  season: {
    start: string  // MM-DD format
    end: string    // MM-DD format
  }
  admission?: {
    adult: number
    child: number
    free: boolean
  }
}

// ============= 기본 물놀이 장소 인터페이스 =============
export interface WaterLocation {
  id: string
  type: 'beach' | 'valley' | 'mudflat' | 'marine_sports'
  name: string
  nameEn?: string
  region: string  // 부산, 경남, 울산 등
  district: string // 해운대구, 기장군 등
  address: string
  coordinates: Coordinates
  description?: string
  images: string[]
  accessibility: AccessibilityInfo
  safetyInfo: SafetyInfo
  operatingInfo: OperatingInfo
  realTimeData?: RealTimeData
  tags: string[]
  rating?: number
  reviews?: number
}

// ============= 해수욕장 데이터 =============
export interface BeachData extends WaterLocation {
  type: 'beach'
  beachInfo: {
    length: number  // 해변 길이 (m)
    width: number   // 해변 폭 (m)
    sandType: 'fine' | 'coarse' | 'pebble' | 'mixed'
    facilities: BeachFacility[]
    waterQuality: WaterQuality
  }
  activities: BeachActivity[]
}

export interface BeachFacility {
  type: 'shower' | 'toilet' | 'changing_room' | 'shade' | 'rental' | 'food'
  count?: number
  location?: string
  fee?: boolean
}

export interface BeachActivity {
  type: 'swimming' | 'surfing' | 'volleyball' | 'camping' | 'fishing'
  available: boolean
  bestTime?: string
  restrictions?: string[]
}

// ============= 계곡 데이터 =============
export interface ValleyData extends WaterLocation {
  type: 'valley'
  valleyInfo: {
    waterSource: string  // 발원지
    length: number       // 계곡 길이 (km)
    averageDepth: number // 평균 수심 (m)
    maxDepth: number     // 최대 수심 (m)
    rockFormation: boolean
    waterfall: boolean
    campingAllowed: boolean
  }
  waterCondition: {
    quality: WaterQuality
    temperature: number
    flowRate: 'slow' | 'moderate' | 'fast'
    clarity: 'clear' | 'normal' | 'murky'
  }
  nearbyFacilities: ValleyFacility[]
}

export interface ValleyFacility {
  type: 'parking' | 'toilet' | 'store' | 'restaurant' | 'camping'
  distance: number  // 거리 (m)
  name?: string
  contact?: string
}

// ============= 갯벌 데이터 =============
export interface MudflatData extends WaterLocation {
  type: 'mudflat'
  mudflatInfo: {
    area: number  // 면적 (㎡)
    mudType: 'sandy' | 'muddy' | 'mixed' | 'rocky'
    tidalRange: number  // 조수간만의 차 (m)
    ecologicalGrade: 'excellent' | 'good' | 'normal'
  }
  tideSchedule: TideInfo[]
  marineLife: MarineLifeInfo[]
  experiencePrograms: ExperienceProgram[]
}

export interface TideInfo {
  date: string
  highTide: TideTime[]
  lowTide: TideTime[]
  bestVisitTime: string
}

export interface TideTime {
  time: string
  height: number
}

export interface MarineLifeInfo {
  species: string
  koreanName: string
  season: string[]
  rarity: 'common' | 'uncommon' | 'rare'
}

export interface ExperienceProgram {
  id: string
  name: string
  duration: number  // 시간
  price: number
  minAge?: number
  maxParticipants: number
  includes: string[]
  schedule: string[]
  reservation: 'required' | 'recommended' | 'not_needed'
}

// ============= 해양 스포츠 데이터 =============
export interface MarineSportsData extends WaterLocation {
  type: 'marine_sports'
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

export interface SportActivity {
  type: 'surfing' | 'kayaking' | 'paddleboard' | 'snorkeling' | 'diving' | 'jetski' | 'windsurfing' | 'kitesurfing'
  available: boolean
  difficulty: 'easy' | 'moderate' | 'hard'
  bestConditions: {
    waveHeight?: { min: number; max: number }
    windSpeed?: { min: number; max: number }
    visibility?: number
    waterTemp?: { min: number; max: number }
  }
}

export interface WeatherRequirement {
  waveHeight: { ideal: number; max: number }
  windSpeed: { ideal: number; max: number }
  windDirection: string[]
  visibility: number
  waterTemperature: { min: number; ideal: number }
}

export interface RentalService {
  shopName: string
  equipment: RentalEquipment[]
  contact: string
  hours: string
  location: string
  reservation: boolean
}

export interface RentalEquipment {
  type: string
  pricePerHour: number
  pricePerDay: number
  sizeAvailable: string[]
  condition: 'new' | 'good' | 'fair'
}

export interface LessonProgram {
  type: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  groupSize: number
  price: number
  instructor: {
    certified: boolean
    languages: string[]
  }
  includes: string[]
}

export interface Amenity {
  type: 'shower' | 'locker' | 'parking' | 'restaurant' | 'accommodation'
  distance: number
  name?: string
  price?: string
}

// ============= 공통 타입 =============
export interface WaterQuality {
  grade: 'excellent' | 'good' | 'fair' | 'poor'
  ph?: number
  do?: number  // 용존산소
  bod?: number  // 생화학적 산소요구량
  bacteria?: number
  lastTested: Date
}

// ============= 추천 시스템 타입 =============
export interface WaterActivityRecommendation {
  location: WaterLocation
  matchScore: number
  matchReasons: string[]
  weather: WeatherInfo
  distance: number
  estimatedTime: number
  recommendation: 'highly_recommended' | 'recommended' | 'possible' | 'not_recommended'
}

export interface WeatherInfo {
  temperature: number
  waterTemperature?: number
  waveHeight?: number
  windSpeed: number
  windDirection: string
  humidity: number
  visibility: number
  precipitation: number
  description: string
  icon: string
  uv: number
}

// ============= 사용자 선호도 (확장) =============
export interface UserActivityPreferences {
  activityTypes: ('beach' | 'valley' | 'mudflat' | 'marine_sports')[]
  purpose: string[]  // ['relaxation', 'adventure', 'family', 'photography', 'exercise']
  waterTempPreference: 'cold' | 'moderate' | 'warm' | 'any'
  crowdSensitivity: 'prefer_crowded' | 'moderate' | 'prefer_quiet'
  maxDistance: number
  experienceLevel: 'beginner' | 'intermediate' | 'expert'
  budget: 'free' | 'budget' | 'moderate' | 'premium'
  accessibility: {
    needsParking: boolean
    publicTransportOnly: boolean
    wheelchairAccess: boolean
  }
}