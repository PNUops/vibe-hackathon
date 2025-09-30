'use client'

import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  variant?: 'card' | 'list' | 'hero' | 'text'
  count?: number
  className?: string
}

export default function SkeletonLoader({
  variant = 'card',
  count = 1,
  className = ''
}: SkeletonLoaderProps) {
  const shimmer = {
    hidden: { backgroundPosition: '-1000px 0' },
    visible: {
      backgroundPosition: '1000px 0',
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  }

  const SkeletonBox = ({ className: boxClassName }: { className: string }) => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={shimmer}
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded ${boxClassName}`}
      style={{
        backgroundSize: '1000px 100%'
      }}
    />
  )

  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 space-y-4 ${className}`}>
            {/* 순위 뱃지 */}
            <div className="flex justify-between items-start">
              <div className="space-y-3 flex-1">
                {/* 타입 태그 */}
                <SkeletonBox className="h-6 w-24" />
                {/* 제목 */}
                <SkeletonBox className="h-8 w-3/4" />
                {/* 위치 */}
                <SkeletonBox className="h-4 w-1/2" />
              </div>
              {/* 평점/스코어 */}
              <SkeletonBox className="h-16 w-16 rounded-full" />
            </div>

            {/* 정보 그리드 */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 space-y-2">
                  <SkeletonBox className="h-4 w-4 rounded-full mx-auto" />
                  <SkeletonBox className="h-3 w-12 mx-auto" />
                  <SkeletonBox className="h-4 w-16 mx-auto" />
                </div>
              ))}
            </div>

            {/* 태그 */}
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <SkeletonBox key={i} className="h-6 w-20 rounded-full" />
              ))}
            </div>

            {/* 접근성 정보 */}
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <SkeletonBox key={i} className="h-4 w-24" />
              ))}
            </div>
          </div>
        )

      case 'hero':
        return (
          <div className={`bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 ${className}`}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* 왼쪽 정보 */}
              <div className="space-y-6">
                {/* 뱃지 */}
                <SkeletonBox className="h-10 w-40 rounded-full" />

                {/* 제목 */}
                <div className="space-y-3">
                  <SkeletonBox className="h-12 w-full" />
                  <SkeletonBox className="h-6 w-2/3" />
                </div>

                {/* 정보 카드 그리드 */}
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl space-y-2">
                      <SkeletonBox className="h-4 w-16" />
                      <SkeletonBox className="h-6 w-20" />
                    </div>
                  ))}
                </div>

                {/* 추천 이유 */}
                <div className="space-y-3">
                  <SkeletonBox className="h-5 w-32" />
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4].map((i) => (
                      <SkeletonBox key={i} className="h-8 w-24 rounded-full" />
                    ))}
                  </div>
                </div>

                {/* 버튼 */}
                <div className="flex gap-3">
                  <SkeletonBox className="h-12 flex-1 rounded-lg" />
                  <SkeletonBox className="h-12 w-12 rounded-lg" />
                  <SkeletonBox className="h-12 w-12 rounded-lg" />
                </div>
              </div>

              {/* 오른쪽 스코어 */}
              <div className="flex justify-center">
                <SkeletonBox className="h-40 w-40 rounded-full" />
              </div>
            </div>
          </div>
        )

      case 'list':
        return (
          <div className={`space-y-4 ${className}`}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-4">
                <SkeletonBox className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <SkeletonBox className="h-5 w-3/4" />
                  <SkeletonBox className="h-4 w-1/2" />
                </div>
                <SkeletonBox className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        )

      case 'text':
        return (
          <div className={`space-y-3 ${className}`}>
            <SkeletonBox className="h-4 w-full" />
            <SkeletonBox className="h-4 w-5/6" />
            <SkeletonBox className="h-4 w-4/5" />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={count > 1 ? 'mb-4' : ''}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  )
}

// 개별 스켈레톤 컴포넌트들
export const SkeletonCard = () => <SkeletonLoader variant="card" />
export const SkeletonHero = () => <SkeletonLoader variant="hero" />
export const SkeletonList = () => <SkeletonLoader variant="list" count={3} />
export const SkeletonText = () => <SkeletonLoader variant="text" />