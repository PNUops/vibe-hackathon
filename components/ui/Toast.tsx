'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string
  type: ToastType
  message: string
  description?: string
  duration?: number
  onClose?: () => void
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
}

const colors = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    text: 'text-green-900 dark:text-green-100'
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    text: 'text-red-900 dark:text-red-100'
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    text: 'text-yellow-900 dark:text-yellow-100'
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-900 dark:text-blue-100'
  }
}

export default function Toast({
  id,
  type,
  message,
  description,
  duration = 5000,
  onClose
}: ToastProps) {
  const Icon = icons[type]
  const colorScheme = colors[type]

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
      className={`
        relative overflow-hidden
        ${colorScheme.bg} ${colorScheme.border}
        border-2 rounded-xl shadow-lg
        backdrop-blur-xl
        p-4 pr-12
        min-w-[300px] max-w-md
      `}
    >
      {/* 진행 바 */}
      {duration > 0 && (
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`absolute bottom-0 left-0 right-0 h-1 ${colorScheme.icon.replace('text-', 'bg-')} origin-left`}
        />
      )}

      <div className="flex items-start gap-3">
        {/* 아이콘 */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: 'spring' }}
        >
          <Icon className={`w-6 h-6 ${colorScheme.icon}`} />
        </motion.div>

        {/* 내용 */}
        <div className="flex-1 pt-0.5">
          <p className={`font-semibold ${colorScheme.text}`}>
            {message}
          </p>
          {description && (
            <p className={`text-sm mt-1 ${colorScheme.text} opacity-80`}>
              {description}
            </p>
          )}
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 ${colorScheme.icon} hover:opacity-70 transition-opacity`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  )
}