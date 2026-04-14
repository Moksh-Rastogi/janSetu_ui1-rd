'use client'

import { useState, useMemo } from 'react'
import { MapControls } from './map-controls'
import { MapMarker, type MarkerData } from './map-marker'
import { RightPanel } from './right-panel'
import { FilterPanel, type FilterState } from './filter-panel'
import { AIInsightCard } from './ai-insight-card'

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

  const handleMarkerClick = (markerId: string) => {
    setSelectedMarkerId(markerId === selectedMarkerId ? null : markerId)
  }

  const handleLocationClick = () => {
    // Simulated location centering
    console.log('Centering on user location...')
  }

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-4rem)] rounded-xl overflow-hidden shadow-2xl">
      {/* Dark Map Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Simulated map grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Simulated map features */}
        <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
          {/* Rivers */}
          <path
            d="M0,200 Q100,180 200,220 T400,200 T600,240 T800,220 T1000,200"
            stroke="rgba(59,130,246,0.5)"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M200,0 Q180,100 220,200 T200,400 T240,600"
            stroke="rgba(59,130,246,0.4)"
            strokeWidth="2"
            fill="none"
          />

          {/* Roads */}
          <path
            d="M0,300 L1000,300"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
            strokeDasharray="10,5"
          />
          <path
            d="M500,0 L500,600"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
            strokeDasharray="10,5"
          />
        </svg>

        {/* Map region labels */}
        <div className="absolute top-[20%] left-[15%] text-white/20 text-sm font-medium">
          Northern Region
        </div>
        <div className="absolute top-[60%] left-[60%] text-white/20 text-sm font-medium">
          Southern Region
        </div>
        <div className="absolute top-[40%] right-[10%] text-white/20 text-sm font-medium">
          Coastal Zone
        </div>
      </div>

      {/* Map Controls */}
      <MapControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLive={isLive}
        onToggleLive={() => setIsLive(!isLive)}
        onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
        onLocationClick={handleLocationClick}
      />

      {/* Map Markers */}
      {filteredMarkers.map((marker) => (
        <MapMarker
          key={marker.id}
          marker={marker}
          isSelected={marker.id === selectedMarkerId}
          onClick={() => handleMarkerClick(marker.id)}
        />
      ))}

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
