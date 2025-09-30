// 해양 스포츠 데이터 어댑터

import {
  MarineSportsData,
  SportActivity,
  WeatherRequirement,
  RentalService,
  RentalEquipment,
  LessonProgram,
  Amenity
} from '@/types/water-activities'
import axios from 'axios'

export class MarineSportsAdapter {
  private apiUrl = process.env.NEXT_PUBLIC_MARINE_SPORTS_API_URL || ''
  private apiKey = process.env.NEXT_PUBLIC_MARINE_SPORTS_API_KEY || ''

  /**
   * 해양 스포츠 장소 목록 가져오기
   */
  async getLocations(): Promise<MarineSportsData[]> {
    try {
      // TODO: 실제 API 호출 구현
      // const response = await axios.get(`${this.apiUrl}/marine-sports`, {
      //   params: {
      //     apiKey: this.apiKey,
      //     region: '부산'
      //   }
      // })
      // return this.transformMarineSportsData(response.data)

      // Mock 데이터 반환
      return this.getMockMarineSportsData()
    } catch (error) {
      console.error('Error fetching marine sports locations:', error)
      return this.getMockMarineSportsData()
    }
  }

  /**
   * 해양 스포츠 장소 상세 정보 가져오기
   */
  async getLocationDetail(id: string): Promise<MarineSportsData | null> {
    try {
      const locations = await this.getLocations()
      return locations.find(location => location.id === id) || null
    } catch (error) {
      console.error('Error fetching marine sports detail:', error)
      return null
    }
  }

  /**
   * 날씨 조건에 따른 활동 가능 여부 확인
   */
  checkActivityAvailability(
    activity: SportActivity,
    currentWeather: {
      waveHeight?: number
      windSpeed?: number
      visibility?: number
      waterTemp?: number
    }
  ): { available: boolean; reasons: string[] } {
    const reasons: string[] = []
    let available = true

    if (activity.bestConditions.waveHeight) {
      if (currentWeather.waveHeight !== undefined) {
        if (currentWeather.waveHeight < activity.bestConditions.waveHeight.min ||
            currentWeather.waveHeight > activity.bestConditions.waveHeight.max) {
          available = false
          reasons.push('파고 조건 부적합')
        }
      }
    }

    if (activity.bestConditions.windSpeed) {
      if (currentWeather.windSpeed !== undefined) {
        if (currentWeather.windSpeed < activity.bestConditions.windSpeed.min ||
            currentWeather.windSpeed > activity.bestConditions.windSpeed.max) {
          available = false
          reasons.push('풍속 조건 부적합')
        }
      }
    }

    if (activity.bestConditions.visibility) {
      if (currentWeather.visibility !== undefined) {
        if (currentWeather.visibility < activity.bestConditions.visibility) {
          available = false
          reasons.push('시야 불량')
        }
      }
    }

    if (activity.bestConditions.waterTemp) {
      if (currentWeather.waterTemp !== undefined) {
        if (currentWeather.waterTemp < activity.bestConditions.waterTemp.min ||
            currentWeather.waterTemp > activity.bestConditions.waterTemp.max) {
          available = false
          reasons.push('수온 부적합')
        }
      }
    }

    return { available, reasons }
  }

  /**
   * Mock 데이터 생성
   */
  private getMockMarineSportsData(): MarineSportsData[] {
    return [
      {
        id: 'marine-1',
        type: 'marine_sports',
        name: '송정 서핑 스팟',
        nameEn: 'Songjeong Surfing Spot',
        region: '부산',
        district: '해운대구',
        address: '부산광역시 해운대구 송정해변로 62',
        coordinates: { latitude: 35.1789, longitude: 129.1997 },
        description: '부산 최고의 서핑 명소로, 사계절 서핑이 가능하며 다양한 서핑샵과 강습 프로그램이 있습니다.',
        images: ['/images/songjeong-surfing.jpg'],
        accessibility: {
          parkingAvailable: true,
          publicTransport: true,
          wheelchairAccessible: false,
          nearestStation: '송정역',
          parkingCapacity: 200
        },
        safetyInfo: {
          lifeguard: true,
          emergencyContact: '119',
          hazards: ['강한 파도', '암초 지대', '해파리'],
          safetyEquipment: ['구명조끼 대여', '응급처치 키트'],
          restrictions: ['악천후 시 활동 금지', '초보자 구역 제한']
        },
        operatingInfo: {
          season: { start: '01-01', end: '12-31' },
          admission: { adult: 0, child: 0, free: true }
        },
        realTimeData: {
          lastUpdated: new Date(),
          currentVisitors: 150,
          crowdLevel: 'medium',
          status: 'open',
          alerts: ['오늘 오후 파도 높이 증가 예상']
        },
        tags: ['서핑', 'SUP', '일출', '사계절'],
        rating: 4.8,
        reviews: 3421,
        sportsInfo: {
          mainActivities: [
            {
              type: 'surfing',
              available: true,
              difficulty: 'moderate',
              bestConditions: {
                waveHeight: { min: 0.5, max: 3.0 },
                windSpeed: { min: 5, max: 20 },
                waterTemp: { min: 10, max: 28 }
              }
            },
            {
              type: 'paddleboard',
              available: true,
              difficulty: 'easy',
              bestConditions: {
                waveHeight: { min: 0, max: 1.0 },
                windSpeed: { min: 0, max: 15 },
                waterTemp: { min: 15, max: 30 }
              }
            },
            {
              type: 'kayaking',
              available: true,
              difficulty: 'easy',
              bestConditions: {
                waveHeight: { min: 0, max: 1.5 },
                windSpeed: { min: 0, max: 20 }
              }
            }
          ] as SportActivity[],
          waterDepth: { min: 1.5, max: 5.0 },
          bestSeason: ['봄', '여름', '가을'],
          suitableFor: ['beginner', 'intermediate', 'advanced']
        },
        weatherRequirements: {
          waveHeight: { ideal: 1.5, max: 3.0 },
          windSpeed: { ideal: 10, max: 25 },
          windDirection: ['E', 'SE', 'S'],
          visibility: 5,
          waterTemperature: { min: 14, ideal: 22 }
        } as WeatherRequirement,
        rentalServices: [
          {
            shopName: '송정 서프샵',
            equipment: [
              {
                type: '서핑보드',
                pricePerHour: 10000,
                pricePerDay: 40000,
                sizeAvailable: ['5.8', '6.0', '7.0', '8.0', '9.0'],
                condition: 'good'
              },
              {
                type: '웻슈트',
                pricePerHour: 5000,
                pricePerDay: 20000,
                sizeAvailable: ['XS', 'S', 'M', 'L', 'XL'],
                condition: 'good'
              }
            ] as RentalEquipment[],
            contact: '051-701-1234',
            hours: '06:00 - 20:00',
            location: '송정해변 입구',
            reservation: true
          }
        ] as RentalService[],
        lessons: [
          {
            type: '서핑 입문',
            level: 'beginner',
            duration: 2,
            groupSize: 6,
            price: 50000,
            instructor: {
              certified: true,
              languages: ['한국어', '영어']
            },
            includes: ['보드 대여', '웻슈트', '보험', '사진 촬영']
          },
          {
            type: '서핑 중급',
            level: 'intermediate',
            duration: 3,
            groupSize: 4,
            price: 80000,
            instructor: {
              certified: true,
              languages: ['한국어', '영어', '일본어']
            },
            includes: ['보드 대여', '웻슈트', '비디오 분석', '개인 피드백']
          }
        ] as LessonProgram[],
        nearbyAmenities: [
          { type: 'shower', distance: 0, name: '공용 샤워장' },
          { type: 'locker', distance: 50, name: '서프샵 락커', price: '5000원/일' },
          { type: 'parking', distance: 100 },
          { type: 'restaurant', distance: 200, name: '서퍼스 키친' }
        ] as Amenity[]
      },
      {
        id: 'marine-2',
        type: 'marine_sports',
        name: '광안리 수상레저 센터',
        nameEn: 'Gwangalli Marine Sports Center',
        region: '부산',
        district: '수영구',
        address: '부산광역시 수영구 광안해변로 219',
        coordinates: { latitude: 35.1531, longitude: 129.1187 },
        description: '광안대교를 배경으로 제트스키, 바나나보트 등 다양한 수상 레저를 즐길 수 있는 센터입니다.',
        images: ['/images/gwangalli-marine.jpg'],
        accessibility: {
          parkingAvailable: true,
          publicTransport: true,
          wheelchairAccessible: true,
          nearestStation: '광안역',
          parkingCapacity: 300
        },
        safetyInfo: {
          lifeguard: true,
          emergencyContact: '119',
          hazards: ['선박 통행 구역', '조류'],
          safetyEquipment: ['구명조끼 필수 착용', '무전기'],
          restrictions: ['음주 시 이용 불가', '12세 미만 보호자 동반']
        },
        operatingInfo: {
          openTime: '09:00',
          closeTime: '18:00',
          season: { start: '05-01', end: '10-31' },
          admission: { adult: 0, child: 0, free: true }
        },
        realTimeData: {
          lastUpdated: new Date(),
          currentVisitors: 200,
          crowdLevel: 'high',
          status: 'open'
        },
        tags: ['제트스키', '바나나보트', '광안대교', '야경'],
        rating: 4.5,
        reviews: 2156,
        sportsInfo: {
          mainActivities: [
            {
              type: 'jetski',
              available: true,
              difficulty: 'easy',
              bestConditions: {
                waveHeight: { min: 0, max: 1.5 },
                windSpeed: { min: 0, max: 20 },
                visibility: 3
              }
            },
            {
              type: 'kayaking',
              available: true,
              difficulty: 'easy',
              bestConditions: {
                waveHeight: { min: 0, max: 1.0 },
                windSpeed: { min: 0, max: 15 }
              }
            },
            {
              type: 'windsurfing',
              available: true,
              difficulty: 'hard',
              bestConditions: {
                windSpeed: { min: 10, max: 25 },
                waveHeight: { min: 0.5, max: 2.0 }
              }
            }
          ] as SportActivity[],
          waterDepth: { min: 2.0, max: 8.0 },
          bestSeason: ['여름', '가을'],
          suitableFor: ['beginner', 'intermediate']
        },
        weatherRequirements: {
          waveHeight: { ideal: 0.5, max: 1.5 },
          windSpeed: { ideal: 8, max: 20 },
          windDirection: ['S', 'SW', 'W'],
          visibility: 5,
          waterTemperature: { min: 18, ideal: 24 }
        } as WeatherRequirement,
        rentalServices: [
          {
            shopName: '광안 마린 스포츠',
            equipment: [
              {
                type: '제트스키',
                pricePerHour: 80000,
                pricePerDay: 0,
                sizeAvailable: ['1인승', '2인승'],
                condition: 'new'
              },
              {
                type: '카약',
                pricePerHour: 20000,
                pricePerDay: 60000,
                sizeAvailable: ['1인용', '2인용'],
                condition: 'good'
              }
            ] as RentalEquipment[],
            contact: '051-755-5678',
            hours: '09:00 - 18:00',
            location: '광안리 해변 중앙',
            reservation: true
          }
        ] as RentalService[],
        lessons: [
          {
            type: '제트스키 면허 취득',
            level: 'beginner',
            duration: 20,
            groupSize: 10,
            price: 350000,
            instructor: {
              certified: true,
              languages: ['한국어']
            },
            includes: ['교재', '실습', '시험 응시료']
          }
        ] as LessonProgram[],
        nearbyAmenities: [
          { type: 'shower', distance: 50 },
          { type: 'parking', distance: 100 },
          { type: 'restaurant', distance: 150, name: '광안리 횟집거리' }
        ] as Amenity[]
      },
      {
        id: 'marine-3',
        type: 'marine_sports',
        name: '기장 스노클링 포인트',
        nameEn: 'Gijang Snorkeling Point',
        region: '부산',
        district: '기장군',
        address: '부산광역시 기장군 기장읍 연화리',
        coordinates: { latitude: 35.2234, longitude: 129.2134 },
        description: '맑은 물과 다양한 해양 생물을 관찰할 수 있는 스노클링 명소입니다.',
        images: ['/images/gijang-snorkeling.jpg'],
        accessibility: {
          parkingAvailable: true,
          publicTransport: false,
          wheelchairAccessible: false,
          parkingCapacity: 50
        },
        safetyInfo: {
          lifeguard: false,
          emergencyContact: '119',
          hazards: ['조류', '암초', '성게'],
          safetyEquipment: ['부표 설치'],
          restrictions: ['단독 입수 금지', '야간 활동 금지']
        },
        operatingInfo: {
          openTime: '08:00',
          closeTime: '17:00',
          season: { start: '06-01', end: '09-30' },
          admission: { adult: 10000, child: 5000, free: false }
        },
        realTimeData: {
          lastUpdated: new Date(),
          currentVisitors: 30,
          crowdLevel: 'low',
          status: 'open'
        },
        tags: ['스노클링', '다이빙', '해양생물', '청정해역'],
        rating: 4.6,
        reviews: 876,
        sportsInfo: {
          mainActivities: [
            {
              type: 'snorkeling',
              available: true,
              difficulty: 'easy',
              bestConditions: {
                visibility: 10,
                waveHeight: { min: 0, max: 1.0 },
                waterTemp: { min: 18, max: 26 }
              }
            },
            {
              type: 'diving',
              available: true,
              difficulty: 'moderate',
              bestConditions: {
                visibility: 15,
                waveHeight: { min: 0, max: 1.5 },
                waterTemp: { min: 16, max: 26 }
              }
            }
          ] as SportActivity[],
          waterDepth: { min: 2.0, max: 15.0 },
          bestSeason: ['여름', '초가을'],
          suitableFor: ['beginner', 'intermediate', 'advanced']
        },
        weatherRequirements: {
          waveHeight: { ideal: 0.5, max: 1.0 },
          windSpeed: { ideal: 5, max: 15 },
          windDirection: ['E', 'SE'],
          visibility: 10,
          waterTemperature: { min: 18, ideal: 23 }
        } as WeatherRequirement,
        rentalServices: [
          {
            shopName: '기장 다이브 센터',
            equipment: [
              {
                type: '스노클링 세트',
                pricePerHour: 10000,
                pricePerDay: 30000,
                sizeAvailable: ['S', 'M', 'L', 'XL'],
                condition: 'good'
              },
              {
                type: '다이빙 장비',
                pricePerHour: 30000,
                pricePerDay: 100000,
                sizeAvailable: ['S', 'M', 'L', 'XL'],
                condition: 'good'
              }
            ] as RentalEquipment[],
            contact: '051-724-9876',
            hours: '08:00 - 17:00',
            location: '포인트 입구',
            reservation: true
          }
        ] as RentalService[],
        lessons: [
          {
            type: '스노클링 체험',
            level: 'beginner',
            duration: 1,
            groupSize: 8,
            price: 40000,
            instructor: {
              certified: true,
              languages: ['한국어', '영어']
            },
            includes: ['장비 대여', '안전 교육', '수중 가이드']
          },
          {
            type: '오픈워터 다이빙',
            level: 'beginner',
            duration: 24,
            groupSize: 4,
            price: 450000,
            instructor: {
              certified: true,
              languages: ['한국어']
            },
            includes: ['PADI 자격증', '장비 대여', '교재', '수중 사진']
          }
        ] as LessonProgram[],
        nearbyAmenities: [
          { type: 'shower', distance: 100, name: '간이 샤워장' },
          { type: 'parking', distance: 0 },
          { type: 'restaurant', distance: 500, name: '해녀의 집' }
        ] as Amenity[]
      }
    ]
  }

  /**
   * 특정 활동에 최적화된 장소 찾기
   */
  async findBestLocationForActivity(
    activityType: SportActivity['type'],
    currentWeather?: any
  ): Promise<MarineSportsData[]> {
    const locations = await this.getLocations()

    return locations.filter(location => {
      const activity = location.sportsInfo.mainActivities.find(a => a.type === activityType)
      if (!activity || !activity.available) return false

      if (currentWeather) {
        const { available } = this.checkActivityAvailability(activity, currentWeather)
        return available
      }

      return true
    }).sort((a, b) => (b.rating || 0) - (a.rating || 0))
  }
}