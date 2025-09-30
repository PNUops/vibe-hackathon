'use client'

import { motion } from 'framer-motion'
import { Award, TrendingUp, Star, Zap, Trophy, Crown } from 'lucide-react'

interface MatchScoreVisualProps {
  score: number
  size?: 'small' | 'medium' | 'large'
  showLabel?: boolean
  animated?: boolean
  reasons?: string[]
}

export default function MatchScoreVisual({
  score,
  size = 'medium',
  showLabel = true,
  animated = true,
  reasons = []
}: MatchScoreVisualProps) {
  const sizes = {
    small: { width: 60, height: 60, radius: 25, strokeWidth: 5, fontSize: 'text-sm' },
    medium: { width: 100, height: 100, radius: 42, strokeWidth: 8, fontSize: 'text-lg' },
    large: { width: 150, height: 150, radius: 65, strokeWidth: 10, fontSize: 'text-2xl' }
  }

  const sizeConfig = sizes[size]
  const circumference = 2 * Math.PI * sizeConfig.radius

  // 점수별 색상 그라데이션
  const getGradientColors = () => {
    if (score >= 90) return ['#FFD700', '#FF6B35'] // 골드
    if (score >= 80) return ['#A855F7', '#EC4899'] // 퍼플-핑크
    if (score >= 70) return ['#3B82F6', '#8B5CF6'] // 블루-퍼플
    if (score >= 60) return ['#10B981', '#3B82F6'] // 그린-블루
    return ['#6B7280', '#9CA3AF'] // 그레이
  }

  const [startColor, endColor] = getGradientColors()

  // 점수별 아이콘
  const getScoreIcon = () => {
    if (score >= 95) return <Crown className="w-6 h-6 text-yellow-400" />
    if (score >= 90) return <Trophy className="w-6 h-6 text-yellow-400" />
    if (score >= 80) return <Award className="w-5 h-5 text-purple-400" />
    if (score >= 70) return <Star className="w-5 h-5 text-blue-400" />
    if (score >= 60) return <TrendingUp className="w-5 h-5 text-green-400" />
    return <Zap className="w-5 h-5 text-gray-400" />
  }

  // 점수별 레이블
  const getScoreLabel = () => {
    if (score >= 95) return '완벽한 매치!'
    if (score >= 90) return '최고의 선택!'
    if (score >= 80) return '강력 추천'
    if (score >= 70) return '좋은 선택'
    if (score >= 60) return '추천'
    return '고려해보세요'
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* 원형 프로그레스바 */}
      <div className="relative" style={{ width: sizeConfig.width, height: sizeConfig.height }}>
        {/* 배경 광선 효과 */}
        {score >= 90 && animated && (
          <motion.div
            className="absolute inset-0 -z-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-full h-1"
                style={{
                  background: `linear-gradient(90deg, transparent, ${startColor}40, transparent)`,
                  transform: `translate(-50%, -50%) rotate(${i * 60}deg)`,
                }}
              />
            ))}
          </motion.div>
        )}

        <svg
          className="transform -rotate-90"
          width={sizeConfig.width}
          height={sizeConfig.height}
        >
          {/* 배경 원 */}
          <circle
            cx={sizeConfig.width / 2}
            cy={sizeConfig.height / 2}
            r={sizeConfig.radius}
            stroke="currentColor"
            strokeWidth={sizeConfig.strokeWidth}
            fill="none"
            className="text-gray-200 dark:text-gray-700 opacity-30"
          />

          {/* 진행 원 */}
          <motion.circle
            cx={sizeConfig.width / 2}
            cy={sizeConfig.height / 2}
            r={sizeConfig.radius}
            stroke={`url(#gradient-${score})`}
            strokeWidth={sizeConfig.strokeWidth}
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
            transition={{ duration: animated ? 1.5 : 0, ease: "easeOut", delay: 0.2 }}
          />

          {/* 그라데이션 정의 */}
          <defs>
            <linearGradient id={`gradient-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
          </defs>
        </svg>

        {/* 중앙 콘텐츠 */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* 점수 */}
          <div className={`font-bold ${sizeConfig.fontSize} bg-gradient-to-r bg-clip-text text-transparent`}
               style={{ backgroundImage: `linear-gradient(to right, ${startColor}, ${endColor})` }}>
            {score}%
          </div>

          {/* 아이콘 */}
          {size !== 'small' && (
            <motion.div
              animate={score >= 90 ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
              transition={{ repeat: Infinity, duration: 2, delay: 1 }}
            >
              {getScoreIcon()}
            </motion.div>
          )}
        </motion.div>

        {/* 스파클 효과 */}
        {score >= 80 && animated && (
          <motion.div className="absolute inset-0 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                initial={{
                  x: sizeConfig.width / 2,
                  y: sizeConfig.height / 2,
                  opacity: 0
                }}
                animate={{
                  x: [
                    sizeConfig.width / 2,
                    sizeConfig.width / 2 + (Math.random() - 0.5) * sizeConfig.width
                  ],
                  y: [
                    sizeConfig.height / 2,
                    sizeConfig.height / 2 + (Math.random() - 0.5) * sizeConfig.height
                  ],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* 레이블 */}
      {showLabel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center space-y-2"
        >
          <div className="font-semibold text-gray-800 dark:text-gray-200">
            {getScoreLabel()}
          </div>

          {/* 추천 이유 */}
          {reasons.length > 0 && size !== 'small' && (
            <div className="space-y-1">
              {reasons.slice(0, 3).map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full inline-block mx-1"
                >
                  {reason}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}