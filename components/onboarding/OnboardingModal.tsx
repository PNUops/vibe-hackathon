'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Waves, Thermometer, Users, MapPin } from 'lucide-react'
import Button from '../ui/Button'
import useStore from '@/store/useStore'
import { UserPreferences } from '@/types'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export default function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
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
      title: '무엇을 하러 가시나요?',
      description: '주요 활동 목적을 선택해주세요',
      icon: Waves,
      content: (
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'swimming', label: '수영', description: '물놀이와 수영' },
            { id: 'surfing', label: '서핑', description: '파도타기와 보드' },
            { id: 'family', label: '가족나들이', description: '가족과 함께' },
            { id: 'walking', label: '산책', description: '해변 산책과 휴식' },
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
      title: '물 온도 선호도',
      description: '선호하는 물 온도를 알려주세요',
      icon: Thermometer,
      content: (
        <div className="space-y-4">
          {[
            { id: 'cold', label: '시원한 물', temp: '20°C 이하', color: 'from-blue-400 to-blue-500' },
            { id: 'moderate', label: '적당한 물', temp: '21-24°C', color: 'from-beach-400 to-beach-500' },
            { id: 'warm', label: '따뜻한 물', temp: '25°C 이상', color: 'from-coral-400 to-coral-500' },
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
      title: '혼잡도 민감도',
      description: '사람이 많은 곳을 괜찮아하시나요?',
      icon: Users,
      content: (
        <div className="space-y-4">
          {[
            { id: 'high', label: '북적여도 괜찮아요', description: '활기찬 분위기 선호' },
            { id: 'medium', label: '적당히 있으면 좋아요', description: '균형잡힌 분위기' },
            { id: 'low', label: '조용한 곳이 좋아요', description: '한적한 해변 선호' },
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
      title: '이동 거리',
      description: '최대 몇 km까지 이동 가능하신가요?',
      icon: MapPin,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-beach-600 mb-2">
              {preferences.maxDistance}km
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              현재 위치에서 최대 거리
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
                  <span>이전</span>
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
                  <span>{currentStep === steps.length - 1 ? '완료' : '다음'}</span>
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