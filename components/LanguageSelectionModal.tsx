'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Globe } from 'lucide-react'
import Button from './ui/Button'

const languages = [
  { code: 'ko', name: '한국어', flag: '🇰🇷', welcome: '환영합니다' },
  { code: 'en', name: 'English', flag: '🇺🇸', welcome: 'Welcome' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', welcome: 'ようこそ' },
  { code: 'zh', name: '中文', flag: '🇨🇳', welcome: '欢迎' },
]

interface LanguageSelectionModalProps {
  isOpen: boolean
  onLanguageSelect: (langCode: string) => void
}

export default function LanguageSelectionModal({ isOpen, onLanguageSelect }: LanguageSelectionModalProps) {
  const handleLanguageSelect = (langCode: string) => {
    // localStorage에 저장
    localStorage.setItem('locale', langCode)
    localStorage.setItem('language-selected', 'true') // 언어를 선택했다는 표시
    onLanguageSelect(langCode)
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
          />

          {/* 모달 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* 헤더 */}
              <div className="bg-gradient-to-r from-beach-500 to-wave-500 p-6 text-white text-center">
                <Globe className="w-12 h-12 mx-auto mb-3" />
                <h2 className="text-2xl font-bold">MyWave</h2>
                <p className="text-beach-100 text-sm mt-2">Select your language / 언어를 선택하세요</p>
              </div>

              {/* 언어 선택 옵션 */}
              <div className="p-6 space-y-3">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-beach-500 hover:bg-beach-50 dark:hover:bg-beach-900/20 transition-all flex items-center space-x-4"
                  >
                    <span className="text-3xl">{lang.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-lg">{lang.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{lang.welcome}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}