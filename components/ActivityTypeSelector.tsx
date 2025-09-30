'use client'

import { useState } from 'react'
import { Waves, Mountain, Shell, Anchor } from 'lucide-react'

export type ActivityType = 'beach' | 'valley' | 'mudflat' | 'marine_sports' | 'all'

interface ActivityTypeSelectorProps {
  selectedType: ActivityType
  onTypeChange: (type: ActivityType) => void
}

const activityTypes = [
  {
    type: 'all' as ActivityType,
    label: '전체',
    labelEn: 'All',
    icon: null,
    color: 'bg-gray-500'
  },
  {
    type: 'beach' as ActivityType,
    label: '해수욕장',
    labelEn: 'Beach',
    icon: Waves,
    color: 'bg-blue-500'
  },
  {
    type: 'valley' as ActivityType,
    label: '계곡',
    labelEn: 'Valley',
    icon: Mountain,
    color: 'bg-green-500'
  },
  {
    type: 'mudflat' as ActivityType,
    label: '갯벌',
    labelEn: 'Mudflat',
    icon: Shell,
    color: 'bg-yellow-600'
  },
  {
    type: 'marine_sports' as ActivityType,
    label: '해양스포츠',
    labelEn: 'Marine Sports',
    icon: Anchor,
    color: 'bg-purple-500'
  }
]

export default function ActivityTypeSelector({
  selectedType,
  onTypeChange
}: ActivityTypeSelectorProps) {
  const locale = typeof window !== 'undefined' ? localStorage.getItem('locale') || 'ko' : 'ko'

  return (
    <div className="flex flex-wrap gap-2 p-4">
      {activityTypes.map((activity) => {
        const Icon = activity.icon
        const isSelected = selectedType === activity.type
        const label = locale === 'ko' ? activity.label : activity.labelEn

        return (
          <button
            key={activity.type}
            onClick={() => onTypeChange(activity.type)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full
              transition-all duration-200 transform
              ${isSelected
                ? `${activity.color} text-white shadow-lg scale-105`
                : 'bg-white text-gray-700 shadow-md hover:shadow-lg hover:scale-102'
              }
            `}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span className="text-sm font-medium">{label}</span>
          </button>
        )
      })}
    </div>
  )
}