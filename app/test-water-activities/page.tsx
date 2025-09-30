'use client'

import { useState, useEffect } from 'react'
import { WaterActivityService } from '@/lib/api/services/WaterActivityService'
import { WaterLocation } from '@/types/water-activities'
import ActivityTypeSelector, { ActivityType } from '@/components/ActivityTypeSelector'
import { MapPin, Users, Star, AlertCircle } from 'lucide-react'

export default function TestWaterActivities() {
  const [selectedType, setSelectedType] = useState<ActivityType>('all')
  const [locations, setLocations] = useState<WaterLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadLocations()
  }, [selectedType])

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
    } catch (err) {
      console.error('Error loading locations:', err)
      setError('Failed to load locations')
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'beach': return 'bg-blue-100 text-blue-800'
      case 'valley': return 'bg-green-100 text-green-800'
      case 'mudflat': return 'bg-yellow-100 text-yellow-800'
      case 'marine_sports': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'beach': return '해수욕장'
      case 'valley': return '계곡'
      case 'mudflat': return '갯벌'
      case 'marine_sports': return '해양스포츠'
      default: return type
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            🌊 MyWave - 물놀이 활동 테스트
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            통합 물놀이 플랫폼 API 테스트 페이지
          </p>
        </div>
      </div>

      {/* Activity Type Selector */}
      <div className="max-w-6xl mx-auto">
        <ActivityTypeSelector
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedType === 'all' ? '전체' : getTypeLabel(selectedType)} 장소
              </h2>
              <p className="text-sm text-gray-600">
                {loading ? '로딩 중...' : `${locations.length}개 장소`}
              </p>
            </div>
            <button
              onClick={loadLocations}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              새로고침
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Locations Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <div
                key={location.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
              >
                {/* Type Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(location.type)}`}
                  >
                    {getTypeLabel(location.type)}
                  </span>
                  {location.realTimeData?.status && (
                    <span
                      className={`text-xs font-medium ${
                        location.realTimeData.status === 'open'
                          ? 'text-green-600'
                          : location.realTimeData.status === 'closed'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {location.realTimeData.status === 'open' ? '운영중' :
                       location.realTimeData.status === 'closed' ? '폐장' : '주의'}
                    </span>
                  )}
                </div>

                {/* Location Name */}
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {location.name}
                </h3>
                {location.nameEn && (
                  <p className="text-sm text-gray-500 mb-2">{location.nameEn}</p>
                )}

                {/* Location Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{location.district}, {location.region}</span>
                  </div>

                  {location.realTimeData?.crowdLevel && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>
                        혼잡도: {
                          location.realTimeData.crowdLevel === 'low' ? '낮음' :
                          location.realTimeData.crowdLevel === 'medium' ? '보통' : '높음'
                        }
                      </span>
                    </div>
                  )}

                  {location.rating && (
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>
                        {location.rating.toFixed(1)} ({location.reviews?.toLocaleString() || 0}개 리뷰)
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {location.tags && location.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {location.tags.slice(0, 4).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Special Info for Each Type */}
                <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                  {location.type === 'beach' && '🏖️ 해수욕장'}
                  {location.type === 'valley' && '⛰️ 계곡'}
                  {location.type === 'mudflat' && '🦀 갯벌 체험'}
                  {location.type === 'marine_sports' && '🏄 해양 스포츠'}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && locations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">선택한 유형에 해당하는 장소가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}