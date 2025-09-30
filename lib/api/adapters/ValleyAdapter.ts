// 계곡 데이터 어댑터

import { ValleyData, WaterQuality, ValleyFacility } from '@/types/water-activities'
import axios from 'axios'

export class ValleyAdapter {
  private apiUrl = process.env.NEXT_PUBLIC_VALLEY_API_URL || ''
  private apiKey = process.env.NEXT_PUBLIC_VALLEY_API_KEY || ''

  /**
   * 계곡 목록 가져오기
   */
  async getLocations(): Promise<ValleyData[]> {
    try {
      // TODO: 실제 API 호출 구현 (한국관광공사 TourAPI 등)
      // const response = await axios.get(`${this.apiUrl}/valleys`, {
      //   params: {
      //     apiKey: this.apiKey,
      //     region: '부산,경남'
      //   }
      // })
      // return this.transformValleyData(response.data)

      // Mock 데이터 반환
      return this.getMockValleyData()
    } catch (error) {
      console.error('Error fetching valley locations:', error)
      return this.getMockValleyData()
    }
  }

  /**
   * 계곡 상세 정보 가져오기
   */
  async getLocationDetail(id: string): Promise<ValleyData | null> {
    try {
      const valleys = await this.getLocations()
      return valleys.find(valley => valley.id === id) || null
    } catch (error) {
      console.error('Error fetching valley detail:', error)
      return null
    }
  }

  /**
   * Mock 데이터 생성
   */
  private getMockValleyData(): ValleyData[] {
    return [
      {
        id: 'valley-1',
        type: 'valley',
        name: '내원사 계곡',
        nameEn: 'Naewonsa Valley',
        region: '경남',
        district: '양산시',
        address: '경상남도 양산시 하북면 용연리',
        coordinates: { latitude: 35.3721, longitude: 129.0324 },
        description: '영남알프스 자락에 위치한 맑고 깨끗한 계곡으로, 여름철 피서지로 인기가 높습니다.',
        images: ['/images/naewonsa-valley.jpg'],
        accessibility: {
          parkingAvailable: true,
          publicTransport: false,
          wheelchairAccessible: false,
          parkingCapacity: 50
        },
        safetyInfo: {
          lifeguard: false,
          emergencyContact: '119',
          hazards: ['미끄러운 바위', '급류', '깊은 웅덩이'],
          safetyEquipment: ['구명튜브 대여 가능'],
          restrictions: ['우천시 입장 제한', '캠핑 금지']
        },
        operatingInfo: {
          season: { start: '06-01', end: '09-30' },
          admission: { adult: 3000, child: 1500, free: false }
        },
        realTimeData: {
          lastUpdated: new Date(),
          crowdLevel: 'low',
          status: 'open'
        },
        tags: ['트레킹', '물놀이', '사진촬영', '자연경관'],
        rating: 4.4,
        reviews: 892,
        valleyInfo: {
          waterSource: '천성산',
          length: 3.5,
          averageDepth: 0.8,
          maxDepth: 2.5,
          rockFormation: true,
          waterfall: true,
          campingAllowed: false
        },
        waterCondition: {
          quality: {
            grade: 'excellent',
            ph: 7.2,
            do: 9.5,
            bacteria: 5,
            lastTested: new Date()
          } as WaterQuality,
          temperature: 18,
          flowRate: 'moderate',
          clarity: 'clear'
        },
        nearbyFacilities: [
          { type: 'parking', distance: 100, name: '내원사 주차장' },
          { type: 'toilet', distance: 150 },
          { type: 'store', distance: 500, name: '용연마을 슈퍼' },
          { type: 'restaurant', distance: 300, name: '계곡식당', contact: '055-123-4567' }
        ] as ValleyFacility[]
      },
      {
        id: 'valley-2',
        type: 'valley',
        name: '홍룡폭포 계곡',
        nameEn: 'Hongryong Waterfall Valley',
        region: '경남',
        district: '양산시',
        address: '경상남도 양산시 상북면 홍룡리',
        coordinates: { latitude: 35.4102, longitude: 128.9876 },
        description: '홍룡폭포를 중심으로 형성된 계곡으로, 수심이 얕아 가족 단위 물놀이에 적합합니다.',
        images: ['/images/hongryong-valley.jpg'],
        accessibility: {
          parkingAvailable: true,
          publicTransport: true,
          wheelchairAccessible: false,
          nearestStation: '양산역',
          parkingCapacity: 100
        },
        safetyInfo: {
          lifeguard: false,
          emergencyContact: '119',
          hazards: ['폭포 주변 위험', '미끄러운 바위'],
          safetyEquipment: [],
          restrictions: ['폭포 아래 수영 금지']
        },
        operatingInfo: {
          season: { start: '05-01', end: '10-31' },
          admission: { adult: 2000, child: 1000, free: false }
        },
        realTimeData: {
          lastUpdated: new Date(),
          currentVisitors: 150,
          crowdLevel: 'medium',
          status: 'open'
        },
        tags: ['폭포', '가족', '피크닉', '등산'],
        rating: 4.6,
        reviews: 1243,
        valleyInfo: {
          waterSource: '천성산',
          length: 2.0,
          averageDepth: 0.5,
          maxDepth: 1.5,
          rockFormation: true,
          waterfall: true,
          campingAllowed: false
        },
        waterCondition: {
          quality: {
            grade: 'good',
            ph: 7.5,
            do: 9.0,
            bacteria: 10,
            lastTested: new Date()
          } as WaterQuality,
          temperature: 19,
          flowRate: 'slow',
          clarity: 'clear'
        },
        nearbyFacilities: [
          { type: 'parking', distance: 200, name: '홍룡폭포 주차장' },
          { type: 'toilet', distance: 250 },
          { type: 'store', distance: 100, name: '홍룡매점' },
          { type: 'restaurant', distance: 400, name: '폭포가든', contact: '055-234-5678' }
        ] as ValleyFacility[]
      },
      {
        id: 'valley-3',
        type: 'valley',
        name: '장안사 계곡',
        nameEn: 'Jangansa Valley',
        region: '부산',
        district: '기장군',
        address: '부산광역시 기장군 장안읍 장안리',
        coordinates: { latitude: 35.3456, longitude: 129.2345 },
        description: '불광산 자락의 맑은 계곡으로, 장안사와 함께 둘러보기 좋은 명소입니다.',
        images: ['/images/jangansa-valley.jpg'],
        accessibility: {
          parkingAvailable: true,
          publicTransport: false,
          wheelchairAccessible: false,
          parkingCapacity: 30
        },
        safetyInfo: {
          lifeguard: false,
          emergencyContact: '119',
          hazards: ['깊은 웅덩이', '급경사'],
          safetyEquipment: [],
          restrictions: ['음주 금지', '취사 금지']
        },
        operatingInfo: {
          season: { start: '06-15', end: '08-31' },
          admission: { adult: 0, child: 0, free: true }
        },
        realTimeData: {
          lastUpdated: new Date(),
          crowdLevel: 'low',
          status: 'open',
          alerts: ['최근 비로 인해 수위가 높습니다']
        },
        tags: ['사찰', '명상', '트레킹', '자연'],
        rating: 4.3,
        reviews: 567,
        valleyInfo: {
          waterSource: '불광산',
          length: 1.5,
          averageDepth: 0.6,
          maxDepth: 1.8,
          rockFormation: true,
          waterfall: false,
          campingAllowed: false
        },
        waterCondition: {
          quality: {
            grade: 'excellent',
            ph: 7.0,
            do: 9.8,
            bacteria: 3,
            lastTested: new Date()
          } as WaterQuality,
          temperature: 17,
          flowRate: 'moderate',
          clarity: 'clear'
        },
        nearbyFacilities: [
          { type: 'parking', distance: 300, name: '장안사 주차장' },
          { type: 'toilet', distance: 350 },
          { type: 'restaurant', distance: 500, name: '산채정식', contact: '051-345-6789' }
        ] as ValleyFacility[]
      }
    ]
  }

  /**
   * 수질 정보 가져오기 (환경부 API 연동 예정)
   */
  async getWaterQuality(valleyId: string): Promise<WaterQuality | null> {
    try {
      // TODO: 환경부 물환경정보시스템 API 연동
      // const response = await axios.get(`${waterQualityApiUrl}/quality`, {
      //   params: {
      //     locationId: valleyId,
      //     apiKey: this.apiKey
      //   }
      // })
      // return this.transformWaterQuality(response.data)

      // Mock 데이터 반환
      return {
        grade: 'excellent',
        ph: 7.2,
        do: 9.5,
        bod: 1.2,
        bacteria: 5,
        lastTested: new Date()
      }
    } catch (error) {
      console.error('Error fetching water quality:', error)
      return null
    }
  }

  /**
   * 실시간 수위 정보 가져오기 (한강홍수통제소 API 연동 예정)
   */
  async getWaterLevel(valleyId: string): Promise<number | null> {
    try {
      // TODO: 한강홍수통제소 API 연동
      // const response = await axios.get(`${waterLevelApiUrl}/level`, {
      //   params: {
      //     stationId: valleyId,
      //     apiKey: this.apiKey
      //   }
      // })
      // return response.data.waterLevel

      // Mock 데이터 반환
      return Math.random() * 1.5 + 0.5 // 0.5m ~ 2.0m
    } catch (error) {
      console.error('Error fetching water level:', error)
      return null
    }
  }
}