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
  purpose: 'swimming' | 'surfing' | 'family' | 'walking'
  waterTempPreference: 'cold' | 'moderate' | 'warm'
  crowdSensitivity: 'low' | 'medium' | 'high'
  maxDistance: number
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