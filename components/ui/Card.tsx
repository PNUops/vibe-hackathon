'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  gradient?: boolean
  onClick?: () => void
}

export default function Card({ children, className = '', gradient = false, onClick }: CardProps) {
  const baseClasses = gradient
    ? 'bg-gradient-to-br from-beach-100 to-wave-100 dark:from-beach-800 dark:to-wave-800'
    : 'bg-white dark:bg-card'

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}