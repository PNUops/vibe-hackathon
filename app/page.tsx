'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Waves, Filter, RefreshCw, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import BeachCard from '@/components/beach/BeachCard'
import WeatherWidget from '@/components/weather/WeatherWidget'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import useStore from '@/store/useStore'
import OnboardingModal from '@/components/onboarding/OnboardingModal'
import BeachDetailModal from '@/components/beach/BeachDetailModal'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import LanguageSelectionModal from '@/components/LanguageSelectionModal'

// Mock 데이터 - 나중에 실제 API로 대체
const mockRecommendations = [
  {
    beach: {
      id: '1',
      name: '해운대 해수욕장',
      location: '부산 해운대구',
      latitude: 35.1587,
      longitude: 129.1604,
      facilities: ['샤워실', '화장실', '주차장', '편의점'],
    },
    weather: {
      temperature: 26,
      waterTemperature: 24,
      waveHeight: 0.8,
      windSpeed: 3.5,
      windDirection: 'E',
      humidity: 65,
      visibility: 10,
      description: '맑음',
      icon: 'sun' as const,
    },
    matchScore: 95,
    rating: 4.8,
    crowdLevel: 'medium' as const,
    activities: ['수영', '일광욕', '비치발리볼'],
    event: {
      id: 'e1',
      name: '부산 불꽃축제',
      location: '해운대 해수욕장',
      date: '2024-10-30',
      time: '19:00',
      description: '가을밤 해변 불꽃놀이',
      type: 'fireworks' as const,
    },
  },
  {
    beach: {
      id: '2',
      name: '광안리 해수욕장',
      location: '부산 수영구',
      latitude: 35.1532,
      longitude: 129.1189,
      facilities: ['샤워실', '화장실', '주차장', '카페'],
    },
    weather: {
      temperature: 25,
      waterTemperature: 23,
      waveHeight: 1.2,
      windSpeed: 5.0,
      windDirection: 'SE',
      humidity: 70,
      visibility: 8,
      description: '구름 조금',
      icon: 'cloud' as const,
    },
    matchScore: 88,
    rating: 4.6,
    crowdLevel: 'low' as const,
    activities: ['서핑', '카이트보딩', '산책'],
  },
  {
    beach: {
      id: '3',
      name: '송정 해수욕장',
      location: '부산 해운대구',
      latitude: 35.1785,
      longitude: 129.1997,
      facilities: ['샤워실', '서핑샵', '주차장'],
    },
    weather: {
      temperature: 24,
      waterTemperature: 22,
      waveHeight: 1.5,
      windSpeed: 6.0,
      windDirection: 'E',
      humidity: 68,
      visibility: 9,
      description: '맑음',
      icon: 'sun' as const,
    },
    matchScore: 82,
    rating: 4.5,
    crowdLevel: 'low' as const,
    activities: ['서핑', '낚시', '조깅'],
  },
]

const mockWeather = {
  temperature: 26,
  description: '맑음',
  humidity: 65,
  windSpeed: 3.5,
  visibility: 10,
  icon: 'sun' as const,
}

export default function Home() {
  const t = useTranslations()

  const {
    hasCompletedOnboarding,
    setHasCompletedOnboarding,
    recommendations,
    setRecommendations,
    selectedBeach,
    setSelectedBeach
  } = useStore()

  const [showLanguageSelection, setShowLanguageSelection] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const activityFilters = [
    { id: 'all', label: t('filters.all'), icon: Sparkles },
    { id: 'swimming', label: t('filters.swimming'), icon: Waves },
    { id: 'surfing', label: t('filters.surfing'), icon: Waves },
    { id: 'family', label: t('filters.family'), icon: Sparkles },
    { id: 'walking', label: t('filters.walking'), icon: Sparkles },
  ]

  useEffect(() => {
    // 언어 선택 체크
    const hasSelectedLanguage = localStorage.getItem('language-selected')
    if (!hasSelectedLanguage) {
      setShowLanguageSelection(true)
    } else {
      // 언어를 이미 선택했다면 온보딩 체크
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true)
      }
    }
    // Mock 데이터 설정
    setRecommendations(mockRecommendations)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true)
    setShowOnboarding(false)
    // 사용자 선호도에 따른 추천 데이터 가져오기
    handleRefresh()
  }

  const handleLanguageSelect = (langCode: string) => {
    setShowLanguageSelection(false)
    // 페이지 새로고침하여 선택한 언어 적용
    window.location.reload()
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-beach-50 to-wave-50 dark:from-gray-900 dark:to-gray-800">
        {/* 헤더 */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-beach-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Waves className="w-8 h-8 text-beach-500" />
              </motion.div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-beach-600 to-wave-600 bg-clip-text text-transparent">
                {t('common.appName')}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{t('common.refresh')}</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* 상단 소개 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {t('home.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('home.subtitle')}
            </p>
          </motion.div>

          {/* 필터 버튼 */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {activityFilters.map((filter) => {
              const Icon = filter.icon
              return (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-full transition-all
                    ${selectedFilter === filter.id
                      ? 'bg-beach-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-beach-100 dark:hover:bg-gray-700'}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                </motion.button>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 메인 컨텐츠 */}
            <div className="lg:col-span-2 space-y-6">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center"
              >
                <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
                {t('home.todaysTop3')}
              </motion.h3>

              {/* 해수욕장 카드 리스트 */}
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <BeachCard
                    key={rec.beach.id}
                    beach={{
                      id: rec.beach.id,
                      name: rec.beach.name,
                      location: rec.beach.location,
                      rating: rec.rating,
                      matchScore: rec.matchScore,
                      temperature: rec.weather.waterTemperature,
                      waveHeight: rec.weather.waveHeight,
                      crowdLevel: rec.crowdLevel,
                      activities: rec.activities,
                      event: rec.event,
                    }}
                    rank={index + 1}
                    onClick={() => setSelectedBeach(rec)}
                  />
                ))}
              </div>
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 날씨 위젯 */}
              <WeatherWidget weather={mockWeather} />

              {/* 빠른 정보 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                  {t('home.beachStatus')}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">{t('status.specialReport')}</span>
                    <Badge variant="success">{t('status.normal')}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">{t('status.waterQuality')}</span>
                    <Badge variant="info">{t('status.veryGood')}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">{t('status.uvIndex')}</span>
                    <Badge variant="warning">{t('status.high')}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">{t('status.current')}</span>
                    <Badge variant="default">{t('beach.medium')}</Badge>
                  </div>
                </div>
              </div>

              {/* CTA 버튼 */}
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setShowOnboarding(true)}
              >
                {t('home.resetPreferences')}
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* 언어 선택 모달 - 가장 먼저 표시 */}
      <LanguageSelectionModal
        isOpen={showLanguageSelection}
        onLanguageSelect={handleLanguageSelect}
      />

      {/* 온보딩 모달 */}
      {showOnboarding && !showLanguageSelection && (
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* 상세 정보 모달 */}
      {selectedBeach && (
        <BeachDetailModal
          beach={selectedBeach}
          isOpen={!!selectedBeach}
          onClose={() => setSelectedBeach(null)}
        />
      )}
    </>
  );
}
