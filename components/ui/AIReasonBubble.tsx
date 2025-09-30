'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Brain, MessageCircle, X, ChevronRight } from 'lucide-react'

interface AIReasonBubbleProps {
  reasons: string[]
  position?: 'top' | 'bottom' | 'left' | 'right'
  autoShow?: boolean
  showAvatar?: boolean
  animated?: boolean
  onClose?: () => void
}

export default function AIReasonBubble({
  reasons,
  position = 'right',
  autoShow = true,
  showAvatar = true,
  animated = true,
  onClose
}: AIReasonBubbleProps) {
  const [isVisible, setIsVisible] = useState(autoShow)
  const [currentReasonIndex, setCurrentReasonIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [displayedText, setDisplayedText] = useState('')

  // 타이핑 효과
  useEffect(() => {
    if (!animated || !isVisible || reasons.length === 0) {
      setDisplayedText(reasons[currentReasonIndex] || '')
      return
    }

    setIsTyping(true)
    const text = reasons[currentReasonIndex] || ''
    let index = 0
    setDisplayedText('')

    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.substring(0, index))
        index++
      } else {
        clearInterval(timer)
        setIsTyping(false)
      }
    }, 30)

    return () => clearInterval(timer)
  }, [currentReasonIndex, isVisible, animated, reasons])

  // 자동 순환
  useEffect(() => {
    if (!isVisible || reasons.length <= 1 || isTyping) return

    const timer = setTimeout(() => {
      setCurrentReasonIndex((prev) => (prev + 1) % reasons.length)
    }, 4000)

    return () => clearTimeout(timer)
  }, [currentReasonIndex, isVisible, reasons.length, isTyping])

  const handleNext = () => {
    setCurrentReasonIndex((prev) => (prev + 1) % reasons.length)
  }

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  // 위치별 스타일
  const positionStyles = {
    top: 'bottom-full mb-3',
    bottom: 'top-full mt-3',
    left: 'right-full mr-3',
    right: 'left-full ml-3'
  }

  // 말풍선 꼬리 스타일
  const tailStyles = {
    top: 'bottom-[-8px] left-1/2 transform -translate-x-1/2 border-t-white dark:border-t-gray-800',
    bottom: 'top-[-8px] left-1/2 transform -translate-x-1/2 border-b-white dark:border-b-gray-800',
    left: 'right-[-8px] top-1/2 transform -translate-y-1/2 border-l-white dark:border-l-gray-800',
    right: 'left-[-8px] top-1/2 transform -translate-y-1/2 border-r-white dark:border-r-gray-800'
  }

  return (
    <div className="relative">
      {/* Wave 아바타 */}
      {showAvatar && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsVisible(!isVisible)}
          className="relative cursor-pointer"
        >
          {/* 광원 효과 */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur-lg"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />

          {/* 아바타 본체 */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
            <motion.div
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          {/* 상태 표시 */}
          {isTyping && (
            <motion.div
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity
              }}
            />
          )}
        </motion.div>
      )}

      {/* 말풍선 */}
      <AnimatePresence>
        {isVisible && reasons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`absolute ${positionStyles[position]} z-50`}
          >
            <div className="relative min-w-[280px] max-w-[400px]">
              {/* 말풍선 본체 */}
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      추천 이유
                    </span>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 내용 */}
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentReasonIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed"
                    >
                      {displayedText}
                      {isTyping && (
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="inline-block w-0.5 h-4 bg-purple-500 ml-1"
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* 네비게이션 */}
                {reasons.length > 1 && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-1">
                      {reasons.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentReasonIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentReasonIndex
                              ? 'bg-purple-500'
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={handleNext}
                      className="text-purple-500 hover:text-purple-600 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* 이모지 반응 */}
                <div className="absolute -bottom-2 right-4 flex gap-1">
                  {['👍', '❤️', '🎉'].map((emoji) => (
                    <motion.button
                      key={emoji}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-md flex items-center justify-center text-sm hover:shadow-lg transition-shadow"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 말풍선 꼬리 */}
              <div
                className={`absolute w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 ${tailStyles[position]}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 떠다니는 아이콘 애니메이션 */}
      {isVisible && animated && (
        <div className="absolute inset-0 pointer-events-none">
          {[MessageCircle, Sparkles].map((Icon, index) => (
            <motion.div
              key={index}
              className="absolute"
              initial={{
                x: 0,
                y: 0,
                opacity: 0
              }}
              animate={{
                x: [0, (index % 2 ? 30 : -30), 0],
                y: [0, -50, -100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                delay: index * 1.5,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              <Icon className="w-4 h-4 text-purple-400" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}