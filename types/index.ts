export interface Beach {
  id: string
  name: string
  location: string
  latitude: number
  longitude: number
  description?: string
  facilities: string[]
  imageUrl?: string
}

export interface WeatherInfo {
  temperature: number
  waterTemperature: number
  waveHeight: number
  windSpeed: number
  windDirection: string
  humidity: number
  visibility: number
  description: string
  icon: 'sun' | 'cloud' | 'rain'
}

export interface UserPreferences {
  // 기존 필드
  purpose: 'swimming' | 'surfing' | 'family' | 'walking'
  waterTempPreference: 'cold' | 'moderate' | 'warm'
  crowdSensitivity: 'low' | 'medium' | 'high'
  maxDistance: number

  // 새로운 필드 추가
  ageGroup?: 'teens' | 'twenties' | 'thirties' | 'forties' | 'fifties' | 'sixties_plus'
  companionType?: 'solo' | 'couple' | 'family' | 'friends' | 'group'
  preferredActivities?: string[] // 복수 선택 가능한 활동들
  preferredTime?: 'morning' | 'afternoon' | 'evening' | 'night'
  budgetRange?: 'free' | 'budget' | 'moderate' | 'premium'
  specialNeeds?: {
    petFriendly?: boolean
    wheelchairAccess?: boolean
    babyFacilities?: boolean
    seniorFriendly?: boolean
  }
}

export interface BeachRecommendation {
  beach: Beach
  weather: WeatherInfo
  matchScore: number
  rating: number
  crowdLevel: 'low' | 'medium' | 'high'
  activities: string[]
  event?: Event
}

export interface Event {
  id: string
  name: string
  location: string
  date: string
  time: string
  description: string
  type: 'festival' | 'fireworks' | 'concert' | 'sports' | 'other'
}