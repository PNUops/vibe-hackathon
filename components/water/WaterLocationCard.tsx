'use client'

import { motion } from 'framer-motion'
import {
  Waves, Thermometer, Users, MapPin, Star, Calendar,
  Mountain, Shell, Anchor, Clock, AlertTriangle
} from 'lucide-react'
import { WaterLocation } from '@/types/water-activities'
import Card from '../ui/Card'
import Badge from '../ui/Badge'

interface WaterLocationCardProps {
  location: WaterLocation
  rank?: number
  onClick?: () => void
  showMatchScore?: boolean
  matchScore?: number
}

// 활동 유형별 아이콘
const typeIcons = {
  beach: Waves,
  valley: Mountain,
  mudflat: Shell,
  marine_sports: Anchor
}

// 활동 유형별 색상
const typeColors = {
  beach: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  valley: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  mudflat: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  marine_sports: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
}

// 활동 유형별 라벨
const typeLabels = {
  beach: { ko: '해수욕장', en: 'Beach', ja: 'ビーチ', zh: '海滩' },
  valley: { ko: '계곡', en: 'Valley', ja: '渓谷', zh: '山谷' },
  mudflat: { ko: '갯벌', en: 'Mudflat', ja: '干潟', zh: '滩涂' },
  marine_sports: { ko: '해양스포츠', en: 'Marine Sports', ja: 'マリンスポーツ', zh: '海洋运动' }
}

// 혼잡도 색상
const crowdColors = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
} as const

// 혼잡도 텍스트
const crowdText = {
  low: { ko: '여유', en: 'Quiet', ja: '空いている', zh: '空闲' },
  medium: { ko: '보통', en: 'Moderate', ja: '普通', zh: '适中' },
  high: { ko: '혼잡', en: 'Crowded', ja: '混雑', zh: '拥挤' }
}

export default function WaterLocationCard({
  location,
  rank,
  onClick,
  showMatchScore = false,
  matchScore = 0
}: WaterLocationCardProps) {
  const locale = (typeof window !== 'undefined' ? localStorage.getItem('locale') : 'ko') as 'ko' | 'en' | 'ja' | 'zh' || 'ko'
  const TypeIcon = typeIcons[location.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank ? rank * 0.1 : 0 }}
    >
      <Card gradient onClick={onClick}>
        <div className="relative">
          {/* 순위 표시 */}
          {rank && (
            <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg z-10">
              <span className="text-white font-bold text-lg">{rank}</span>
            </div>
          )}

          {/* 상태 뱃지 */}
          {location.realTimeData?.status && (
            <div className="absolute -top-3 right-0 z-10">
              {location.realTimeData.status === 'closed' && (
                <Badge variant="danger" className="animate-pulse">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  폐장
                </Badge>
              )}
              {location.realTimeData.status === 'warning' && (
                <Badge variant="warning" className="animate-pulse">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  주의
                </Badge>
              )}
            </div>
          )}

          {/* 메인 컨텐츠 */}
          <div className="space-y-4">
            {/* 헤더 */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {/* 활동 유형 태그 */}
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-2 ${typeColors[location.type]}`}>
                  <TypeIcon className="w-3 h-3" />
                  <span>{typeLabels[location.type][locale]}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {location.name}
                </h3>
                <div className="flex items-center mt-1 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{location.district}, {location.region}</span>
                </div>
              </div>

              <div className="text-right ml-4">
                {/* 평점 */}
                {location.rating && (
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-amber-400 mr-1" />
                    <span className="font-semibold">{location.rating.toFixed(1)}</span>
                  </div>
                )}

                {/* 매치 스코어 */}
                {showMatchScore && matchScore > 0 && (
                  <div className="text-beach-600 dark:text-beach-400 font-bold text-lg mt-1">
                    {matchScore}% 일치
                  </div>
                )}
              </div>
            </div>

            {/* 정보 그리드 */}
            <div className="grid grid-cols-3 gap-2">
              {/* 활동 유형별 특화 정보 표시 */}
              {location.type === 'beach' && (
                <>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center">
                    <Thermometer className="w-4 h-4 mx-auto mb-1 text-coral-500" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">수온</p>
                    <p className="font-semibold text-sm">24°C</p>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center">
                    <Waves className="w-4 h-4 mx-auto mb-1 text-beach-500" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">파도</p>
                    <p className="font-semibold text-sm">0.8m</p>
                  </div>
                </>
              )}

              {location.type === 'valley' && (
                <>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center">
                    <Thermometer className="w-4 h-4 mx-auto mb-1 text-coral-500" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">수온</p>
                    <p className="font-semibold text-sm">18°C</p>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center">
                    <Mountain className="w-4 h-4 mx-auto mb-1 text-green-500" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">수심</p>
                    <p className="font-semibold text-sm">1.5m</p>
                  </div>
                </>
              )}

              {location.type === 'mudflat' && (
                <>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">간조</p>
                    <p className="font-semibold text-sm">14:30</p>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center">
                    <Shell className="w-4 h-4 mx-auto mb-1 text-yellow-600" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">체험</p>
                    <p className="font-semibold text-sm">가능</p>
                  </div>
                </>
              )}

              {location.type === 'marine_sports' && (
                <>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center">
                    <Waves className="w-4 h-4 mx-auto mb-1 text-purple-500" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">파고</p>
                    <p className="font-semibold text-sm">1.2m</p>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center">
                    <Anchor className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">활동</p>
                    <p className="font-semibold text-sm">서핑</p>
                  </div>
                </>
              )}

              {/* 공통: 혼잡도 */}
              {location.realTimeData?.crowdLevel && (
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center">
                  <Users className="w-4 h-4 mx-auto mb-1 text-wave-500" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">혼잡도</p>
                  <Badge variant={crowdColors[location.realTimeData.crowdLevel]}>
                    {crowdText[location.realTimeData.crowdLevel][locale]}
                  </Badge>
                </div>
              )}
            </div>

            {/* 태그 */}
            {location.tags && location.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {location.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="info" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* 알림 */}
            {location.realTimeData?.alerts && location.realTimeData.alerts.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2 border border-amber-200 dark:border-amber-800">
                <p className="text-xs font-medium text-amber-800 dark:text-amber-200 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {location.realTimeData.alerts[0]}
                </p>
              </div>
            )}

            {/* 접근성 정보 */}
            <div className="flex gap-2 text-xs text-gray-500">
              {location.accessibility.parkingAvailable && (
                <span>🅿️ 주차가능</span>
              )}
              {location.accessibility.publicTransport && (
                <span>🚍 대중교통</span>
              )}
              {location.accessibility.wheelchairAccessible && (
                <span>♿ 휠체어</span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}