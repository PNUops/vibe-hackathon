// 통합 물놀이 활동 API 서비스

import {
  WaterLocation,
  BeachData,
  ValleyData,
  MudflatData,
  MarineSportsData,
  WeatherInfo,
  WaterActivityRecommendation,
  UserActivityPreferences,
  Coordinates
} from '@/types/water-activities'

import { BeachAdapter } from '../adapters/BeachAdapter'
import { ValleyAdapter } from '../adapters/ValleyAdapter'
import { MudflatAdapter } from '../adapters/MudflatAdapter'
import { MarineSportsAdapter } from '../adapters/MarineSportsAdapter'
import { ApiCache } from '../cache/ApiCache'

export class WaterActivityService {
  private static instance: WaterActivityService
  private beachAdapter: BeachAdapter
  private valleyAdapter: ValleyAdapter
  private mudflatAdapter: MudflatAdapter
  private marineSportsAdapter: MarineSportsAdapter
  private cache: ApiCache

  private constructor() {
    this.beachAdapter = new BeachAdapter()
    this.valleyAdapter = new ValleyAdapter()
    this.mudflatAdapter = new MudflatAdapter()
    this.marineSportsAdapter = new MarineSportsAdapter()
    this.cache = new ApiCache()
  }

  public static getInstance(): WaterActivityService {
    if (!WaterActivityService.instance) {
      WaterActivityService.instance = new WaterActivityService()
    }
    return WaterActivityService.instance
  }

  /**
   * 모든 물놀이 장소 가져오기
   */
  async getAllLocations(): Promise<WaterLocation[]> {
    const cacheKey = 'all-locations'
    const cached = this.cache.get<WaterLocation[]>(cacheKey)

    if (cached) {
      return cached
    }

    try {
      const [beaches, valleys, mudflats, marineSports] = await Promise.all([
        this.beachAdapter.getLocations(),
        this.valleyAdapter.getLocations(),
        this.mudflatAdapter.getLocations(),
        this.marineSportsAdapter.getLocations()
      ])

      const allLocations = [...beaches, ...valleys, ...mudflats, ...marineSports]
      this.cache.set(cacheKey, allLocations, 300) // 5분 캐시

      return allLocations
    } catch (error) {
      console.error('Error fetching all locations:', error)
      throw error
    }
  }

  /**
   * 활동 유형별 장소 가져오기
   */
  async getLocationsByType(type: 'beach' | 'valley' | 'mudflat' | 'marine_sports'): Promise<WaterLocation[]> {
    const cacheKey = `locations-${type}`
    const cached = this.cache.get<WaterLocation[]>(cacheKey)

    if (cached) {
      return cached
    }

    let locations: WaterLocation[] = []

    switch (type) {
      case 'beach':
        locations = await this.beachAdapter.getLocations()
        break
      case 'valley':
        locations = await this.valleyAdapter.getLocations()
        break
      case 'mudflat':
        locations = await this.mudflatAdapter.getLocations()
        break
      case 'marine_sports':
        locations = await this.marineSportsAdapter.getLocations()
        break
    }

    this.cache.set(cacheKey, locations, 300)
    return locations
  }

  /**
   * 특정 장소 상세 정보 가져오기
   */
  async getLocationDetail(id: string, type: string): Promise<WaterLocation | null> {
    const cacheKey = `location-detail-${id}`
    const cached = this.cache.get<WaterLocation>(cacheKey)

    if (cached) {
      return cached
    }

    let location: WaterLocation | null = null

    switch (type) {
      case 'beach':
        location = await this.beachAdapter.getLocationDetail(id)
        break
      case 'valley':
        location = await this.valleyAdapter.getLocationDetail(id)
        break
      case 'mudflat':
        location = await this.mudflatAdapter.getLocationDetail(id)
        break
      case 'marine_sports':
        location = await this.marineSportsAdapter.getLocationDetail(id)
        break
    }

    if (location) {
      this.cache.set(cacheKey, location, 600) // 10분 캐시
    }

    return location
  }

  /**
   * 날씨 정보 가져오기
   */
  async getWeatherInfo(coordinates: Coordinates): Promise<WeatherInfo> {
    const cacheKey = `weather-${coordinates.latitude}-${coordinates.longitude}`
    const cached = this.cache.get<WeatherInfo>(cacheKey)

    if (cached) {
      return cached
    }

    // TODO: 실제 날씨 API 호출 구현
    // 현재는 Mock 데이터 반환
    const weather: WeatherInfo = {
      temperature: 26,
      waterTemperature: 24,
      waveHeight: 0.8,
      windSpeed: 3.5,
      windDirection: 'E',
      humidity: 65,
      visibility: 10,
      precipitation: 0,
      description: '맑음',
      icon: 'sun',
      uv: 7
    }

    this.cache.set(cacheKey, weather, 600) // 10분 캐시
    return weather
  }

  /**
   * 추천 장소 가져오기
   */
  async getRecommendations(
    userPreferences: UserActivityPreferences,
    userLocation: Coordinates
  ): Promise<WaterActivityRecommendation[]> {
    // 모든 장소 가져오기
    const allLocations = await this.getAllLocations()

    // 사용자 선호 활동 유형 필터링
    const filteredByType = allLocations.filter(location =>
      userPreferences.activityTypes.includes(location.type)
    )

    // 거리 계산 및 필터링
    const locationsWithDistance = filteredByType.map(location => {
      const distance = this.calculateDistance(userLocation, location.coordinates)
      return { location, distance }
    }).filter(item => item.distance <= userPreferences.maxDistance)

    // 각 장소에 대한 추천 점수 계산
    const recommendations: WaterActivityRecommendation[] = await Promise.all(
      locationsWithDistance.map(async ({ location, distance }) => {
        const weather = await this.getWeatherInfo(location.coordinates)
        const { score, reasons } = this.calculateMatchScore(location, userPreferences, weather)

        return {
          location,
          matchScore: score,
          matchReasons: reasons,
          weather,
          distance,
          estimatedTime: Math.round(distance / 40 * 60), // 40km/h 평균 속도 가정
          recommendation: this.getRecommendationLevel(score)
        }
      })
    )

    // 점수 순으로 정렬
    recommendations.sort((a, b) => b.matchScore - a.matchScore)

    return recommendations.slice(0, 10) // 상위 10개만 반환
  }

  /**
   * 매칭 점수 계산
   */
  private calculateMatchScore(
    location: WaterLocation,
    preferences: UserActivityPreferences,
    weather: WeatherInfo
  ): { score: number; reasons: string[] } {
    let score = 50 // 기본 점수
    const reasons: string[] = []

    // 날씨 점수 (최대 20점)
    if (weather.description === '맑음' || weather.description === '구름조금') {
      score += 20
      reasons.push('완벽한 날씨')
    } else if (weather.description === '흐림') {
      score += 10
      reasons.push('무난한 날씨')
    }

    // 혼잡도 선호 매칭 (최대 15점)
    if (location.realTimeData?.crowdLevel) {
      const crowdMatch = this.matchCrowdPreference(
        location.realTimeData.crowdLevel,
        preferences.crowdSensitivity
      )
      score += crowdMatch
      if (crowdMatch > 10) {
        reasons.push('선호하는 혼잡도')
      }
    }

    // 접근성 점수 (최대 15점)
    if (preferences.accessibility.needsParking && location.accessibility.parkingAvailable) {
      score += 10
      reasons.push('주차 가능')
    }
    if (preferences.accessibility.publicTransportOnly && location.accessibility.publicTransport) {
      score += 10
      reasons.push('대중교통 접근 가능')
    }
    if (preferences.accessibility.wheelchairAccess && location.accessibility.wheelchairAccessible) {
      score += 15
      reasons.push('휠체어 접근 가능')
    }

    // 평점 반영
    if (location.rating && location.rating >= 4.5) {
      score += 10
      reasons.push('높은 평점')
    }

    return { score: Math.min(100, score), reasons }
  }

  /**
   * 혼잡도 선호 매칭
   */
  private matchCrowdPreference(
    crowdLevel: 'low' | 'medium' | 'high',
    preference: string
  ): number {
    const matchTable = {
      'prefer_quiet': { low: 15, medium: 7, high: 0 },
      'moderate': { low: 10, medium: 15, high: 10 },
      'prefer_crowded': { low: 0, medium: 7, high: 15 }
    }

    return matchTable[preference as keyof typeof matchTable]?.[crowdLevel] || 0
  }

  /**
   * 추천 레벨 결정
   */
  private getRecommendationLevel(score: number): 'highly_recommended' | 'recommended' | 'possible' | 'not_recommended' {
    if (score >= 80) return 'highly_recommended'
    if (score >= 60) return 'recommended'
    if (score >= 40) return 'possible'
    return 'not_recommended'
  }

  /**
   * 두 좌표 간 거리 계산 (Haversine formula)
   */
  private calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371 // 지구 반지름 (km)
    const dLat = this.toRad(coord2.latitude - coord1.latitude)
    const dLon = this.toRad(coord2.longitude - coord1.longitude)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(coord1.latitude)) *
      Math.cos(this.toRad(coord2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180)
  }

  /**
   * 근처 장소 검색
   */
  async getNearbyLocations(
    coordinates: Coordinates,
    radius: number = 10
  ): Promise<WaterLocation[]> {
    const allLocations = await this.getAllLocations()

    return allLocations
      .map(location => ({
        location,
        distance: this.calculateDistance(coordinates, location.coordinates)
      }))
      .filter(item => item.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .map(item => item.location)
  }

  /**
   * 인기 장소 가져오기
   */
  async getPopularLocations(limit: number = 10): Promise<WaterLocation[]> {
    const cacheKey = `popular-locations-${limit}`
    const cached = this.cache.get<WaterLocation[]>(cacheKey)

    if (cached) {
      return cached
    }

    const allLocations = await this.getAllLocations()

    // 평점과 리뷰 수를 기준으로 정렬
    const popular = allLocations
      .filter(location => location.rating && location.reviews)
      .sort((a, b) => {
        const scoreA = (a.rating || 0) * Math.log10((a.reviews || 0) + 1)
        const scoreB = (b.rating || 0) * Math.log10((b.reviews || 0) + 1)
        return scoreB - scoreA
      })
      .slice(0, limit)

    this.cache.set(cacheKey, popular, 3600) // 1시간 캐시
    return popular
  }
}