'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Waves, Thermometer, Users, MapPin } from 'lucide-react'
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
              onClick={() => setPreferences({ ...preferences, purpose: option.id as any })}
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
              onClick={() => setPreferences({ ...preferences, waterTempPreference: option.id as any })}
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
              onClick={() => setPreferences({ ...preferences, crowdSensitivity: option.id as any })}
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