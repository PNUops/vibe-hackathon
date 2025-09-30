'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Waves, Thermometer, Users, MapPin, UserCircle, Heart, Activity, Clock, Wallet, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Button from '../ui/Button'
import useStore from '@/store/useStore'
import { UserPreferences } from '@/types'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export default function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const t = useTranslations()
  const { setUserPreferences } = useStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [preferences, setPreferences] = useState<UserPreferences>({
    purpose: 'swimming',
    waterTempPreference: 'moderate',
    crowdSensitivity: 'medium',
    maxDistance: 30,
    ageGroup: 'twenties',
    companionType: 'friends',
    preferredActivities: [],
    preferredTime: 'afternoon',
    budgetRange: 'moderate',
    specialNeeds: {
      petFriendly: false,
      wheelchairAccess: false,
      babyFacilities: false,
      seniorFriendly: false,
    }
  })

  const steps = [
    {
      title: t('onboarding.title1'),
      description: t('onboarding.subtitle1'),
      icon: Waves,
      content: (
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'swimming', label: t('onboarding.swimming'), description: t('onboarding.swimmingDesc') },
            { id: 'surfing', label: t('onboarding.surfing'), description: t('onboarding.surfingDesc') },
            { id: 'family', label: t('onboarding.family'), description: t('onboarding.familyDesc') },
            { id: 'walking', label: t('onboarding.walking'), description: t('onboarding.walkingDesc') },
          ].map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPreferences({ ...preferences, purpose: option.id as 'swimming' | 'surfing' | 'family' | 'walking' })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                preferences.purpose === option.id
                  ? 'border-beach-500 bg-beach-50 dark:bg-beach-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-beach-300'
              }`}
            >
              <div className="font-semibold mb-1">{option.label}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{option.description}</div>
            </motion.button>
          ))}
        </div>
      ),
    },
    {
      title: t('onboarding.title2'),
      description: t('onboarding.subtitle2'),
      icon: Thermometer,
      content: (
        <div className="space-y-4">
          {[
            { id: 'cold', label: t('onboarding.coldWater'), temp: t('onboarding.coldWaterTemp'), color: 'from-blue-400 to-blue-500' },
            { id: 'moderate', label: t('onboarding.moderateWater'), temp: t('onboarding.moderateWaterTemp'), color: 'from-beach-400 to-beach-500' },
            { id: 'warm', label: t('onboarding.warmWater'), temp: t('onboarding.warmWaterTemp'), color: 'from-coral-400 to-coral-500' },
          ].map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPreferences({ ...preferences, waterTempPreference: option.id as 'cold' | 'moderate' | 'warm' })}
              className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                preferences.waterTempPreference === option.id
                  ? 'border-beach-500 bg-beach-50 dark:bg-beach-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-beach-300'
              }`}
            >
              <div className="text-left">
                <div className="font-semibold">{option.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{option.temp}</div>
              </div>
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${option.color}`} />
            </motion.button>
          ))}
        </div>
      ),
    },
    {
      title: t('onboarding.title3'),
      description: t('onboarding.subtitle3'),
      icon: Users,
      content: (
        <div className="space-y-4">
          {[
            { id: 'high', label: t('onboarding.crowdedOk'), description: t('onboarding.crowdedOkDesc') },
            { id: 'medium', label: t('onboarding.moderateCrowd'), description: t('onboarding.moderateCrowdDesc') },
            { id: 'low', label: t('onboarding.quietPlace'), description: t('onboarding.quietPlaceDesc') },
          ].map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPreferences({ ...preferences, crowdSensitivity: option.id as 'low' | 'medium' | 'high' })}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                preferences.crowdSensitivity === option.id
                  ? 'border-beach-500 bg-beach-50 dark:bg-beach-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-beach-300'
              }`}
            >
              <div className="font-semibold mb-1">{option.label}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{option.description}</div>
            </motion.button>
          ))}
        </div>
      ),
    },
    {
      title: t('onboarding.title4'),
      description: t('onboarding.subtitle4'),
      icon: MapPin,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-beach-600 mb-2">
              {preferences.maxDistance}{t('units.kilometer')}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('onboarding.maxDistance')}
            </div>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={preferences.maxDistance}
            onChange={(e) => setPreferences({ ...preferences, maxDistance: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-beach-500"
          />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>5km</span>
            <span>25km</span>
            <span>50km</span>
          </div>
        </div>
      ),
    },
    {
      title: '연령대 선택',
      description: '맞춤 추천을 위한 연령대 정보',
      icon: UserCircle,
      content: (
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'teens', label: '10대', emoji: '🎒' },
            { id: 'twenties', label: '20대', emoji: '🎓' },
            { id: 'thirties', label: '30대', emoji: '💼' },
            { id: 'forties', label: '40대', emoji: '👔' },
            { id: 'fifties', label: '50대', emoji: '🏆' },
            { id: 'sixties_plus', label: '60대 이상', emoji: '🌟' },
          ].map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPreferences({ ...preferences, ageGroup: option.id as 'teens' | 'twenties' | 'thirties' | 'forties' | 'fifties' | 'sixties_plus' })}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                preferences.ageGroup === option.id
                  ? 'border-beach-500 bg-gradient-to-br from-beach-50 to-wave-50 dark:from-beach-900/30 dark:to-wave-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-beach-300'
              }`}
            >
              <div className="text-2xl mb-2">{option.emoji}</div>
              <div className="font-semibold">{option.label}</div>
            </motion.button>
          ))}
        </div>
      ),
    },
    {
      title: '동행인 정보',
      description: '누구와 함께 가시나요?',
      icon: Heart,
      content: (
        <div className="space-y-3">
          {[
            { id: 'solo', label: '혼자', description: '나만의 힐링 시간', emoji: '🚶' },
            { id: 'couple', label: '연인', description: '로맨틱한 시간', emoji: '💑' },
            { id: 'family', label: '가족', description: '가족과 함께', emoji: '👨‍👩‍👧‍👦' },
            { id: 'friends', label: '친구', description: '친구들과 신나게', emoji: '👥' },
            { id: 'group', label: '단체', description: '모임/행사', emoji: '👫' },
          ].map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPreferences({ ...preferences, companionType: option.id as 'solo' | 'couple' | 'family' | 'friends' | 'group' })}
              className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                preferences.companionType === option.id
                  ? 'border-beach-500 bg-gradient-to-r from-beach-50 to-wave-50 dark:from-beach-900/30 dark:to-wave-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-beach-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{option.emoji}</span>
                <div className="text-left">
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{option.description}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      ),
    },
    {
      title: '선호 활동',
      description: '어떤 활동을 즐기시나요? (복수 선택 가능)',
      icon: Activity,
      content: (
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'swimming', label: '수영', emoji: '🏊' },
            { id: 'surfing', label: '서핑', emoji: '🏄' },
            { id: 'fishing', label: '낚시', emoji: '🎣' },
            { id: 'camping', label: '캠핑', emoji: '🏕️' },
            { id: 'snorkeling', label: '스노클링', emoji: '🤿' },
            { id: 'volleyball', label: '비치발리볼', emoji: '🏐' },
            { id: 'kayaking', label: '카약', emoji: '🛶' },
            { id: 'photography', label: '사진촬영', emoji: '📸' },
            { id: 'bbq', label: '바베큐', emoji: '🍖' },
          ].map((activity) => (
            <motion.button
              key={activity.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const activities = preferences.preferredActivities || []
                if (activities.includes(activity.id)) {
                  setPreferences({
                    ...preferences,
                    preferredActivities: activities.filter(a => a !== activity.id)
                  })
                } else {
                  setPreferences({
                    ...preferences,
                    preferredActivities: [...activities, activity.id]
                  })
                }
              }}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                preferences.preferredActivities?.includes(activity.id)
                  ? 'border-beach-500 bg-gradient-to-br from-beach-100 to-wave-100 dark:from-beach-900/40 dark:to-wave-900/40'
                  : 'border-gray-200 dark:border-gray-700 hover:border-beach-300'
              }`}
            >
              <div className="text-2xl mb-1">{activity.emoji}</div>
              <div className="text-xs font-medium">{activity.label}</div>
            </motion.button>
          ))}
        </div>
      ),
    },
    {
      title: '선호 시간대',
      description: '주로 언제 방문하시나요?',
      icon: Clock,
      content: (
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'morning', label: '아침', description: '06:00 - 12:00', gradient: 'from-yellow-200 to-orange-300' },
            { id: 'afternoon', label: '오후', description: '12:00 - 18:00', gradient: 'from-blue-300 to-blue-400' },
            { id: 'evening', label: '저녁', description: '18:00 - 21:00', gradient: 'from-orange-400 to-pink-400' },
            { id: 'night', label: '야간', description: '21:00 이후', gradient: 'from-purple-600 to-blue-900' },
          ].map((time) => (
            <motion.button
              key={time.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPreferences({ ...preferences, preferredTime: time.id as 'morning' | 'afternoon' | 'evening' | 'night' })}
              className={`relative p-4 rounded-xl border-2 overflow-hidden transition-all ${
                preferences.preferredTime === time.id
                  ? 'border-beach-500'
                  : 'border-gray-200 dark:border-gray-700 hover:border-beach-300'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${time.gradient} opacity-20`} />
              <div className="relative">
                <div className="font-semibold mb-1">{time.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{time.description}</div>
              </div>
            </motion.button>
          ))}
        </div>
      ),
    },
    {
      title: '예산 범위',
      description: '예상 지출 규모는?',
      icon: Wallet,
      content: (
        <div className="space-y-3">
          {[
            { id: 'free', label: '무료', description: '입장료 없는 곳만', color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20' },
            { id: 'budget', label: '저예산', description: '1인 2만원 이하', color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
            { id: 'moderate', label: '보통', description: '1인 2-5만원', color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' },
            { id: 'premium', label: '프리미엄', description: '1인 5만원 이상', color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
          ].map((budget) => (
            <motion.button
              key={budget.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPreferences({ ...preferences, budgetRange: budget.id as 'free' | 'budget' | 'moderate' | 'premium' })}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                preferences.budgetRange === budget.id
                  ? 'border-beach-500 ' + budget.bgColor
                  : 'border-gray-200 dark:border-gray-700 hover:border-beach-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <div className={`font-semibold ${preferences.budgetRange === budget.id ? budget.color : ''}`}>
                    {budget.label}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{budget.description}</div>
                </div>
                <div className={`text-2xl ${budget.color}`}>
                  {budget.id === 'free' && '🆓'}
                  {budget.id === 'budget' && '💰'}
                  {budget.id === 'moderate' && '💵'}
                  {budget.id === 'premium' && '💎'}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      ),
    },
    {
      title: '특별 요구사항',
      description: '특별히 필요한 시설이 있나요?',
      icon: Settings,
      content: (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            해당하는 항목을 모두 선택해주세요
          </div>
          {[
            { id: 'petFriendly', label: '반려동물 동반', icon: '🐕', description: '펫 프렌들리 장소' },
            { id: 'wheelchairAccess', label: '휠체어 접근', icon: '♿', description: '무장애 시설' },
            { id: 'babyFacilities', label: '유아 시설', icon: '👶', description: '수유실, 기저귀 교환대' },
            { id: 'seniorFriendly', label: '시니어 친화', icon: '👴', description: '어르신 편의시설' },
          ].map((need) => (
            <motion.div
              key={need.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setPreferences({
                ...preferences,
                specialNeeds: {
                  ...preferences.specialNeeds,
                  [need.id]: !preferences.specialNeeds?.[need.id as keyof typeof preferences.specialNeeds]
                }
              })}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                preferences.specialNeeds?.[need.id as keyof typeof preferences.specialNeeds]
                  ? 'border-beach-500 bg-beach-50 dark:bg-beach-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-beach-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{need.icon}</span>
                  <div>
                    <div className="font-semibold">{need.label}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{need.description}</div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  preferences.specialNeeds?.[need.id as keyof typeof preferences.specialNeeds]
                    ? 'bg-beach-500 border-beach-500'
                    : 'border-gray-300'
                }`}>
                  {preferences.specialNeeds?.[need.id as keyof typeof preferences.specialNeeds] && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-full h-full flex items-center justify-center text-white text-xs"
                    >
                      ✓
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ),
    },
  ]

  const handleComplete = () => {
    setUserPreferences(preferences)
    onComplete()
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepData = steps[currentStep]
  const Icon = currentStepData.icon

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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* 헤더 */}
            <div className="bg-gradient-to-r from-beach-500 to-wave-500 p-6 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <Icon className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
                  <p className="text-beach-100 text-sm mt-1">{currentStepData.description}</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-200 dark:bg-gray-700">
              <motion.div
                className="h-full bg-gradient-to-r from-beach-400 to-wave-400"
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* 컨텐츠 */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStepData.content}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 푸터 */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t('common.previous')}</span>
                </Button>

                <div className="flex space-x-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep
                          ? 'bg-beach-500'
                          : index < currentStep
                          ? 'bg-beach-300'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNext}
                  className="flex items-center space-x-2"
                >
                  <span>{currentStep === steps.length - 1 ? t('common.complete') : t('common.next')}</span>
                  <ChevronRight className="w-4 h-4" />
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