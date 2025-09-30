// 갯벌 데이터 어댑터

import { MudflatData, TideInfo, TideTime, MarineLifeInfo, ExperienceProgram } from '@/types/water-activities'
import axios from 'axios'

export class MudflatAdapter {
  private apiUrl = process.env.NEXT_PUBLIC_MUDFLAT_API_URL || ''
  private tideApiUrl = process.env.NEXT_PUBLIC_TIDE_API_URL || ''
  private apiKey = process.env.NEXT_PUBLIC_MUDFLAT_API_KEY || ''

  /**
   * 갯벌 목록 가져오기
   */
  async getLocations(): Promise<MudflatData[]> {
    try {
      // TODO: 실제 API 호출 구현
      // const response = await axios.get(`${this.apiUrl}/mudflats`, {
      //   params: {
      //     apiKey: this.apiKey,
      //     region: '부산'
      //   }
      // })
      // return this.transformMudflatData(response.data)

      // Mock 데이터 반환
      return this.getMockMudflatData()
    } catch (error) {
      console.error('Error fetching mudflat locations:', error)
      return this.getMockMudflatData()
    }
  }

  /**
   * 갯벌 상세 정보 가져오기
   */
  async getLocationDetail(id: string): Promise<MudflatData | null> {
    try {
      const mudflats = await this.getLocations()
      const mudflat = mudflats.find(m => m.id === id)

      if (mudflat) {
        // 실시간 조석 정보 업데이트
        const tideSchedule = await this.getTideSchedule(mudflat.coordinates)
        if (tideSchedule) {
          mudflat.tideSchedule = tideSchedule
        }
      }

      return mudflat || null
    } catch (error) {
      console.error('Error fetching mudflat detail:', error)
      return null
    }
  }

  /**
   * 조석 정보 가져오기 (국립해양조사원 바다누리 API 연동 예정)
   */
  async getTideSchedule(coordinates: { latitude: number; longitude: number }): Promise<TideInfo[]> {
    try {
      // TODO: 실제 조석 API 호출 구현
      // const response = await axios.get(`${this.tideApiUrl}/tide`, {
      //   params: {
      //     lat: coordinates.latitude,
      //     lon: coordinates.longitude,
      //     days: 7,
      //     apiKey: this.apiKey
      //   }
      // })
      // return this.transformTideData(response.data)

      // Mock 데이터 생성 (7일간)
      const schedule: TideInfo[] = []
      const today = new Date()

      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)

        schedule.push({
          date: date.toISOString().split('T')[0],
          highTide: [
            { time: '06:30', height: 7.2 },
            { time: '18:45', height: 7.5 }
          ],
          lowTide: [
            { time: '00:15', height: 1.2 },
            { time: '12:30', height: 0.8 }
          ],
          bestVisitTime: '12:00 ~ 14:00'
        })
      }

      return schedule
    } catch (error) {
      console.error('Error fetching tide schedule:', error)
      return []
    }
  }

  /**
   * Mock 데이터 생성
   */
  private getMockMudflatData(): MudflatData[] {
    return [
      {
        id: 'mudflat-1',
        type: 'mudflat',
        name: '다대포 갯벌체험장',
        nameEn: 'Dadaepo Mudflat Experience Center',
        region: '부산',
        district: '사하구',
        address: '부산광역시 사하구 다대동 몰운대1길',
        coordinates: { latitude: 35.0466, longitude: 128.9654 },
        description: '낙동강 하구에 위치한 생태 갯벌로, 다양한 갯벌 생물을 관찰할 수 있는 체험장입니다.',
        images: ['/images/dadaepo-mudflat.jpg'],
        accessibility: {
          parkingAvailable: true,
          publicTransport: true,
          wheelchairAccessible: true,
          nearestStation: '다대포해수욕장역',
          parkingCapacity: 200
        },
        safetyInfo: {
          lifeguard: true,
          emergencyContact: '119',
          hazards: ['조수 변화', '미끄러운 갯벌'],
          safetyEquipment: ['구명조끼', '안전화 대여'],
          restrictions: ['간조 시간에만 입장 가능']
        },
        operatingInfo: {
          season: { start: '04-01', end: '10-31' },
          admission: { adult: 5000, child: 3000, free: false }
        },
        realTimeData: {
          lastUpdated: new Date(),
          currentVisitors: 120,
          crowdLevel: 'medium',
          status: 'open',
          alerts: ['오늘 14:00부터 만조로 갯벌 체험 종료']
        },
        tags: ['생태체험', '교육', '가족', '조개잡이'],
        rating: 4.5,
        reviews: 2341,
        mudflatInfo: {
          area: 50000,
          mudType: 'mixed',
          tidalRange: 2.5,
          ecologicalGrade: 'excellent'
        },
        tideSchedule: [
          {
            date: new Date().toISOString().split('T')[0],
            highTide: [
              { time: '06:30', height: 7.2 },
              { time: '18:45', height: 7.5 }
            ],
            lowTide: [
              { time: '00:15', height: 1.2 },
              { time: '12:30', height: 0.8 }
            ],
            bestVisitTime: '11:30 ~ 13:30'
          }
        ],
        marineLife: [
          { species: 'Mactra veneriformis', koreanName: '동죽', season: ['봄', '가을'], rarity: 'common' },
          { species: 'Upogebia major', koreanName: '쏙', season: ['여름'], rarity: 'common' },
          { species: 'Periophthalmus modestus', koreanName: '짱뚱어', season: ['여름', '가을'], rarity: 'uncommon' },
          { species: 'Uca arcuata', koreanName: '칠게', season: ['여름'], rarity: 'common' }
        ] as MarineLifeInfo[],
        experiencePrograms: [
          {
            id: 'prog-1',
            name: '갯벌 생태 체험',
            duration: 2,
            price: 10000,
            minAge: 5,
            maxParticipants: 30,
            includes: ['전문 해설', '체험 도구', '장화 대여'],
            schedule: ['10:00', '14:00'],
            reservation: 'recommended'
          },
          {
            id: 'prog-2',
            name: '조개잡이 체험',
            duration: 1.5,
            price: 8000,
            minAge: 7,
            maxParticipants: 50,
            includes: ['바구니', '호미', '장갑'],
            schedule: ['간조 시간'],
            reservation: 'not_needed'
          }
        ] as ExperienceProgram[]
      },
      {
        id: 'mudflat-2',
        type: 'mudflat',
        name: '을숙도 생태공원 갯벌',
        nameEn: 'Eulsukdo Eco Park Mudflat',
        region: '부산',
        district: '사하구',
        address: '부산광역시 사하구 낙동남로 1240',
        coordinates: { latitude: 35.1056, longitude: 128.9456 },
        description: '낙동강 하구 철새도래지와 함께 있는 생태 갯벌로, 철새 관찰과 갯벌 체험을 동시에 즐길 수 있습니다.',
        images: ['/images/eulsukdo-mudflat.jpg'],
        accessibility: {
          parkingAvailable: true,
          publicTransport: true,
          wheelchairAccessible: true,
          nearestStation: '하단역',
          parkingCapacity: 150
        },
        safetyInfo: {
          lifeguard: false,
          emergencyContact: '119',
          hazards: ['조수 변화', '깊은 수로'],
          safetyEquipment: ['안전 안내판'],
          restrictions: ['지정 구역 외 출입 금지', '철새 보호 구역']
        },
        operatingInfo: {
          season: { start: '03-01', end: '11-30' },
          admission: { adult: 2000, child: 1000, free: false }
        },
        realTimeData: {
          lastUpdated: new Date(),
          crowdLevel: 'low',
          status: 'open'
        },
        tags: ['철새', '생태학습', '낙동강', '습지'],
        rating: 4.6,
        reviews: 1876,
        mudflatInfo: {
          area: 80000,
          mudType: 'muddy',
          tidalRange: 2.0,
          ecologicalGrade: 'excellent'
        },
        tideSchedule: [],
        marineLife: [
          { species: 'Macrobrachium nipponense', koreanName: '새우', season: ['봄', '여름'], rarity: 'common' },
          { species: 'Helice tridens', koreanName: '방게', season: ['여름', '가을'], rarity: 'common' },
          { species: 'Bullacta exarata', koreanName: '갯우렁이', season: ['사계절'], rarity: 'common' }
        ] as MarineLifeInfo[],
        experiencePrograms: [
          {
            id: 'prog-3',
            name: '철새와 갯벌 생태 탐방',
            duration: 3,
            price: 15000,
            minAge: 8,
            maxParticipants: 20,
            includes: ['전문 해설사', '망원경 대여', '생태 지도'],
            schedule: ['09:00', '14:00'],
            reservation: 'required'
          }
        ] as ExperienceProgram[]
      },
      {
        id: 'mudflat-3',
        type: 'mudflat',
        name: '가덕도 갯벌',
        nameEn: 'Gadeokdo Mudflat',
        region: '부산',
        district: '강서구',
        address: '부산광역시 강서구 가덕해안로',
        coordinates: { latitude: 35.0234, longitude: 128.8234 },
        description: '가덕도 연안의 자연 갯벌로, 다양한 갯벌 생물과 아름다운 일몰을 감상할 수 있습니다.',
        images: ['/images/gadeokdo-mudflat.jpg'],
        accessibility: {
          parkingAvailable: true,
          publicTransport: false,
          wheelchairAccessible: false,
          parkingCapacity: 50
        },
        safetyInfo: {
          lifeguard: false,
          emergencyContact: '119',
          hazards: ['급격한 조수 변화', '깊은 갯골'],
          safetyEquipment: [],
          restrictions: ['야간 출입 금지']
        },
        operatingInfo: {
          season: { start: '05-01', end: '09-30' },
          admission: { adult: 0, child: 0, free: true }
        },
        realTimeData: {
          lastUpdated: new Date(),
          crowdLevel: 'low',
          status: 'open'
        },
        tags: ['일몰', '낚시', '자연경관', '조용한'],
        rating: 4.2,
        reviews: 543,
        mudflatInfo: {
          area: 30000,
          mudType: 'sandy',
          tidalRange: 3.0,
          ecologicalGrade: 'good'
        },
        tideSchedule: [],
        marineLife: [
          { species: 'Sinonovacula constricta', koreanName: '맛조개', season: ['봄', '여름'], rarity: 'uncommon' },
          { species: 'Tegillarca granosa', koreanName: '꼬막', season: ['가을', '겨울'], rarity: 'rare' }
        ] as MarineLifeInfo[],
        experiencePrograms: [] as ExperienceProgram[]
      }
    ]
  }

  /**
   * 물때 시간에 따른 최적 방문 시간 계산
   */
  calculateBestVisitTime(tideInfo: TideInfo): string {
    // 간조 시간 기준으로 전후 1시간이 최적
    const lowTides = tideInfo.lowTide
    if (lowTides.length > 0) {
      const mainLowTide = lowTides[0]
      const time = mainLowTide.time.split(':')
      const hour = parseInt(time[0])
      const startHour = Math.max(0, hour - 1)
      const endHour = Math.min(23, hour + 1)
      return `${startHour.toString().padStart(2, '0')}:00 ~ ${endHour.toString().padStart(2, '0')}:00`
    }
    return '간조 시간 확인 필요'
  }
}