'use client'

import { motion } from 'framer-motion'
import { Waves, Thermometer, Users, MapPin, Star, Calendar } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'

interface BeachInfo {
  id: string
  name: string
  location: string
  rating: number
  matchScore: number
  temperature: number
  waveHeight: number
  crowdLevel: 'low' | 'medium' | 'high'
  activities: string[]
  image?: string
  event?: {
    name: string
    time: string
  }
}

interface BeachCardProps {
  beach: BeachInfo
  rank?: number
  onClick?: () => void
}

export default function BeachCard({ beach, rank, onClick }: BeachCardProps) {
  const crowdColors = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
  } as const

  const crowdText = {
    low: '여유',
    medium: '보통',
    high: '혼잡',
  }

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
            <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">{rank}</span>
            </div>
          )}

          {/* 이벤트 뱃지 */}
          {beach.event && (
            <div className="absolute -top-3 right-0">
              <Badge variant="danger" className="animate-pulse">
                <Calendar className="w-3 h-3 mr-1" />
                {beach.event.name}
              </Badge>
            </div>
          )}

          {/* 메인 컨텐츠 */}
          <div className="space-y-4">
            {/* 헤더 */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {beach.name}
                </h3>
                <div className="flex items-center mt-1 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{beach.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-amber-400 mr-1" />
                  <span className="font-semibold">{beach.rating.toFixed(1)}</span>
                </div>
                <div className="text-beach-600 dark:text-beach-400 font-bold text-lg">
                  {beach.matchScore}% 일치
                </div>
              </div>
            </div>

            {/* 정보 그리드 */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                <Thermometer className="w-5 h-5 mx-auto mb-1 text-coral-500" />
                <p className="text-sm text-gray-600 dark:text-gray-400">수온</p>
                <p className="font-semibold">{beach.temperature}°C</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                <Waves className="w-5 h-5 mx-auto mb-1 text-beach-500" />
                <p className="text-sm text-gray-600 dark:text-gray-400">파고</p>
                <p className="font-semibold">{beach.waveHeight}m</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                <Users className="w-5 h-5 mx-auto mb-1 text-wave-500" />
                <p className="text-sm text-gray-600 dark:text-gray-400">혼잡도</p>
                <Badge variant={crowdColors[beach.crowdLevel]}>
                  {crowdText[beach.crowdLevel]}
                </Badge>
              </div>
            </div>

            {/* 활동 태그 */}
            <div className="flex flex-wrap gap-2">
              {beach.activities.map((activity) => (
                <Badge key={activity} variant="info">
                  {activity}
                </Badge>
              ))}
            </div>

            {/* 이벤트 정보 */}
            {beach.event && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  오늘 {beach.event.time} - {beach.event.name}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}