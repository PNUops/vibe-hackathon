'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import Toast, { ToastProps, ToastType } from './Toast'

interface ToastContextType {
  showToast: (message: string, type?: ToastType, description?: string, duration?: number) => void
  success: (message: string, description?: string) => void
  error: (message: string, description?: string) => void
  warning: (message: string, description?: string) => void
  info: (message: string, description?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((
    message: string,
    type: ToastType = 'info',
    description?: string,
    duration?: number
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    const newToast: ToastProps = {
      id,
      type,
      message,
      description,
      duration,
      onClose: () => removeToast(id)
    }

    setToasts((prev) => [...prev, newToast])

    // 최대 3개까지만 표시
    setToasts((prev) => prev.slice(-3))
  }, [removeToast])

  const success = useCallback((message: string, description?: string) => {
    showToast(message, 'success', description)
  }, [showToast])

  const error = useCallback((message: string, description?: string) => {
    showToast(message, 'error', description)
  }, [showToast])

  const warning = useCallback((message: string, description?: string) => {
    showToast(message, 'warning', description)
  }, [showToast])

  const info = useCallback((message: string, description?: string) => {
    showToast(message, 'info', description)
  }, [showToast])

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}

      {/* 토스트 컨테이너 */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast {...toast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}