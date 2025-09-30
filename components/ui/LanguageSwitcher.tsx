'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'

const languages = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
]

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLocale, setCurrentLocale] = useState('ko')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 컴포넌트 마운트 시 localStorage에서 언어 설정 읽기
    const savedLocale = localStorage.getItem('locale') || 'ko'
    setCurrentLocale(savedLocale)
  }, [])

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLanguageChange = (langCode: string) => {
    if (langCode !== currentLocale) {
      // localStorage에 저장
      localStorage.setItem('locale', langCode)
      setCurrentLocale(langCode)

      // 커스텀 이벤트 발생시켜 ClientWrapper가 감지할 수 있도록 함
      window.dispatchEvent(new Event('localeChange'))

      // 페이지 새로고침 (간단한 방법)
      window.location.reload()
    }
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-beach-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-colors"
      >
        <span className="text-xl">{currentLanguage.flag}</span>
        <span className="font-medium text-sm">{currentLanguage.name}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-beach-200 dark:border-gray-700 overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                whileHover={{ backgroundColor: 'rgba(14, 165, 233, 0.1)' }}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-4 py-3 flex items-center space-x-3 transition-colors ${
                  lang.code === currentLocale
                    ? 'bg-beach-50 dark:bg-beach-900/20'
                    : 'hover:bg-beach-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium text-sm">{lang.name}</span>
                {lang.code === currentLocale && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-2 h-2 bg-beach-500 rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}