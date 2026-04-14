'use client'

import { Search, Filter, MapPin, Radio } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MapControlsProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  isLive: boolean
  onToggleLive: () => void
  onFilterClick: () => void
  onLocationClick: () => void
}

export function MapControls({
  searchQuery,
  onSearchChange,
  isLive,
  onToggleLive,
  onFilterClick,
  onLocationClick,
}: MapControlsProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-30 flex items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
        <Input
          placeholder="Search locations, issues..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30"
        />
      </div>

      {/* Filter Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onFilterClick}
        className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white"
      >
        <Filter className="h-4 w-4" />
        <span className="sr-only">Filter</span>
      </Button>

      {/* Location Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onLocationClick}
        className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white"
      >
        <MapPin className="h-4 w-4" />
        <span className="sr-only">My Location</span>
      </Button>

      {/* Live Toggle */}
      <Button
        variant="outline"
        onClick={onToggleLive}
        className={cn(
          'gap-2 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white',
          isLive && 'bg-red-500/20 border-red-400/40 text-red-300 hover:bg-red-500/30 hover:text-red-200'
        )}
      >
        <Radio className={cn('h-4 w-4', isLive && 'animate-pulse')} />
        <span className="hidden sm:inline">{isLive ? 'Live' : 'Paused'}</span>
      </Button>
    </div>
  )
}
