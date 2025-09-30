'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  X, MapPin, Thermometer, Waves, Wind, Users,
  Car, Train, Clock, ShowerHead, Coffee, Store,
  Sparkles, Calendar, Navigation, Star
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { BeachRecommendation } from '@/types'

interface BeachDetailModalProps {
  beach: BeachRecommendation
  isOpen: boolean
  onClose: () => void
}

export default function BeachDetailModal({ beach, isOpen, onClose }: BeachDetailModalProps) {
  const t = useTranslations()

  const facilitiesIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    '샤워실': ShowerHead,
    '화장실': Store,
    '주차장': Car,
    '편의점': Store,
    '카페': Coffee,
    '서핑샵': Waves,
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* 모달 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* 헤더 이미지 */}
            <div className="relative h-48 bg-gradient-to-br from-beach-400 to-wave-400">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* 매치 스코어 */}
              <div className="absolute bottom-4 left-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold text-beach-600">{beach.matchScore}%</div>
                  <div className="text-xs text-gray-600">{t('beach.matchScore')}</div>
                </div>
              </div>

              {/* 평점 */}
              <div className="absolute bottom-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center">
                  <Star className="w-5 h-5 text-amber-400 mr-1" />
                  <span className="font-bold">{beach.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* 스크롤 가능한 컨텐츠 */}
            <div className="overflow-y-auto max-h-[calc(100vh-16rem)] md:max-h-[60vh] p-6 space-y-6">
              {/* 기본 정보 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  {beach.beach.name}
                </h2>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{beach.beach.location}</span>
                </div>
              </div>

              {/* 이벤트 정보 */}
              {beach.event && (
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-4 border border-amber-300 dark:border-amber-700">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-amber-900 dark:text-amber-200">
                        {beach.event.name}
                      </h3>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        {beach.event.time} • {beach.event.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 날씨 정보 */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                  {t('beach.realTimeWeather')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <Thermometer className="w-4 h-4 text-coral-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{t('weather.temperature')}</span>
                    </div>
                    <div className="font-semibold">{beach.weather.temperature}{t('units.celsius')}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <Thermometer className="w-4 h-4 text-beach-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{t('weather.waterTemp')}</span>
                    </div>
                    <div className="font-semibold">{beach.weather.waterTemperature}{t('units.celsius')}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <Waves className="w-4 h-4 text-wave-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{t('weather.waveHeight')}</span>
                    </div>
                    <div className="font-semibold">{beach.weather.waveHeight}{t('units.meter')}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <Wind className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{t('weather.windSpeed')}</span>
                    </div>
                    <div className="font-semibold">{beach.weather.windSpeed}{t('units.meterPerSecond')}</div>
                  </div>
                </div>
              </div>

              {/* 혼잡도 */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                  {t('beach.expectedCrowds')}
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-wave-500" />
                      <span className="font-medium">{t('beach.currentCrowds')}</span>
                    </div>
                    <Badge variant={
                      beach.crowdLevel === 'low' ? 'success' :
                      beach.crowdLevel === 'medium' ? 'warning' : 'danger'
                    }>
                      {beach.crowdLevel === 'low' ? t('beach.low') :
                       beach.crowdLevel === 'medium' ? t('beach.medium') : t('beach.high')}
                    </Badge>
                  </div>
                  {/* 시간대별 혼잡도 예측 */}
                  <div className="grid grid-cols-4 gap-2 text-center text-sm">
                    {['09:00', '12:00', '15:00', '18:00'].map((time) => (
                      <div key={time} className="bg-white dark:bg-gray-800 rounded-lg p-2">
                        <div className="text-gray-500 dark:text-gray-400 text-xs">{time}</div>
                        <div className="h-8 w-full bg-gray-200 dark:bg-gray-600 rounded mt-1 relative overflow-hidden">
                          <div
                            className="absolute bottom-0 left-0 right-0 bg-beach-400"
                            style={{ height: `${Math.random() * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 추천 활동 */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                  {t('beach.recommendedActivities')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {beach.activities.map((activity) => (
                    <Badge key={activity} variant="info" className="text-sm py-1.5 px-3">
                      <Sparkles className="w-3 h-3 mr-1 inline" />
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 편의시설 */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                  {t('beach.facilities')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {beach.beach.facilities.map((facility) => {
                    const Icon = facilitiesIcons[facility] || Store
                    return (
                      <div key={facility} className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{facility}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 교통 정보 */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                  {t('beach.transportation')}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Car className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{t('beach.car')}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t('beach.parkingAvailable')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Train className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{t('beach.publicTransport')}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t('beach.subwayLine2')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  className="flex-1 flex items-center justify-center space-x-2"
                  onClick={() => {
                    // 네이버 지도 연결
                    window.open(`https://map.naver.com/v5/search/${encodeURIComponent(beach.beach.name)}`)
                  }}
                >
                  <Navigation className="w-4 h-4" />
                  <span>{t('common.findRoute')}</span>
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={onClose}
                >
                  {t('common.close')}
                </Button>
              </div>
            </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}