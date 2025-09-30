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
   * 매칭 점수 계산 - 고도화된 알고리즘
   */
  private calculateMatchScore(
    location: WaterLocation,
    preferences: UserActivityPreferences,
    weather: WeatherInfo
  ): { score: number; reasons: string[] } {
    let score = 30 // 기본 점수
    const reasons: string[] = []
    const weights = this.getWeightsByPurpose(preferences.purpose)

    // 1. 날씨 점수 (가중치 적용, 최대 20점)
    const weatherScore = this.calculateWeatherScore(weather, location, preferences)
    score += weatherScore.score * weights.weather
    if (weatherScore.reason) reasons.push(weatherScore.reason)

    // 2. 활동 적합성 점수 (최대 25점)
    const activityScore = this.calculateActivityScore(location, preferences)
    score += activityScore.score * weights.activity
    if (activityScore.reasons.length > 0) reasons.push(...activityScore.reasons)

    // 3. 혼잡도 선호 매칭 (최대 15점)
    if (location.realTimeData?.crowdLevel) {
      const crowdMatch = this.matchCrowdPreference(
        location.realTimeData.crowdLevel,
        preferences.crowdSensitivity
      )
      score += crowdMatch * weights.crowd
      if (crowdMatch > 10) {
        reasons.push('선호하는 혼잡도')
      }
    }

    // 4. 동행인 타입 매칭 (최대 10점)
    const companionScore = this.calculateCompanionScore(location, preferences.companionType)
    score += companionScore.score
    if (companionScore.reason) reasons.push(companionScore.reason)

    // 5. 시간대 매칭 (최대 10점)
    const timeScore = this.calculateTimeScore(location, preferences.preferredTime)
    score += timeScore.score
    if (timeScore.reason) reasons.push(timeScore.reason)

    // 6. 예산 적합성 (최대 10점)
    const budgetScore = this.calculateBudgetScore(location, preferences.budgetRange)
    score += budgetScore.score
    if (budgetScore.reason) reasons.push(budgetScore.reason)

    // 7. 접근성 및 특별 요구사항 (최대 10점)
    const accessScore = this.calculateAccessibilityScore(location, preferences)
    score += accessScore.score
    if (accessScore.reasons.length > 0) reasons.push(...accessScore.reasons)

    // 8. 평점 및 인기도 반영
    if (location.rating) {
      if (location.rating >= 4.7) {
        score += 5
        reasons.push('⭐ 최고 평점')
      } else if (location.rating >= 4.5) {
        score += 3
        reasons.push('높은 평점')
      }
    }

    // 9. 연령대별 보너스 점수
    const ageBonus = this.getAgeBonusScore(location, preferences.ageGroup)
    score += ageBonus.score
    if (ageBonus.reason) reasons.push(ageBonus.reason)

    return { score: Math.min(100, Math.round(score)), reasons }
  }

  // 목적별 가중치 계산
  private getWeightsByPurpose(purpose: string) {
    const weights: Record<string, { weather: number; activity: number; crowd: number }> = {
      swimming: { weather: 1.2, activity: 1.0, crowd: 0.8 },
      surfing: { weather: 1.5, activity: 1.3, crowd: 0.5 },
      family: { weather: 0.8, activity: 1.2, crowd: 1.0 },
      walking: { weather: 1.0, activity: 0.5, crowd: 0.8 },
    }
    return weights[purpose] || { weather: 1.0, activity: 1.0, crowd: 1.0 }
  }

  // 날씨 점수 계산
  private calculateWeatherScore(weather: WeatherInfo, location: WaterLocation, preferences: UserActivityPreferences) {
    let score = 0
    let reason = ''

    // 날씨 상태
    if (weather.description === '맑음' || weather.description === '구름조금') {
      score += 15
      reason = '☀️ 완벽한 날씨'
    } else if (weather.description === '흐림') {
      score += 8
      reason = '구름 있지만 활동 가능'
    }

    // 물 온도 선호도 매칭
    if (weather.waterTemperature) {
      if (preferences.waterTempPreference === 'warm' && weather.waterTemperature >= 24) {
        score += 5
      } else if (preferences.waterTempPreference === 'moderate' && weather.waterTemperature >= 20 && weather.waterTemperature < 24) {
        score += 5
      } else if (preferences.waterTempPreference === 'cold' && weather.waterTemperature < 20) {
        score += 5
      }
    }

    return { score, reason }
  }

  // 활동 점수 계산
  private calculateActivityScore(location: WaterLocation, preferences: UserActivityPreferences) {
    let score = 0
    const reasons: string[] = []

    // 선호 활동들과 장소 매칭
    if (preferences.preferredActivities?.length > 0) {
      let matchCount = 0
      preferences.preferredActivities.forEach((activity: string) => {
        if (location.tags?.includes(activity) ||
            (location.type === 'beach' && ['swimming', 'surfing', 'volleyball'].includes(activity)) ||
            (location.type === 'valley' && ['camping', 'fishing'].includes(activity)) ||
            (location.type === 'marine_sports' && ['surfing', 'kayaking', 'snorkeling'].includes(activity))) {
          matchCount++
        }
      })

      if (matchCount > 0) {
        score += Math.min(25, matchCount * 8)
        reasons.push(`🎯 ${matchCount}개 활동 가능`)
      }
    }

    return { score, reasons }
  }

  // 동행인 타입 점수 계산
  private calculateCompanionScore(location: WaterLocation, companionType?: string) {
    let score = 0
    let reason = ''

    if (!companionType) return { score, reason }

    switch (companionType) {
      case 'family':
        if (location.accessibility.babyFacilities || location.tags?.includes('가족')) {
          score = 10
          reason = '👨‍👩‍👧 가족 친화적'
        }
        break
      case 'couple':
        if (location.tags?.includes('로맨틱') || location.tags?.includes('조용')) {
          score = 10
          reason = '💑 커플 추천'
        }
        break
      case 'friends':
        if (location.tags?.includes('액티비티') || location.tags?.includes('파티')) {
          score = 10
          reason = '👥 친구들과 즐기기 좋음'
        }
        break
      case 'solo':
        if (location.tags?.includes('힐링') || location.tags?.includes('조용')) {
          score = 10
          reason = '🚶 혼자 가기 좋음'
        }
        break
    }

    return { score, reason }
  }

  // 시간대 점수 계산
  private calculateTimeScore(location: WaterLocation, preferredTime?: string) {
    let score = 0
    let reason = ''

    if (!preferredTime) return { score, reason }

    // 시간대별 최적 장소 매칭
    switch (preferredTime) {
      case 'morning':
        if (location.tags?.includes('일출') || location.tags?.includes('조깅')) {
          score = 10
          reason = '🌅 아침 방문 추천'
        }
        break
      case 'evening':
        if (location.tags?.includes('일몰') || location.tags?.includes('야경')) {
          score = 10
          reason = '🌆 저녁 방문 추천'
        }
        break
      case 'night':
        if (location.tags?.includes('야간개장') || location.tags?.includes('나이트')) {
          score = 10
          reason = '🌙 야간 활동 가능'
        }
        break
    }

    return { score, reason }
  }

  // 예산 점수 계산
  private calculateBudgetScore(location: WaterLocation, budgetRange?: string) {
    let score = 0
    let reason = ''

    if (!budgetRange) return { score, reason }

    const isFree = !location.operatingInfo?.admission?.free === false
    const admissionCost = location.operatingInfo?.admission?.adult || 0

    switch (budgetRange) {
      case 'free':
        if (isFree || admissionCost === 0) {
          score = 10
          reason = '🆓 무료 입장'
        }
        break
      case 'budget':
        if (admissionCost <= 20000) {
          score = 10
          reason = '💰 저렴한 비용'
        }
        break
      case 'moderate':
        if (admissionCost <= 50000) {
          score = 8
          reason = '💵 적정 가격'
        }
        break
      case 'premium':
        score = 10 // 프리미엄은 가격 제한 없음
        if (location.tags?.includes('럭셔리')) {
          reason = '💎 프리미엄 체험'
        }
        break
    }

    return { score, reason }
  }

  // 접근성 점수 계산
  private calculateAccessibilityScore(location: WaterLocation, preferences: UserActivityPreferences) {
    let score = 0
    const reasons: string[] = []

    // 특별 요구사항 체크
    if (preferences.specialNeeds) {
      if (preferences.specialNeeds.petFriendly && location.tags?.includes('펫프렌들리')) {
        score += 3
        reasons.push('🐕 반려동물 가능')
      }
      if (preferences.specialNeeds.wheelchairAccess && location.accessibility.wheelchairAccessible) {
        score += 3
        reasons.push('♿ 휠체어 접근 가능')
      }
      if (preferences.specialNeeds.babyFacilities && location.accessibility.babyFacilities) {
        score += 2
        reasons.push('👶 유아시설 완비')
      }
      if (preferences.specialNeeds.seniorFriendly && location.tags?.includes('시니어')) {
        score += 2
        reasons.push('👴 어르신 친화')
      }
    }

    return { score, reasons }
  }

  // 연령대별 보너스 점수
  private getAgeBonusScore(location: WaterLocation, ageGroup?: string) {
    let score = 0
    let reason = ''

    if (!ageGroup) return { score, reason }

    switch (ageGroup) {
      case 'teens':
      case 'twenties':
        if (location.tags?.includes('젊음') || location.tags?.includes('액티브')) {
          score = 5
          reason = '🎉 젊은 층 인기'
        }
        break
      case 'thirties':
      case 'forties':
        if (location.tags?.includes('가족') || location.tags?.includes('편안')) {
          score = 5
          reason = '🏖️ 중년층 선호'
        }
        break
      case 'fifties':
      case 'sixties_plus':
        if (location.tags?.includes('조용') || location.tags?.includes('휴양')) {
          score = 5
          reason = '🌊 시니어 추천'
        }
        break
    }

    return { score, reason }
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