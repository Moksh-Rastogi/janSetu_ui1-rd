'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { MapControls, type SearchSuggestion } from './map-controls'
import { type MarkerData } from './map-marker'
import { RightPanel } from './right-panel'
import { FilterPanel, type FilterState } from './filter-panel'
import { AIInsightCard } from './ai-insight-card'

// City coordinates and their regions for search
const CITY_DATA: Record<string, { center: [number, number]; zoom: number; regions: { name: string; coords: [number, number] }[] }> = {
  delhi: {
    center: [28.6139, 77.209],
    zoom: 11,
    regions: [
      { name: 'North Delhi', coords: [28.7041, 77.1025] },
      { name: 'South Delhi', coords: [28.5245, 77.2066] },
      { name: 'East Delhi', coords: [28.6280, 77.2950] },
      { name: 'West Delhi', coords: [28.6517, 77.0581] },
      { name: 'Central Delhi', coords: [28.6448, 77.2167] },
      { name: 'New Delhi', coords: [28.6139, 77.2090] },
      { name: 'Dwarka', coords: [28.5921, 77.0460] },
      { name: 'Rohini', coords: [28.7495, 77.0565] },
    ],
  },
  mumbai: {
    center: [19.076, 72.8777],
    zoom: 11,
    regions: [
      { name: 'South Mumbai', coords: [18.9322, 72.8264] },
      { name: 'Central Mumbai', coords: [19.0176, 72.8562] },
      { name: 'Western Suburbs', coords: [19.1136, 72.8697] },
      { name: 'Eastern Suburbs', coords: [19.0596, 72.9052] },
      { name: 'Navi Mumbai', coords: [19.0330, 73.0297] },
      { name: 'Thane', coords: [19.2183, 72.9781] },
    ],
  },
  bangalore: {
    center: [12.9716, 77.5946],
    zoom: 11,
    regions: [
      { name: 'Central Bangalore', coords: [12.9716, 77.5946] },
      { name: 'North Bangalore', coords: [13.0358, 77.5970] },
      { name: 'South Bangalore', coords: [12.8988, 77.5764] },
      { name: 'East Bangalore', coords: [12.9698, 77.6499] },
      { name: 'Whitefield', coords: [12.9698, 77.7500] },
      { name: 'Electronic City', coords: [12.8399, 77.6770] },
    ],
  },
  chennai: {
    center: [13.0827, 80.2707],
    zoom: 11,
    regions: [
      { name: 'Central Chennai', coords: [13.0827, 80.2707] },
      { name: 'North Chennai', coords: [13.1478, 80.2582] },
      { name: 'South Chennai', coords: [12.9815, 80.2180] },
      { name: 'West Chennai', coords: [13.0569, 80.1829] },
      { name: 'Velachery', coords: [12.9815, 80.2180] },
      { name: 'OMR', coords: [12.9165, 80.2270] },
    ],
  },
  kolkata: {
    center: [22.5726, 88.3639],
    zoom: 11,
    regions: [
      { name: 'Central Kolkata', coords: [22.5726, 88.3639] },
      { name: 'North Kolkata', coords: [22.6243, 88.3629] },
      { name: 'South Kolkata', coords: [22.5024, 88.3474] },
      { name: 'Salt Lake', coords: [22.5958, 88.4114] },
      { name: 'Howrah', coords: [22.5958, 88.2636] },
      { name: 'New Town', coords: [22.5958, 88.4614] },
    ],
  },
}

// Dynamically import LeafletMap to avoid SSR issues
const LeafletMap = dynamic(() => import('./leaflet-map').then((mod) => mod.LeafletMap), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
      <div className="text-white/60">Loading map...</div>
    </div>
  ),
})

// Mock data for markers
const MOCK_MARKERS: MarkerData[] = [
  {
    id: '1',
    title: 'Flood Relief Camp - District A',
    category: 'disaster',
    severity: 'critical',
    peopleAffected: 5200,
    ngoName: 'Red Cross India',
    resources: ['Medical Supplies', 'Food Packets', 'Tents', 'Clean Water'],
    volunteers: [
      { name: 'Raj Sharma', role: 'Medical Coordinator' },
      { name: 'Priya Patel', role: 'Logistics Lead' },
      { name: 'Amit Kumar', role: 'Volunteer Coordinator' },
    ],
    position: { x: 35, y: 30 },
  },
  {
    id: '2',
    title: 'Medical Emergency - Village B',
    category: 'health',
    severity: 'high',
    peopleAffected: 800,
    ngoName: 'Doctors Without Borders',
    resources: ['Medicines', 'Medical Equipment', 'Ambulance'],
    volunteers: [
      { name: 'Dr. Sunita Rao', role: 'Chief Medical Officer' },
      { name: 'Kiran Joshi', role: 'Nurse' },
    ],
    position: { x: 65, y: 45 },
  },
  {
    id: '3',
    title: 'Food Distribution - Area C',
    category: 'food',
    severity: 'medium',
    peopleAffected: 1500,
    ngoName: 'Akshaya Patra Foundation',
    resources: ['Food Grains', 'Cooking Equipment', 'Utensils'],
    volunteers: [
      { name: 'Anita Gupta', role: 'Distribution Manager' },
      { name: 'Vikram Singh', role: 'Kitchen Head' },
    ],
    position: { x: 50, y: 60 },
  },
  {
    id: '4',
    title: 'School Reconstruction - Town D',
    category: 'education',
    severity: 'low',
    peopleAffected: 300,
    ngoName: 'Teach For India',
    resources: ['Construction Material', 'Books', 'Furniture'],
    volunteers: [
      { name: 'Meera Iyer', role: 'Project Manager' },
      { name: 'Rahul Verma', role: 'Education Coordinator' },
    ],
    position: { x: 25, y: 70 },
  },
  {
    id: '5',
    title: 'Cyclone Response - Coastal Area E',
    category: 'disaster',
    severity: 'critical',
    peopleAffected: 8000,
    ngoName: 'UNICEF India',
    resources: ['Emergency Shelter', 'Water Purifiers', 'First Aid Kits', 'Blankets'],
    volunteers: [
      { name: 'Captain Rao', role: 'Rescue Team Lead' },
      { name: 'Deepa Nair', role: 'Relief Coordinator' },
      { name: 'Suresh Kumar', role: 'Logistics Manager' },
    ],
    position: { x: 75, y: 25 },
  },
  {
    id: '6',
    title: 'Malnutrition Camp - Rural F',
    category: 'health',
    severity: 'high',
    peopleAffected: 450,
    ngoName: 'Care India',
    resources: ['Nutrition Supplements', 'Medical Supplies', 'Baby Food'],
    volunteers: [
      { name: 'Dr. Lakshmi Devi', role: 'Nutritionist' },
      { name: 'Arjun Menon', role: 'Health Worker' },
    ],
    position: { x: 20, y: 40 },
  },
  {
    id: '7',
    title: 'Community Kitchen - Slum G',
    category: 'food',
    severity: 'medium',
    peopleAffected: 2000,
    ngoName: 'Feeding India',
    resources: ['Fresh Vegetables', 'Rice', 'Pulses', 'Cooking Gas'],
    volunteers: [
      { name: 'Sundar Pillai', role: 'Kitchen Supervisor' },
      { name: 'Fatima Khan', role: 'Volunteer' },
    ],
    position: { x: 55, y: 35 },
  },
  {
    id: '8',
    title: 'Digital Literacy Program - Village H',
    category: 'education',
    severity: 'low',
    peopleAffected: 150,
    ngoName: 'Pratham Education',
    resources: ['Computers', 'Internet Setup', 'Learning Materials'],
    volunteers: [
      { name: 'Neha Sharma', role: 'IT Trainer' },
      { name: 'Arun Bhat', role: 'Teacher' },
    ],
    position: { x: 80, y: 65 },
  },
]

export function MapView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLive, setIsLive] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState('delhi')
  const [searchFilteredCategory, setSearchFilteredCategory] = useState<string | null>(null)
  const [targetLocation, setTargetLocation] = useState<[number, number] | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    urgency: [],
    category: [],
    ngo: [],
    distance: 100,
  })

  // Generate search suggestions based on query
  const searchSuggestions = useMemo((): SearchSuggestion[] => {
    if (!searchQuery.trim()) return []
    
    const query = searchQuery.toLowerCase()
    const suggestions: SearchSuggestion[] = []
    
    // Search in locations (all cities and their regions)
    Object.entries(CITY_DATA).forEach(([cityKey, cityData]) => {
      const cityLabel = cityKey.charAt(0).toUpperCase() + cityKey.slice(1)
      if (cityLabel.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'location',
          label: cityLabel,
          value: cityKey,
          coords: cityData.center,
        })
      }
      
      cityData.regions.forEach((region) => {
        if (region.name.toLowerCase().includes(query)) {
          suggestions.push({
            type: 'location',
            label: `${region.name}, ${cityLabel}`,
            value: `${cityKey}:${region.name}`,
            coords: region.coords,
          })
        }
      })
    })
    
    // Search in issues/markers
    MOCK_MARKERS.forEach((marker) => {
      if (
        marker.title.toLowerCase().includes(query) ||
        marker.ngoName.toLowerCase().includes(query) ||
        marker.category.toLowerCase().includes(query)
      ) {
        suggestions.push({
          type: 'issue',
          label: marker.title,
          value: `${marker.category}:${marker.id}`,
        })
      }
    })
    
    return suggestions.slice(0, 8) // Limit suggestions
  }, [searchQuery])

  // Check if no results
  const noResults = useMemo(() => {
    if (!searchQuery.trim()) return false
    return searchSuggestions.length === 0
  }, [searchQuery, searchSuggestions])

  // Filter markers based on search and filters
  const filteredMarkers = useMemo(() => {
    return MOCK_MARKERS.filter((marker) => {
      // Search category filter (from selecting an issue in search)
      if (searchFilteredCategory) {
        if (searchFilteredCategory.includes(':')) {
          const [, markerId] = searchFilteredCategory.split(':')
          return marker.id === markerId
        }
        return marker.category === searchFilteredCategory
      }

      // Urgency filter
      if (filters.urgency.length > 0 && !filters.urgency.includes(marker.severity)) {
        return false
      }

      // Category filter
      if (filters.category.length > 0 && !filters.category.includes(marker.category)) {
        return false
      }

      return true
    })
  }, [searchFilteredCategory, filters])

  const selectedMarker = selectedMarkerId
    ? MOCK_MARKERS.find((m) => m.id === selectedMarkerId) || null
    : null

  const handleMarkerClick = useCallback((markerId: string) => {
    setSelectedMarkerId((prev) => (markerId === prev ? null : markerId))
  }, [])

  const handleLocationClick = () => {
    // Simulated location centering
    console.log('Centering on user location...')
  }

  // Handle search submit
  const handleSearchSubmit = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchFilteredCategory(null)
      setTargetLocation(null)
      return
    }

    const q = query.toLowerCase()
    
    // Check if it matches a location
    for (const [cityKey, cityData] of Object.entries(CITY_DATA)) {
      if (cityKey.includes(q)) {
        setSelectedCity(cityKey)
        setTargetLocation(cityData.center)
        setSearchFilteredCategory(null)
        return
      }
      
      const matchedRegion = cityData.regions.find((r) => r.name.toLowerCase().includes(q))
      if (matchedRegion) {
        setSelectedCity(cityKey)
        setTargetLocation(matchedRegion.coords)
        setSearchFilteredCategory(null)
        return
      }
    }
    
    // Check if it matches an issue category
    const categories = ['health', 'food', 'disaster', 'education']
    const matchedCategory = categories.find((c) => c.includes(q))
    if (matchedCategory) {
      setSearchFilteredCategory(matchedCategory)
      setTargetLocation(null)
      return
    }
    
    // Check if it matches a specific marker
    const matchedMarker = MOCK_MARKERS.find(
      (m) => m.title.toLowerCase().includes(q) || m.ngoName.toLowerCase().includes(q)
    )
    if (matchedMarker) {
      setSearchFilteredCategory(`${matchedMarker.category}:${matchedMarker.id}`)
      setSelectedMarkerId(matchedMarker.id)
      return
    }
  }, [])

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.label)
    
    if (suggestion.type === 'location') {
      if (suggestion.coords) {
        setTargetLocation(suggestion.coords)
      }
      // If it's a city, also change the selected city
      const cityKey = suggestion.value.split(':')[0]
      if (CITY_DATA[cityKey]) {
        setSelectedCity(cityKey)
      }
      setSearchFilteredCategory(null)
    } else if (suggestion.type === 'issue') {
      const [category, markerId] = suggestion.value.split(':')
      if (markerId) {
        setSearchFilteredCategory(`${category}:${markerId}`)
        setSelectedMarkerId(markerId)
      } else {
        setSearchFilteredCategory(category)
      }
      setTargetLocation(null)
    }
  }, [])

  // Clear search
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    if (!value.trim()) {
      setSearchFilteredCategory(null)
      setTargetLocation(null)
    }
  }, [])

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-4rem)] rounded-xl overflow-hidden shadow-2xl">
      {/* Leaflet Map */}
      <LeafletMap
        markers={filteredMarkers}
        selectedMarkerId={selectedMarkerId}
        onMarkerClick={handleMarkerClick}
        selectedCity={selectedCity}
        targetLocation={targetLocation}
      />

      {/* Map Controls */}
      <MapControls
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        searchSuggestions={searchSuggestions}
        onSuggestionSelect={handleSuggestionSelect}
        noResults={noResults}
        isLive={isLive}
        onToggleLive={() => setIsLive(!isLive)}
        onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
        onLocationClick={handleLocationClick}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
      />

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* AI Insight Card */}
      <AIInsightCard
        suggestedAction="Deploy 50 additional volunteers to District A flood relief camp"
        priorityScore={87}
        prediction="Based on weather patterns, expect 15% increase in affected population over next 48 hours. Pre-position medical supplies."
      />

      {/* Right Panel */}
      <RightPanel
        marker={selectedMarker}
        isOpen={!!selectedMarker}
        onClose={() => setSelectedMarkerId(null)}
      />

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-20 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg p-3">
        <p className="text-xs text-white/60 mb-2 font-medium">Issue Types</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-white/80">Health</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-xs text-white/80">Food</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-xs text-white/80">Disaster</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs text-white/80">Education</span>
          </div>
        </div>
      </div>
    </div>
  )
}
