'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { DonationCard, Campaign } from '@/components/donations/donation-card'
import { FundFlowTracker } from '@/components/donations/fund-flow-tracker'
import { FundDistributionChart } from '@/components/donations/fund-distribution-chart'
import { ImpactStats } from '@/components/donations/impact-stats'
import { DonorDashboard } from '@/components/donations/donor-dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Heart, TrendingUp } from 'lucide-react'

// Mock Data
const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'Flood Relief Fund - District X',
    description: 'Emergency relief for families affected by devastating floods. Providing shelter, food, and medical supplies.',
    amountRaised: 1850000,
    goalAmount: 2500000,
    donorCount: 1234,
    daysLeft: 12,
    urgency: 'critical',
    category: 'Emergency Relief',
  },
  {
    id: '2',
    name: 'Education for Rural Children',
    description: 'Building schools and providing educational materials for underprivileged children in remote villages.',
    amountRaised: 890000,
    goalAmount: 1500000,
    donorCount: 567,
    daysLeft: 45,
    urgency: 'high',
    category: 'Education',
  },
  {
    id: '3',
    name: 'Healthcare Access Initiative',
    description: 'Setting up mobile health clinics to provide medical care to underserved communities.',
    amountRaised: 650000,
    goalAmount: 1000000,
    donorCount: 389,
    daysLeft: 30,
    urgency: 'medium',
    category: 'Healthcare',
  },
  {
    id: '4',
    name: 'Clean Water Project',
    description: 'Installing water purification systems and wells in drought-affected areas.',
    amountRaised: 420000,
    goalAmount: 800000,
    donorCount: 245,
    daysLeft: 60,
    urgency: 'medium',
    category: 'Infrastructure',
  },
  {
    id: '5',
    name: 'Women Empowerment Program',
    description: 'Skill development and micro-financing for women entrepreneurs in rural areas.',
    amountRaised: 320000,
    goalAmount: 600000,
    donorCount: 178,
    daysLeft: 90,
    urgency: 'low',
    category: 'Empowerment',
  },
  {
    id: '6',
    name: 'Elderly Care Support',
    description: 'Providing care, companionship, and medical support for abandoned elderly individuals.',
    amountRaised: 280000,
    goalAmount: 500000,
    donorCount: 156,
    daysLeft: 75,
    urgency: 'low',
    category: 'Healthcare',
  },
]

const FUND_FLOW_STEPS = [
  { id: '1', label: 'Donations', amount: 4410000, percentage: 100, icon: 'donation' as const, status: 'completed' as const },
  { id: '2', label: 'Allocated', amount: 4100000, percentage: 93, icon: 'allocation' as const, status: 'completed' as const },
  { id: '3', label: 'Utilized', amount: 3500000, percentage: 79, icon: 'usage' as const, status: 'in-progress' as const },
  { id: '4', label: 'Impact', amount: 3200000, percentage: 73, icon: 'impact' as const, status: 'pending' as const },
]

const FUND_DISTRIBUTION = [
  { name: 'Emergency Relief', value: 1500000, color: '#FF6B6B' },
  { name: 'Education', value: 900000, color: '#4ECDC4' },
  { name: 'Healthcare', value: 800000, color: '#FFE66D' },
  { name: 'Infrastructure', value: 600000, color: '#95E1D3' },
  { name: 'Women Empowerment', value: 400000, color: '#AA96DA' },
]

const IMPACT_METRICS = [
  { id: '1', label: 'People Helped', value: 15230, unit: 'individuals', icon: 'people' as const, trend: { direction: 'up' as const, value: 12 }, color: 'primary' as const },
  { id: '2', label: 'Resources Delivered', value: 8450, unit: 'packages', icon: 'resources' as const, trend: { direction: 'up' as const, value: 8 }, color: 'secondary' as const },
  { id: '3', label: 'Tasks Completed', value: 342, unit: 'tasks', icon: 'tasks' as const, trend: { direction: 'up' as const, value: 15 }, color: 'accent' as const },
  { id: '4', label: 'Growth Rate', value: 28, unit: 'percent', icon: 'growth' as const, trend: { direction: 'up' as const, value: 5 }, color: 'primary' as const },
]

const MOCK_DONATIONS = [
  { id: '1', campaignName: 'Flood Relief Fund', amount: 5000, date: 'Mar 15, 2024', status: 'completed' as const, impact: 'Helped 2 families' },
  { id: '2', campaignName: 'Education for Rural Children', amount: 2500, date: 'Mar 10, 2024', status: 'completed' as const, impact: 'Sponsored 1 child' },
  { id: '3', campaignName: 'Healthcare Access Initiative', amount: 3000, date: 'Mar 5, 2024', status: 'completed' as const, impact: 'Medical kits for 5 people' },
  { id: '4', campaignName: 'Clean Water Project', amount: 1500, date: 'Feb 28, 2024', status: 'completed' as const },
]

const MOCK_RECURRING = [
  { id: '1', campaignName: 'Education for Rural Children', amount: 1000, frequency: 'monthly' as const, nextDate: 'Apr 10, 2024', active: true },
  { id: '2', campaignName: 'Healthcare Access Initiative', amount: 500, frequency: 'monthly' as const, nextDate: 'Apr 5, 2024', active: true },
]

const CATEGORIES = ['All', 'Emergency Relief', 'Education', 'Healthcare', 'Infrastructure', 'Empowerment']

export default function DonationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredCampaigns = MOCK_CAMPAIGNS.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || campaign.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDonate = (id: string) => {
    console.log('Donate to campaign:', id)
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground text-pretty">Donations</h1>
              <p className="text-muted-foreground mt-1">
                Support impactful campaigns and track your contributions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <Heart className="h-3 w-3 mr-1" />
                Total Raised: ₹44.1L
              </Badge>
              <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                2,769 Donors
              </Badge>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Campaign Cards Grid */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Active Campaigns</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCampaigns.map((campaign) => (
                <DonationCard
                  key={campaign.id}
                  campaign={campaign}
                  onDonate={handleDonate}
                />
              ))}
            </div>
            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No campaigns found matching your criteria</p>
              </div>
            )}
          </div>

          {/* Fund Tracking Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            <FundFlowTracker steps={FUND_FLOW_STEPS} totalFunds={4410000} />
            <FundDistributionChart data={FUND_DISTRIBUTION} />
          </div>

          {/* Impact Visualization */}
          <ImpactStats
            metrics={IMPACT_METRICS}
            title="Your Impact"
            description="See the real-world impact of donations on communities"
          />

          {/* Donor Dashboard */}
          <DonorDashboard
            donations={MOCK_DONATIONS}
            recurringDonations={MOCK_RECURRING}
            totalDonated={12000}
            totalImpact={15}
          />
        </div>
      </div>
    </AppLayout>
  )
}
