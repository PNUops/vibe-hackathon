// 부산 해수욕장 정보
// 실제 공공데이터 API 사용 시 API KEY와 엔드포인트를 설정해야 합니다

export const BUSAN_BEACHES = [
  {
    id: 'haeundae',
    name: '해운대 해수욕장',
    location: '부산광역시 해운대구 우동',
    latitude: 35.1587,
    longitude: 129.1604,
    length: 1500,
    width: 30,
    area: 58400,
    facilities: ['샤워실', '화장실', '주차장', '편의점', '의무실'],
    description: '부산의 대표 해수욕장으로 백사장이 넓고 수심이 얕아 가족 단위 피서객에게 인기',
  },
  {
    id: 'gwangalli',
    name: '광안리 해수욕장',
    location: '부산광역시 수영구 광안2동',
    latitude: 35.1532,
    longitude: 129.1189,
    length: 1400,
    width: 25,
    area: 82000,
    facilities: ['샤워실', '화장실', '주차장', '카페', '수상레저'],
    description: '광안대교의 야경과 함께 즐기는 도심형 해수욕장',
  },
  {
    id: 'songjeong',
    name: '송정 해수욕장',
    location: '부산광역시 해운대구 송정동',
    latitude: 35.1785,
    longitude: 129.1997,
    length: 1200,
    width: 20,
    area: 72000,
    facilities: ['샤워실', '서핑샵', '주차장', '화장실'],
    description: '서핑의 메카로 젊은 층에게 인기 있는 해수욕장',
  },
  {
    id: 'dadaepo',
    name: '다대포 해수욕장',
    location: '부산광역시 사하구 다대동',
    latitude: 35.0468,
    longitude: 128.9654,
    length: 900,
    width: 100,
    area: 90000,
    facilities: ['샤워실', '화장실', '주차장', '음악분수'],
    description: '낙동강 하구의 모래톱으로 이루어진 해수욕장',
  },
  {
    id: 'songdo',
    name: '송도 해수욕장',
    location: '부산광역시 서구 암남동',
    latitude: 35.0756,
    longitude: 129.0163,
    length: 800,
    width: 50,
    area: 40000,
    facilities: ['샤워실', '화장실', '주차장', '케이블카'],
    description: '우리나라 최초의 공설 해수욕장',
  },
  {
    id: 'ilgwang',
    name: '일광 해수욕장',
    location: '부산광역시 기장군 일광면',
    latitude: 35.2597,
    longitude: 129.2332,
    length: 700,
    width: 30,
    area: 21000,
    facilities: ['샤워실', '화장실', '주차장', '캠핑장'],
    description: '가족 단위 캠핑과 해수욕을 동시에 즐길 수 있는 곳',
  },
]

// 해수욕장 데이터 가져오기
export async function fetchBeaches() {
  // 실제 구현 시 공공데이터 API 호출
  // const response = await fetch('https://api.busan.go.kr/beaches')
  // return await response.json()

  return BUSAN_BEACHES
}

// 특정 해수욕장 정보 가져오기
export async function fetchBeachById(id: string) {
  const beaches = await fetchBeaches()
  return beaches.find(beach => beach.id === id)
}