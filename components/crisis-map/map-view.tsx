'use client'

import { useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { MapControls } from './map-controls'
import { type MarkerData } from './map-marker'
import { RightPanel } from './right-panel'
import { FilterPanel, type FilterState } from './filter-panel'
import { AIInsightCard } from './ai-insight-card'

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
  const [filters, setFilters] = useState<FilterState>({
    urgency: [],
    category: [],
    ngo: [],
    distance: 100,
  })

  // Filter markers based on search and filters
  const filteredMarkers = useMemo(() => {
    return MOCK_MARKERS.filter((marker) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          marker.title.toLowerCase().includes(query) ||
          marker.ngoName.toLowerCase().includes(query) ||
          marker.category.toLowerCase().includes(query)
        if (!matchesSearch) return false
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
  }, [searchQuery, filters])

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

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-4rem)] rounded-xl overflow-hidden shadow-2xl">
      {/* Leaflet Map */}
      <LeafletMap
        markers={filteredMarkers}
        selectedMarkerId={selectedMarkerId}
        onMarkerClick={handleMarkerClick}
        selectedCity={selectedCity}
      />

      {/* Map Controls */}
      <MapControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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
