'use client'

import { useState, useEffect } from 'react'
import { WaterActivityService } from '@/lib/api/services/WaterActivityService'
import { WaterLocation } from '@/types/water-activities'
import WaterLocationCard from './WaterLocationCard'
import ActivityTypeSelector, { ActivityType } from '../ActivityTypeSelector'
import { Search, Filter, MapPin, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface WaterLocationListProps {
  showSearch?: boolean
  showFilter?: boolean
  onLocationClick?: (location: WaterLocation) => void
}

export default function WaterLocationList({
  showSearch = true,
  showFilter = true,
  onLocationClick
}: WaterLocationListProps) {
  const [selectedType, setSelectedType] = useState<ActivityType>('all')
  const [locations, setLocations] = useState<WaterLocation[]>([])
  const [filteredLocations, setFilteredLocations] = useState<WaterLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCrowdFilter, setShowCrowdFilter] = useState(false)
  const [selectedCrowdLevel, setSelectedCrowdLevel] = useState<'all' | 'low' | 'medium' | 'high'>('all')

  const locale = (typeof window !== 'undefined' ? localStorage.getItem('locale') : 'ko') as 'ko' | 'en' | 'ja' | 'zh' || 'ko'

  // 데이터 로드
  useEffect(() => {
    loadLocations()
  }, [selectedType])

  // 필터링
  useEffect(() => {
    filterLocations()
  }, [locations, searchTerm, selectedCrowdLevel])

  const loadLocations = async () => {
    setLoading(true)
    setError(null)

    try {
      const service = WaterActivityService.getInstance()
      let data: WaterLocation[]

      if (selectedType === 'all') {
        data = await service.getAllLocations()
      } else {
        data = await service.getLocationsByType(selectedType)
      }

      setLocations(data)
      setFilteredLocations(data)
    } catch (err) {
      console.error('Error loading locations:', err)
      setError('Failed to load locations')
    } finally {
      setLoading(false)
    }
  }

  const filterLocations = () => {
    let filtered = [...locations]

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.district.includes(searchTerm) ||
        location.tags?.some(tag => tag.includes(searchTerm))
      )
    }

    // 혼잡도 필터
    if (selectedCrowdLevel !== 'all') {
      filtered = filtered.filter(location =>
        location.realTimeData?.crowdLevel === selectedCrowdLevel
      )
    }

    // 평점 순으로 정렬
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))

    setFilteredLocations(filtered)
  }

  const labels = {
    ko: {
      search: '장소명, 지역, 태그 검색...',
      filter: '필터',
      crowdLevel: '혼잡도',
      all: '전체',
      low: '여유',
      medium: '보통',
      high: '혼잡',
      loading: '로딩 중...',
      error: '오류가 발생했습니다',
      noResults: '검색 결과가 없습니다',
      showing: '개 장소'
    },
    en: {
      search: 'Search by name, area, tags...',
      filter: 'Filter',
      crowdLevel: 'Crowd Level',
      all: 'All',
      low: 'Quiet',
      medium: 'Moderate',
      high: 'Crowded',
      loading: 'Loading...',
      error: 'An error occurred',
      noResults: 'No results found',
      showing: 'locations'
    },
    ja: {
      search: '場所名、地域、タグで検索...',
      filter: 'フィルター',
      crowdLevel: '混雑度',
      all: 'すべて',
      low: '空いている',
      medium: '普通',
      high: '混雑',
      loading: '読み込み中...',
      error: 'エラーが発生しました',
      noResults: '検索結果がありません',
      showing: '件の場所'
    },
    zh: {
      search: '按名称、地区、标签搜索...',
      filter: '筛选',
      crowdLevel: '拥挤程度',
      all: '全部',
      low: '空闲',
      medium: '适中',
      high: '拥挤',
      loading: '加载中...',
      error: '发生错误',
      noResults: '未找到结果',
      showing: '个地点'
    }
  }

  const t = labels[locale]

  return (
    <div className="space-y-4">
      {/* 활동 유형 선택 */}
      <ActivityTypeSelector
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      {/* 검색 및 필터 */}
      {(showSearch || showFilter) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 space-y-3">
          {/* 검색 바 */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-beach-500 dark:focus:ring-beach-400"
              />
            </div>
          )}

          {/* 필터 버튼 */}
          {showFilter && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowCrowdFilter(!showCrowdFilter)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg
                         hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">{t.filter}</span>
              </button>

              {/* 혼잡도 필터 */}
              <AnimatePresence>
                {showCrowdFilter && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t.crowdLevel}:</span>
                    <select
                      value={selectedCrowdLevel}
                      onChange={(e) => setSelectedCrowdLevel(e.target.value as 'all' | 'low' | 'medium' | 'high')}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                               focus:outline-none focus:ring-2 focus:ring-beach-500"
                    >
                      <option value="all">{t.all}</option>
                      <option value="low">{t.low}</option>
                      <option value="medium">{t.medium}</option>
                      <option value="high">{t.high}</option>
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* 결과 카운트 */}
          {!loading && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredLocations.length}{t.showing}
            </div>
          )}
        </div>
      )}

      {/* 로딩 상태 */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-beach-500 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t.loading}</p>
        </div>
      )}

      {/* 에러 상태 */}
      {error && !loading && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300">{t.error}</p>
        </div>
      )}

      {/* 장소 리스트 */}
      {!loading && !error && (
        <>
          {filteredLocations.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t.noResults}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLocations.map((location, index) => (
                <WaterLocationCard
                  key={location.id}
                  location={location}
                  onClick={() => onLocationClick?.(location)}
                  rank={index < 3 ? index + 1 : undefined}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}