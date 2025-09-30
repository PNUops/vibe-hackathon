'use client'

import { useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import {
  Waves, Thermometer, Users, MapPin, Star,
  Mountain, Shell, Anchor, Clock, AlertTriangle, Sparkles, Award
} from 'lucide-react'
import { WaterLocation } from '@/types/water-activities'
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

  // 3D 효과를 위한 motion values
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [30, -30])
  const rotateY = useTransform(x, [-100, 100], [-30, 30])

  const [isHovered, setIsHovered] = useState(false)

  // 마우스 이벤트 핸들러
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.2)
    y.set((e.clientY - centerY) * 0.2)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank ? rank * 0.1 : 0 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        whileHover={{ scale: 1.02 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        className="relative cursor-pointer"
      >
        {/* 글래스모피즘 카드 */}
        <div className={`
          relative overflow-hidden rounded-2xl
          bg-white/80 dark:bg-gray-800/80
          backdrop-blur-xl backdrop-saturate-150
          border border-white/20 dark:border-gray-700/30
          shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
          hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.45)]
          transition-all duration-300
          ${isHovered ? 'bg-gradient-to-br from-white/90 via-white/80 to-beach-50/40' : ''}
        `}>
          {/* 배경 그라디언트 애니메이션 */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-br from-beach-400/10 via-wave-400/10 to-coral-400/10"
            />
          )}

          {/* 파티클 효과 */}
          {isHovered && matchScore > 80 && (
            <motion.div className="absolute inset-0 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100,
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                  className="absolute top-1/2 left-1/2"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="relative p-6">
            {/* 순위 표시 - 3D 효과 강화 */}
            {rank && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                className="absolute -top-4 -left-4 z-20"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-amber-600 rounded-full blur-md" />
                  <div className="relative w-14 h-14 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-xl">
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
                    <span className="text-white font-bold text-xl relative z-10">
                      {rank === 1 && '🥇'}
                      {rank === 2 && '🥈'}
                      {rank === 3 && '🥉'}
                      {rank > 3 && rank}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 상태 뱃지 - 애니메이션 강화 */}
            {location.realTimeData?.status && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute -top-3 right-3 z-10"
              >
                {location.realTimeData.status === 'closed' && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500 rounded-lg blur-md animate-pulse" />
                    <Badge variant="danger" className="relative animate-pulse backdrop-blur-sm">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      폐장
                    </Badge>
                  </div>
                )}
                {location.realTimeData.status === 'warning' && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-500 rounded-lg blur-md animate-pulse" />
                    <Badge variant="warning" className="relative animate-pulse backdrop-blur-sm">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      주의
                    </Badge>
                  </div>
                )}
              </motion.div>
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
                {/* 평점 - 애니메이션 추가 */}
                {location.rating && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="flex items-center mb-2"
                  >
                    <Star className="w-5 h-5 text-amber-400 mr-1 fill-amber-400" />
                    <span className="font-bold text-lg">{location.rating.toFixed(1)}</span>
                  </motion.div>
                )}

                {/* 매치 스코어 - 원형 프로그레스바 */}
                {showMatchScore && matchScore > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="relative w-16 h-16"
                  >
                    <svg className="transform -rotate-90 w-16 h-16">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <motion.circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="url(#gradient)"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: matchScore / 100 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{
                          strokeDasharray: `${2 * Math.PI * 28}`,
                          strokeDashoffset: `${2 * Math.PI * 28 * (1 - matchScore / 100)}`
                        }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#60A5FA" />
                          <stop offset="50%" stopColor="#A78BFA" />
                          <stop offset="100%" stopColor="#F472B6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="font-bold text-lg bg-gradient-to-r from-beach-600 to-wave-600 bg-clip-text text-transparent">
                          {matchScore}%
                        </div>
                        {matchScore >= 90 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <Award className="w-4 h-4 text-amber-500 mx-auto" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
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
        </div>
      </motion.div>
    </motion.div>
  )
}