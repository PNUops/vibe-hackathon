'use client'

import { useState, useEffect } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { ToastProvider } from './ui/ToastContainer'

const locales = ['ko', 'en', 'ja', 'zh'] as const
type Locale = (typeof locales)[number]

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('ko')
  const [messages, setMessages] = useState<Record<string, string> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // localStorage에서 언어 설정 읽기
    const savedLocale = localStorage.getItem('locale') as Locale
    const currentLocale = savedLocale && locales.includes(savedLocale) ? savedLocale : 'ko'
    setLocale(currentLocale)

    // 메시지 파일 동적 로드
    loadMessages(currentLocale)
  }, [])

  const loadMessages = async (locale: Locale) => {
    try {
      const messages = await import(`@/messages/${locale}.json`)
      setMessages(messages.default)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to load messages:', error)
      // 기본값으로 한국어 로드
      const messages = await import('@/messages/ko.json')
      setMessages(messages.default)
      setIsLoading(false)
    }
  }

  // 언어 변경 시 localStorage 업데이트 및 메시지 재로드
  useEffect(() => {
    const handleStorageChange = () => {
      const newLocale = localStorage.getItem('locale') as Locale
      if (newLocale && locales.includes(newLocale) && newLocale !== locale) {
        setLocale(newLocale)
        loadMessages(newLocale)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('localeChange', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('localeChange', handleStorageChange)
    }
  }, [locale])

  if (isLoading || !messages) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beach-600"></div>
      </div>
    )
  }

  return (
    <ToastProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </ToastProvider>
  )
}