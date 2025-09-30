'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Navigation, Clock, Calendar, Star,
  Sparkles, ChevronDown, Heart, Share2,
  TrendingUp, Award, Zap, Sun, Cloud
} from 'lucide-react'
import MatchScoreVisual from '../ui/MatchScoreVisual'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { WaterLocation, WeatherInfo } from '@/types/water-activities'

interface RecommendationHeroProps {
  location: WaterLocation
  matchScore: number
  matchReasons: string[]
  weather?: WeatherInfo
  distance?: number
  onSelect?: () => void
  onShare?: () => void
  onFavorite?: () => void
}

export default function RecommendationHero({
  location,
  matchScore,
  matchReasons,
  weather,
  distance,
  onSelect,
  onShare,
  onFavorite
}: RecommendationHeroProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // 높은 매치 스코어일 때 컨페티 효과
  useEffect(() => {
    if (matchScore >= 90) {
      setTimeout(() => setShowConfetti(true), 1000)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }, [matchScore])

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    onFavorite?.()
  }

  return (
    <div className="relative overflow-hidden">
      {/* 배경 그라데이션 애니메이션 */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          ]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* 파티클 배경 */}
      <div className="absolute inset-0 -z-5">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 10
            }}
          />
        ))}
      </div>

      {/* 컨페티 효과 */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-50"
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1, 0],
                  rotate: Math.random() * 360
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.05,
                  ease: "easeOut"
                }}
              >
                <div
                  className={`w-3 h-3 ${
                    ['bg-yellow-400', 'bg-pink-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][
                      Math.floor(Math.random() * 5)
                    ]
                  }`}
                  style={{
                    clipPath: ['polygon(50% 0%, 0% 100%, 100% 100%)', 'circle(50%)', 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'][Math.floor(Math.random() * 3)]
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 메인 컨텐츠 */}
      <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* 왼쪽: 정보 섹션 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* 최고 추천 뱃지 */}
            {matchScore >= 90 && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full font-bold shadow-lg"
              >
                <Award className="w-5 h-5" />
                최고 추천
              </motion.div>
            )}

            {/* 장소 이름과 타입 */}
            <div>
              <motion.h1
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-beach-600 to-wave-600 bg-clip-text text-transparent mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {location.name}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 text-gray-600 dark:text-gray-400"
              >
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{location.district}, {location.region}</span>
                <Badge variant="info">{location.type}</Badge>
              </motion.div>
            </div>

            {/* 핵심 정보 카드 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              {/* 거리 */}
              {distance && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">거리</span>
                  </div>
                  <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {distance.toFixed(1)}km
                  </div>
                </div>
              )}

              {/* 날씨 */}
              {weather && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-800/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    {weather.description === '맑음' ? <Sun className="w-4 h-4 text-yellow-600" /> : <Cloud className="w-4 h-4 text-gray-600" />}
                    <span className="text-sm text-gray-600 dark:text-gray-400">날씨</span>
                  </div>
                  <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {weather.temperature}°C
                  </div>
                </div>
              )}

              {/* 평점 */}
              {location.rating && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">평점</span>
                  </div>
                  <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {location.rating.toFixed(1)}/5.0
                  </div>
                </div>
              )}

              {/* 상태 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">상태</span>
                </div>
                <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
                  운영중
                </div>
              </div>
            </motion.div>

            {/* 추천 이유 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                추천 이유
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchReasons.map((reason, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                    className="px-3 py-1.5 bg-gradient-to-r from-beach-100 to-wave-100 dark:from-beach-900/30 dark:to-wave-900/30 rounded-full text-sm font-medium text-beach-700 dark:text-beach-300"
                  >
                    {reason}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 액션 버튼 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-3"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={onSelect}
                className="flex-1 bg-gradient-to-r from-beach-500 to-wave-500 hover:from-beach-600 hover:to-wave-600"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                자세히 보기
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleFavorite}
                className={isFavorited ? 'text-red-500 border-red-500' : ''}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={onShare}
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* 오른쪽: 매치 스코어 시각화 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="flex justify-center items-center"
          >
            <MatchScoreVisual
              score={matchScore}
              size="large"
              showLabel={true}
              animated={true}
              reasons={matchReasons.slice(0, 3)}
            />
          </motion.div>
        </div>

        {/* 더보기 버튼 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <span>더 많은 정보 보기</span>
            <motion.div
              animate={{ rotate: showDetails ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </button>
        </motion.div>

        {/* 상세 정보 */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid md:grid-cols-3 gap-6">
                {/* 시설 정보 */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">시설 정보</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {location.accessibility.parkingAvailable && <div>✓ 주차장 보유</div>}
                    {location.accessibility.publicTransport && <div>✓ 대중교통 접근 가능</div>}
                    {location.accessibility.wheelchairAccessible && <div>✓ 휠체어 접근 가능</div>}
                  </div>
                </div>

                {/* 운영 시간 */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">운영 정보</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>운영 시간: {location.operatingInfo?.openTime} - {location.operatingInfo?.closeTime}</div>
                    <div>시즌: {location.operatingInfo?.season.start} ~ {location.operatingInfo?.season.end}</div>
                  </div>
                </div>

                {/* 안전 정보 */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">안전 정보</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {location.safetyInfo.lifeguard && <div>✓ 안전요원 상주</div>}
                    <div>긴급 연락처: {location.safetyInfo.emergencyContact}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}