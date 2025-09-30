'use client'

import { motion } from 'framer-motion'
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface WeatherData {
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  visibility: number
  icon: 'sun' | 'cloud' | 'rain'
}

interface WeatherWidgetProps {
  weather: WeatherData
}

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  const t = useTranslations()

  const WeatherIcon = {
    sun: Sun,
    cloud: Cloud,
    rain: CloudRain,
  }[weather.icon]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-beach-400 to-wave-400 rounded-2xl p-6 text-white shadow-xl"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold opacity-90">{t('weather.current')}</h3>
          <p className="text-4xl font-bold mt-2">{weather.temperature}°</p>
          <p className="text-sm opacity-80 mt-1">{weather.description}</p>
        </div>
        <motion.div
          animate={{
            rotate: weather.icon === 'sun' ? [0, 360] : 0,
            y: weather.icon === 'rain' ? [0, 5, 0] : 0,
          }}
          transition={{
            duration: weather.icon === 'sun' ? 20 : 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <WeatherIcon className="w-16 h-16 opacity-90" />
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center justify-center mb-1">
            <Droplets className="w-4 h-4" />
          </div>
          <p className="text-xs text-center opacity-80">{t('weather.humidity')}</p>
          <p className="text-sm font-semibold text-center">{weather.humidity}{t('units.percent')}</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center justify-center mb-1">
            <Wind className="w-4 h-4" />
          </div>
          <p className="text-xs text-center opacity-80">{t('weather.windSpeed')}</p>
          <p className="text-sm font-semibold text-center">{weather.windSpeed}{t('units.meterPerSecond')}</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center justify-center mb-1">
            <Eye className="w-4 h-4" />
          </div>
          <p className="text-xs text-center opacity-80">{t('weather.visibility')}</p>
          <p className="text-sm font-semibold text-center">{weather.visibility}{t('units.kilometer')}</p>
        </div>
      </div>
    </motion.div>
  )
}