// 해수욕장 데이터 어댑터

import { BeachData, WaterQuality, BeachFacility, BeachActivity } from '@/types/water-activities'
import axios from 'axios'

export class BeachAdapter {
  private apiUrl = process.env.NEXT_PUBLIC_BEACH_API_URL || ''
  private apiKey = process.env.NEXT_PUBLIC_BEACH_API_KEY || ''

  /**
   * 해수욕장 목록 가져오기
   */
  async getLocations(): Promise<BeachData[]> {
    try {
      // TODO: 실제 API 호출 구현
      // const response = await axios.get(`${this.apiUrl}/beaches`, {
      //   params: { apiKey: this.apiKey }
      // })
      // return this.transformBeachData(response.data)

      // Mock 데이터 반환
      return this.getMockBeachData()
    } catch (error) {
      console.error('Error fetching beach locations:', error)
      return this.getMockBeachData()
    }
  }

  /**
   * 해수욕장 상세 정보 가져오기
   */
  async getLocationDetail(id: string): Promise<BeachData | null> {
    try {
      // TODO: 실제 API 호출 구현
      // const response = await axios.get(`${this.apiUrl}/beaches/${id}`, {
      //   params: { apiKey: this.apiKey }
      // })
      // return this.transformBeachDetail(response.data)

      const beaches = await this.getLocations()
      return beaches.find(beach => beach.id === id) || null
    } catch (error) {
      console.error('Error fetching beach detail:', error)
      return null
    }
  }

  /**
   * Mock 데이터 생성
   */
  private getMockBeachData(): BeachData[] {
    return [
      {
        id: 'beach-1',
        type: 'beach',
        name: '해운대 해수욕장',
        nameEn: 'Haeundae Beach',
        region: '부산',
        district: '해운대구',
        address: '부산광역시 해운대구 해운대해변로 264',
        coordinates: { latitude: 35.1587, longitude: 129.1604 },
        description: '부산을 대표하는 해수욕장으로 백사장 길이 1.5km, 너비 30~50m의 넓은 백사장이 특징입니다.',
        images: ['/images/haeundae-beach.jpg'],
        accessibility: {
          parkingAvailable: true,
          publicTransport: true,
          wheelchairAccessible: true,
          nearestStation: '해운대역',
          parkingCapacity: 1000
        },
        safetyInfo: {
          lifeguard: true,
          emergencyContact: '119',
          hazards: ['이안류', '높은 파도'],
          safetyEquipment: ['구명조끼', '구명튜브', 'AED'],
          restrictions: ['음주 수영 금지', '야간 수영 금지']
        },
        operatingInfo: {
          openTime: '09:00',
          closeTime: '18:00',
          season: { start: '07-01', end: '08-31' },
          admission: { adult: 0, child: 0, free: true }
        },
        realTimeData: {
          lastUpdated: new Date(),
          currentVisitors: 2500,
          crowdLevel: 'medium',
          status: 'open',
          alerts: []
        },
        tags: ['가족', '서핑', '일출', '축제'],
        rating: 4.5,
        reviews: 12853,
        beachInfo: {
          length: 1500,
          width: 40,
          sandType: 'fine',
          facilities: [
            { type: 'shower', count: 50, fee: false },
            { type: 'toilet', count: 30, fee: false },
            { type: 'changing_room', count: 20, fee: true },
            { type: 'shade', count: 100, fee: true },
            { type: 'rental', location: '중앙부', fee: true }
          ] as BeachFacility[],
          waterQuality: {
            grade: 'excellent',
            ph: 8.1,
            do: 8.5,
            bacteria: 10,
            lastTested: new Date()
          } as WaterQuality
        },
        activities: [
          { type: 'swimming', available: true, bestTime: '오전 10시-오후 4시' },
          { type: 'surfing', available: true, bestTime: '오전 6시-8시', restrictions: ['지정 구역에서만 가능'] },
          { type: 'volleyball', available: true },
          { type: 'camping', available: false },
          { type: 'fishing', available: false }
        ] as BeachActivity[]
      },
      {
        id: 'beach-2',
        type: 'beach',
        name: '광안리 해수욕장',
        nameEn: 'Gwangalli Beach',
        region: '부산',
        district: '수영구',
        address: '부산광역시 수영구 광안해변로 219',
        coordinates: { latitude: 35.1531, longitude: 129.1187 },
        description: '광안대교의 야경이 아름다운 도심 속 해수욕장입니다.',
        images: ['/images/gwangalli-beach.jpg'],
        accessibility: {
          parkingAvailable: true,
          publicTransport: true,
          wheelchairAccessible: true,
          nearestStation: '광안역',
          parkingCapacity: 500
        },
        safetyInfo: {
          lifeguard: true,
          emergencyContact: '119',
          hazards: ['이안류'],
          safetyEquipment: ['구명조끼', '구명튜브', 'AED'],
          restrictions: ['음주 수영 금지', '야간 수영 금지']
        },
        operatingInfo: {
          openTime: '09:00',
          closeTime: '18:00',
          season: { start: '07-01', end: '08-31' },
          admission: { adult: 0, child: 0, free: true }
        },
        realTimeData: {
          lastUpdated: new Date(),
          currentVisitors: 1800,
          crowdLevel: 'medium',
          status: 'open'
        },
        tags: ['야경', '카페', '레스토랑', '축제'],
        rating: 4.6,
        reviews: 9847,
        beachInfo: {
          length: 1400,
          width: 25,
          sandType: 'fine',
          facilities: [
            { type: 'shower', count: 40, fee: false },
            { type: 'toilet', count: 25, fee: false },
            { type: 'changing_room', count: 15, fee: true }
          ] as BeachFacility[],
          waterQuality: {
            grade: 'excellent',
            ph: 8.0,
            do: 8.3,
            bacteria: 15,
            lastTested: new Date()
          } as WaterQuality
        },
        activities: [
          { type: 'swimming', available: true },
          { type: 'surfing', available: false },
          { type: 'volleyball', available: true },
          { type: 'camping', available: false },
          { type: 'fishing', available: true, bestTime: '새벽', restrictions: ['지정 구역에서만 가능'] }
        ] as BeachActivity[]
      },
      {
        id: 'beach-3',
        type: 'beach',
        name: '송정 해수욕장',
        nameEn: 'Songjeong Beach',
        region: '부산',
        district: '해운대구',
        address: '부산광역시 해운대구 송정해변로 62',
        coordinates: { latitude: 35.1789, longitude: 129.1997 },
        description: '서핑의 메카로 불리는 해수욕장으로 사계절 서퍼들이 찾는 명소입니다.',
        images: ['/images/songjeong-beach.jpg'],
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
          hazards: ['높은 파도', '암초'],
          safetyEquipment: ['구명조끼', '구명튜브'],
          restrictions: ['초보자 서핑 제한 구역 있음']
        },
        operatingInfo: {
          openTime: '06:00',
          closeTime: '20:00',
          season: { start: '06-01', end: '09-30' },
          admission: { adult: 0, child: 0, free: true }
        },
        realTimeData: {
          lastUpdated: new Date(),
          currentVisitors: 800,
          crowdLevel: 'low',
          status: 'open'
        },
        tags: ['서핑', '일출', '산책', '카페'],
        rating: 4.7,
        reviews: 5621,
        beachInfo: {
          length: 1200,
          width: 30,
          sandType: 'coarse',
          facilities: [
            { type: 'shower', count: 20, fee: false },
            { type: 'toilet', count: 15, fee: false },
            { type: 'rental', location: '서핑샵 거리', fee: true }
          ] as BeachFacility[],
          waterQuality: {
            grade: 'good',
            ph: 8.2,
            do: 8.0,
            bacteria: 20,
            lastTested: new Date()
          } as WaterQuality
        },
        activities: [
          { type: 'swimming', available: true, restrictions: ['파도가 높을 때 주의'] },
          { type: 'surfing', available: true, bestTime: '오전 6시-10시' },
          { type: 'volleyball', available: false },
          { type: 'camping', available: false },
          { type: 'fishing', available: false }
        ] as BeachActivity[]
      }
    ]
  }

  /**
   * API 응답 데이터를 BeachData 형식으로 변환
   */
  private transformBeachData(apiData: any): BeachData[] {
    // TODO: 실제 API 응답에 맞춰 변환 로직 구현
    return apiData.map((item: any) => this.transformBeachItem(item))
  }

  private transformBeachItem(item: any): BeachData {
    // TODO: 실제 API 응답 구조에 맞춰 매핑
    return {
      id: item.id,
      type: 'beach',
      name: item.name,
      // ... 나머지 필드 매핑
    } as BeachData
  }
}