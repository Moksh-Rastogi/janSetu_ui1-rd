'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { NGOCard } from '@/components/network/ngo-card'
import { NGODetailPanel } from '@/components/network/ngo-detail-panel'
import { NetworkFilters } from '@/components/network/network-filters'
import { AddNGODialog } from '@/components/network/add-ngo-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Network } from 'lucide-react'

// Mock NGO Data
const MOCK_NGOS = [
  {
    id: '1',
    name: 'Community Health Initiative',
    location: 'Mumbai, Maharashtra',
    focusAreas: ['Healthcare', 'Community'],
    trustScore: 95,
    isVerified: true,
    activeCampaigns: 3,
    description: 'Providing affordable healthcare and wellness programs to underserved communities.',
    campaignsArray: [
      { id: 'c1', name: 'Mobile Health Clinic', status: 'active', progress: 75 },
      { id: 'c2', name: 'Medical Camps', status: 'active', progress: 60 },
      { id: 'c3', name: 'Health Awareness', status: 'active', progress: 80 },
    ],
    resources: ['Medical Supplies', 'Trained Staff', 'Facilities'],
    impactStats: [
      { label: 'People Served', value: '15,234' },
      { label: 'Lives Saved', value: '89' },
      { label: 'Doctors', value: '12' },
    ],
  },
  {
    id: '2',
    name: 'Education for All',
    location: 'Delhi, Delhi',
    focusAreas: ['Education', 'Youth Development'],
    trustScore: 88,
    isVerified: true,
    activeCampaigns: 2,
    description: 'Empowering underprivileged children through quality education and skill development.',
    campaignsArray: [
      { id: 'c4', name: 'Build Schools', status: 'active', progress: 45 },
      { id: 'c5', name: 'Scholarship Program', status: 'active', progress: 90 },
    ],
    resources: ['Teachers', 'Learning Materials', 'Infrastructure'],
    impactStats: [
      { label: 'Students Enrolled', value: '8,450' },
      { label: 'Schools Built', value: '24' },
      { label: 'Scholarships', value: '2,300' },
    ],
  },
  {
    id: '3',
    name: 'Clean Water Mission',
    location: 'Bangalore, Karnataka',
    focusAreas: ['Water & Sanitation', 'Infrastructure'],
    trustScore: 92,
    isVerified: true,
    activeCampaigns: 4,
    description: 'Installing water purification systems and ensuring access to clean water.',
    campaignsArray: [
      { id: 'c6', name: 'Well Installation', status: 'active', progress: 70 },
      { id: 'c7', name: 'Purification Units', status: 'completed', progress: 100 },
      { id: 'c8', name: 'Awareness Program', status: 'active', progress: 55 },
      { id: 'c9', name: 'Maintenance Network', status: 'active', progress: 40 },
    ],
    resources: ['Engineers', 'Equipment', 'Training'],
    impactStats: [
      { label: 'People Benefited', value: '42,000' },
      { label: 'Wells Dug', value: '156' },
      { label: 'Villages Covered', value: '78' },
    ],
  },
  {
    id: '4',
    name: 'Women Empowerment Network',
    location: 'Hyderabad, Telangana',
    focusAreas: ['Women Empowerment', 'Skill Training'],
    trustScore: 85,
    isVerified: true,
    activeCampaigns: 2,
    description: 'Providing skill training and economic empowerment to women in rural areas.',
    campaignsArray: [
      { id: 'c10', name: 'Vocational Training', status: 'active', progress: 65 },
      { id: 'c11', name: 'Microfinance Program', status: 'active', progress: 75 },
    ],
    resources: ['Trainers', 'Equipment', 'Mentors'],
    impactStats: [
      { label: 'Women Trained', value: '5,600' },
      { label: 'Self-Employed', value: '1,200' },
      { label: 'Income Generated', value: '₹2.3Cr' },
    ],
  },
  {
    id: '5',
    name: 'Disaster Relief Corps',
    location: 'Chennai, Tamil Nadu',
    focusAreas: ['Emergency Relief', 'Disaster Management'],
    trustScore: 91,
    isVerified: true,
    activeCampaigns: 5,
    description: 'Rapid response team for disaster relief and community rehabilitation.',
    campaignsArray: [
      { id: 'c12', name: 'Flood Relief', status: 'active', progress: 85 },
      { id: 'c13', name: 'Shelter Program', status: 'active', progress: 70 },
      { id: 'c14', name: 'Food Distribution', status: 'active', progress: 95 },
      { id: 'c15', name: 'Medical Support', status: 'active', progress: 80 },
      { id: 'c16', name: 'Recovery Phase', status: 'active', progress: 50 },
    ],
    resources: ['Volunteers', 'Supplies', 'Transport'],
    impactStats: [
      { label: 'People Assisted', value: '45,000' },
      { label: 'Shelters Provided', value: '890' },
      { label: 'Meals Served', value: '120,000' },
    ],
  },
  {
    id: '6',
    name: 'Environmental Conservation',
    location: 'Pune, Maharashtra',
    focusAreas: ['Environment', 'Sustainability'],
    trustScore: 87,
    isVerified: false,
    activeCampaigns: 3,
    description: 'Protecting natural resources and promoting sustainable development practices.',
    campaignsArray: [
      { id: 'c17', name: 'Tree Plantation', status: 'active', progress: 60 },
      { id: 'c18', name: 'Waste Management', status: 'active', progress: 50 },
      { id: 'c19', name: 'Water Conservation', status: 'active', progress: 65 },
    ],
    resources: ['Environmental Scientists', 'Volunteers', 'Equipment'],
    impactStats: [
      { label: 'Trees Planted', value: '250,000' },
      { label: 'Waste Recycled', value: '1,200T' },
      { label: 'Water Saved', value: '50M L' },
    ],
  },
]

interface ImpactStat {
  label: string
  value: string
}

interface Campaign {
  id: string
  name: string
  status: 'active' | 'completed'
  progress: number
}

interface NGO {
  id: string
  name: string
  location: string
  focusAreas: string[]
  trustScore: number
  isVerified: boolean
  activeCampaigns: number
  description: string
  campaignsArray: Campaign[]
  resources: string[]
  impactStats: ImpactStat[]
}

export default function NetworkPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    location: 'all',
    category: 'all',
    trustScore: 0,
    activeCampaigns: false,
  })
  const [selectedNGO, setSelectedNGO] = useState<string | null>(null)
  const [ngos, setNgos] = useState<NGO[]>(MOCK_NGOS)

  const handleAddNGO = (formData: {
    name: string
    location: string
    description: string
    focusAreas: string[]
    resources: string[]
    impactStats: ImpactStat[]
  }) => {
    const newNGO: NGO = {
      id: `ngo-${Date.now()}`,
      name: formData.name,
      location: formData.location,
      description: formData.description,
      focusAreas: formData.focusAreas,
      trustScore: 100,
      isVerified: false,
      activeCampaigns: 0,
      campaignsArray: [],
      resources: formData.resources.length > 0 ? formData.resources : ['To be added'],
      impactStats: formData.impactStats,
    }
    setNgos([newNGO, ...ngos])
  }

  const filteredNGOs = ngos.filter((ngo) => {
    const matchesSearch =
      ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLocation =
      filters.location === 'all' || ngo.location.includes(filters.location)

    const matchesCategory =
      filters.category === 'all' ||
      ngo.focusAreas.some((area) =>
        area.toLowerCase().includes(filters.category.toLowerCase())
      )

    const matchesTrustScore = ngo.trustScore >= filters.trustScore

    const matchesCampaigns =
      !filters.activeCampaigns || ngo.activeCampaigns > 0

    return (
      matchesSearch &&
      matchesLocation &&
      matchesCategory &&
      matchesTrustScore &&
      matchesCampaigns
    )
  })

  const selectedNGOData = ngos.find((ngo) => ngo.id === selectedNGO)

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground text-pretty flex items-center gap-2">
                <Network className="h-8 w-8 text-primary" />
                NGO Network
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover and collaborate with NGOs in the ecosystem
              </p>
            </div>
            <div className="flex items-center gap-4">
              <AddNGODialog onAddNGO={handleAddNGO} />
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">
                  {filteredNGOs.length}
                </p>
                <p className="text-sm text-muted-foreground">NGOs Found</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search NGOs by name or focus area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <NetworkFilters filters={filters} setFilters={setFilters} />

          {/* NGO Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNGOs.map((ngo) => (
              <NGOCard
                key={ngo.id}
                ngo={ngo}
                isSelected={selectedNGO === ngo.id}
                onSelect={setSelectedNGO}
              />
            ))}
          </div>

          {filteredNGOs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No NGOs found matching your criteria</p>
            </div>
          )}

          {/* Detail Panel */}
          {selectedNGOData && (
            <NGODetailPanel
              ngo={selectedNGOData}
              onClose={() => setSelectedNGO(null)}
            />
          )}
        </div>
      </div>
    </AppLayout>
  )
}
