'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Waves, RefreshCw, MapPin, TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import WaterLocationList from '@/components/water/WaterLocationList'
import WeatherWidget from '@/components/weather/WeatherWidget'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import useStore from '@/store/useStore'
import OnboardingModal from '@/components/onboarding/OnboardingModal'
import BeachDetailModal from '@/components/beach/BeachDetailModal'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import LanguageSelectionModal from '@/components/LanguageSelectionModal'
import { WaterLocation } from '@/types/water-activities'
import { WaterActivityService } from '@/lib/api/services/WaterActivityService'

// 현재 날씨 정보 (Mock)
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
    selectedBeach,
    setSelectedBeach
  } = useStore()

  const [showLanguageSelection, setShowLanguageSelection] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<WaterLocation | null>(null)
  const [popularLocations, setPopularLocations] = useState<WaterLocation[]>([])
  const [loadingPopular, setLoadingPopular] = useState(true)

  useEffect(() => {
    // 언어 선택 체크
    const hasSelectedLanguage = localStorage.getItem('language-selected')
    if (!hasSelectedLanguage) {
      setShowLanguageSelection(true)
      return // 언어 선택이 우선
    }

    // 언어를 이미 선택했다면 온보딩 체크 (초기 마운트 시에만)
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true)
    }

    // 인기 장소 로드
    loadPopularLocations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 초기 마운트 시에만 실행

  const loadPopularLocations = async () => {
    try {
      setLoadingPopular(true)
      const service = WaterActivityService.getInstance()
      const popular = await service.getPopularLocations(3)
      setPopularLocations(popular)
    } catch (error) {
      console.error('Failed to load popular locations:', error)
    } finally {
      setLoadingPopular(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await loadPopularLocations()
      // WaterLocationList 컴포넌트가 자동으로 데이터를 다시 로드하므로
      // 페이지 전체를 리로드할 필요 없음
    } catch (error) {
      console.error('Failed to refresh:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleOnboardingComplete = async () => {
    setHasCompletedOnboarding(true)
    setShowOnboarding(false)
    // 추천 페이지로 이동
    window.location.href = '/recommendations'
  }

  const handleLanguageSelect = () => {
    setShowLanguageSelection(false)
    // 페이지 새로고침하여 선택한 언어 적용
    window.location.reload()
  }

  const handleLocationClick = (location: WaterLocation) => {
    setSelectedLocation(location)
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
              🌊 부산 물놀이 통합 플랫폼
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              해수욕장, 계곡, 갯벌, 해양스포츠를 한 곳에서
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 메인 컨텐츠 - 전체 물놀이 장소 리스트 */}
            <div className="lg:col-span-2">
              <WaterLocationList
                onLocationClick={handleLocationClick}
              />
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 날씨 위젯 */}
              <WeatherWidget weather={mockWeather} />

              {/* 인기 장소 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-red-500" />
                  인기 장소 TOP 3
                </h3>
                {loadingPopular ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beach-500 mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {popularLocations.map((location, index) => (
                      <div
                        key={location.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                        onClick={() => handleLocationClick(location)}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-bold text-gray-400">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-100">
                              {location.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {location.district}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {location.type === 'beach' && '🏖️'}
                            {location.type === 'valley' && '⛰️'}
                            {location.type === 'mudflat' && '🦀'}
                            {location.type === 'marine_sports' && '🏄'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 물놀이 안전 정보 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                  오늘의 물놀이 정보
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">특보</span>
                    <Badge variant="success">정상</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">수질</span>
                    <Badge variant="info">매우좋음</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">자외선</span>
                    <Badge variant="warning">높음</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">조류</span>
                    <Badge variant="default">보통</Badge>
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

      {/* 상세 정보 모달 - 추후 WaterLocationDetail 컴포넌트로 대체 예정 */}
      {selectedLocation && selectedBeach && (
        <BeachDetailModal
          beach={selectedBeach}
          isOpen={!!selectedBeach}
          onClose={() => {
            setSelectedBeach(null)
            setSelectedLocation(null)
          }}
        />
      )}
    </>
  );
}
