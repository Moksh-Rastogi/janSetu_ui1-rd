'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Filter, MapPin, Radio, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface SearchSuggestion {
  type: 'location' | 'issue'
  label: string
  value: string
  coords?: [number, number]
}

interface MapControlsProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onSearchSubmit: (query: string) => void
  searchSuggestions: SearchSuggestion[]
  onSuggestionSelect: (suggestion: SearchSuggestion) => void
  noResults: boolean
  isLive: boolean
  onToggleLive: () => void
  onFilterClick: () => void
  onLocationClick: () => void
  selectedCity: string
  onCityChange: (city: string) => void
}

const CITIES = [
  { value: 'delhi', label: 'Delhi' },
  { value: 'mumbai', label: 'Mumbai' },
  { value: 'bangalore', label: 'Bangalore' },
  { value: 'chennai', label: 'Chennai' },
  { value: 'kolkata', label: 'Kolkata' },
]

export function MapControls({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  searchSuggestions,
  onSuggestionSelect,
  noResults,
  isLive,
  onToggleLive,
  onFilterClick,
  onLocationClick,
  selectedCity,
  onCityChange,
}: MapControlsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearchSubmit(searchQuery)
      setShowSuggestions(false)
    }
  }

  return (
    <div className="absolute top-4 left-4 right-4 z-30 flex items-center gap-3">
      {/* City Selector */}
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger className="w-[140px] bg-white/10 backdrop-blur-md border-white/20 text-white shrink-0">
          <SelectValue placeholder="Select City" />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-white/20">
          {CITIES.map((city) => (
            <SelectItem 
              key={city.value} 
              value={city.value}
              className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white"
            >
              {city.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Search Input with Suggestions */}
      <div ref={searchRef} className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60 z-10" />
        <Input
          placeholder="Search locations, issues..."
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-8 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30"
        />
        {searchQuery && (
          <button
            onClick={() => {
              onSearchChange('')
              setShowSuggestions(false)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Search Suggestions Dropdown */}
        {showSuggestions && searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl overflow-hidden">
            {noResults ? (
              <div className="px-4 py-3 text-white/60 text-sm text-center">
                Not registered yet
              </div>
            ) : searchSuggestions.length > 0 ? (
              <div className="max-h-[200px] overflow-y-auto">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onSuggestionSelect(suggestion)
                      setShowSuggestions(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 flex items-center gap-2 transition-colors"
                  >
                    {suggestion.type === 'location' ? (
                      <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
                    ) : (
                      <div className={cn(
                        'w-2 h-2 rounded-full shrink-0',
                        suggestion.value.includes('health') && 'bg-red-500',
                        suggestion.value.includes('food') && 'bg-orange-500',
                        suggestion.value.includes('disaster') && 'bg-yellow-500',
                        suggestion.value.includes('education') && 'bg-blue-500',
                        !suggestion.value.includes('health') && !suggestion.value.includes('food') && !suggestion.value.includes('disaster') && !suggestion.value.includes('education') && 'bg-gray-400'
                      )} />
                    )}
                    <span className="truncate">{suggestion.label}</span>
                    <span className="ml-auto text-xs text-white/40 shrink-0">
                      {suggestion.type === 'location' ? 'Location' : 'Issue'}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 text-white/60 text-sm text-center">
                Type to search locations or issues...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls Group */}
      <div className="flex items-center gap-2 shrink-0">
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
            'gap-2 px-3 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white',
            isLive && 'bg-red-500/20 border-red-400/40 text-red-300 hover:bg-red-500/30 hover:text-red-200'
          )}
        >
          <Radio className={cn('h-4 w-4', isLive && 'animate-pulse')} />
          <span className="text-sm">{isLive ? 'Live' : 'Paused'}</span>
        </Button>
      </div>
    </div>
  )
}
