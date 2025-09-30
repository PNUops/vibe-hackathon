'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, MapPin, Filter } from 'lucide-react'
import { useRouter } from 'next/navigation'
import RecommendationHero from '@/components/recommendation/RecommendationHero'
import WaterLocationCard from '@/components/water/WaterLocationCard'
import AIReasonBubble from '@/components/ui/AIReasonBubble'
import SkeletonLoader from '@/components/ui/SkeletonLoader'
import Button from '@/components/ui/Button'
import useStore from '@/store/useStore'
import { WaterActivityService } from '@/lib/api/services/WaterActivityService'
import { WaterActivityRecommendation } from '@/types/water-activities'

export default function RecommendationsPage() {
  const router = useRouter()
  const { userPreferences } = useStore()
  const [recommendations, setRecommendations] = useState<WaterActivityRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [showAIAssistant, setShowAIAssistant] = useState(true)

  useEffect(() => {
    loadRecommendations()
  }, [])

  const loadRecommendations = async () => {
    setLoading(true)
    try {
      const service = WaterActivityService.getInstance()

      // 사용자 위치 (임시로 부산 중심 좌표 사용)
      const userLocation = {
        latitude: 35.1796,
        longitude: 129.0756
      }

      // 추천 받기
      const results = await service.getRecommendations(
        {
          activityTypes: ['beach', 'valley', 'mudflat', 'marine_sports'],
          crowdSensitivity: userPreferences?.crowdSensitivity || 'medium',
          maxDistance: userPreferences?.maxDistance || 50,
          purpose: userPreferences?.purpose || 'swimming',
          waterTempPreference: userPreferences?.waterTempPreference || 'moderate',
          companionType: userPreferences?.companionType,
          preferredActivities: userPreferences?.preferredActivities,
          preferredTime: userPreferences?.preferredTime,
          budgetRange: userPreferences?.budgetRange,
          ageGroup: userPreferences?.ageGroup,
          accessibility: {
            needsParking: false,
            publicTransportOnly: false,
            wheelchairAccess: userPreferences?.specialNeeds?.wheelchairAccess || false
          },
          specialNeeds: userPreferences?.specialNeeds
        },
        userLocation
      )

      setRecommendations(results)
    } catch (error) {
      console.error('Failed to load recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const topRecommendation = recommendations[0]
  const otherRecommendations = recommendations.slice(1)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-beach-50 to-wave-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="container mx-auto max-w-7xl">
          <SkeletonLoader variant="hero" />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader variant="card" count={6} />
          </div>
        </div>
      </div>
    )
  }

  if (!topRecommendation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-beach-50 to-wave-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">추천 결과를 찾을 수 없습니다.</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            돌아가기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-beach-50 via-wave-50 to-coral-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-beach-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-7xl">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </Button>

          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-6 h-6 text-beach-500" />
            </motion.div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-beach-600 to-wave-600 bg-clip-text text-transparent">
              AI 맞춤 추천
            </h1>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={loadRecommendations}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            재추천
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* AI 어시스턴트 */}
        <div className="fixed bottom-8 right-8 z-50">
          <AIReasonBubble
            reasons={topRecommendation.matchReasons}
            position="left"
            autoShow={showAIAssistant}
            animated={true}
            onClose={() => setShowAIAssistant(false)}
          />
        </div>

        {/* 최고 추천 히어로 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 text-white rounded-full font-bold shadow-lg mb-4"
            >
              <Sparkles className="w-5 h-5" />
              당신을 위한 최고의 추천
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400">
              {userPreferences?.companionType === 'family' && '가족과 함께 '}
              {userPreferences?.companionType === 'couple' && '연인과 함께 '}
              {userPreferences?.companionType === 'friends' && '친구들과 함께 '}
              {userPreferences?.companionType === 'solo' && '혼자서 '}
              즐기기 완벽한 장소
            </p>
          </div>

          <RecommendationHero
            location={topRecommendation.location}
            matchScore={topRecommendation.matchScore}
            matchReasons={topRecommendation.matchReasons}
            weather={topRecommendation.weather}
            distance={topRecommendation.distance}
            onSelect={() => {
              // 상세 페이지로 이동
              console.log('상세 페이지로 이동')
            }}
            onShare={() => {
              // 공유 기능
              console.log('공유')
            }}
            onFavorite={() => {
              // 즐겨찾기 기능
              console.log('즐겨찾기')
            }}
          />
        </motion.div>

        {/* 다른 추천 장소들 */}
        {otherRecommendations.length > 0 && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-6"
            >
              <MapPin className="w-6 h-6 text-beach-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                다른 추천 장소
              </h2>
              <span className="text-gray-500 dark:text-gray-400">
                ({otherRecommendations.length}개)
              </span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherRecommendations.map((recommendation, index) => (
                <motion.div
                  key={recommendation.location.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <WaterLocationCard
                    location={recommendation.location}
                    rank={index + 2}
                    showMatchScore={true}
                    matchScore={recommendation.matchScore}
                    onClick={() => {
                      console.log('카드 클릭:', recommendation.location.name)
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 추가 정보 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-full shadow-lg">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              AI가 {recommendations.length}개의 장소를 분석하여 선별했습니다
            </span>
          </div>
        </motion.div>
      </main>
    </div>
  )
}