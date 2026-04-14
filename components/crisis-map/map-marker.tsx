'use client'

import { cn } from '@/lib/utils'

export type MarkerCategory = 'health' | 'food' | 'disaster' | 'education'

export interface MarkerData {
  id: string
  title: string
  category: MarkerCategory
  severity: 'critical' | 'high' | 'medium' | 'low'
  peopleAffected: number
  ngoName: string
  resources: string[]
  volunteers: { name: string; role: string }[]
  position: { x: number; y: number }
}

interface MapMarkerProps {
  marker: MarkerData
  isSelected: boolean
  onClick: () => void
}

const categoryColors: Record<MarkerCategory, string> = {
  health: 'bg-red-500',
  food: 'bg-orange-500',
  disaster: 'bg-yellow-500',
  education: 'bg-blue-500',
}

const categoryPulseColors: Record<MarkerCategory, string> = {
  health: 'bg-red-400',
  food: 'bg-orange-400',
  disaster: 'bg-yellow-400',
  education: 'bg-blue-400',
}

export function MapMarker({ marker, isSelected, onClick }: MapMarkerProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute z-10 transition-all duration-200 ease-out',
        'hover:scale-125 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent',
        isSelected && 'scale-125 z-20'
      )}
      style={{
        left: `${marker.position.x}%`,
        top: `${marker.position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      aria-label={`${marker.title} - ${marker.category} issue`}
    >
      {/* Pulse animation for high severity */}
      {(marker.severity === 'critical' || marker.severity === 'high') && (
        <span
          className={cn(
            'absolute inset-0 rounded-full animate-ping opacity-75',
            categoryPulseColors[marker.category]
          )}
        />
      )}
      
      {/* Main marker dot */}
      <span
        className={cn(
          'relative block w-4 h-4 rounded-full border-2 border-white shadow-lg',
          categoryColors[marker.category],
          isSelected && 'ring-2 ring-white'
        )}
      />
    </button>
  )
}
