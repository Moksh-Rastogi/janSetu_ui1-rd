'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { DonationCard, Campaign } from '@/components/donations/donation-card'
import { DonateDialog } from '@/components/campaigns/donate-dialog'
import { AddCampaignDialog } from '@/components/campaigns/add-campaign-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Search, 
  Filter, 
  Zap, 
  TrendingUp, 
  Users, 
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

// Mock Data
const INITIAL_CAMPAIGNS: Campaign[] = [
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

const CATEGORIES = ['All', 'Emergency Relief', 'Education', 'Healthcare', 'Infrastructure', 'Empowerment']

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [donateDialogOpen, setDonateDialogOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || campaign.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calculate stats
  const totalRaised = campaigns.reduce((acc, c) => acc + c.amountRaised, 0)
  const totalGoal = campaigns.reduce((acc, c) => acc + c.goalAmount, 0)
  const totalDonors = campaigns.reduce((acc, c) => acc + c.donorCount, 0)
  const activeCampaigns = campaigns.length
  const criticalCampaigns = campaigns.filter(c => c.urgency === 'critical').length

  const handleDonate = (id: string) => {
    const campaign = campaigns.find(c => c.id === id)
    if (campaign) {
      setSelectedCampaign(campaign)
      setDonateDialogOpen(true)
    }
  }

  const handleDonateSuccess = (campaignId: string, amount: number) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        return {
          ...c,
          amountRaised: c.amountRaised + amount,
          donorCount: c.donorCount + 1,
        }
      }
      return c
    }))
  }

  const handleAddCampaign = (newCampaign: Campaign) => {
    setCampaigns(prev => [newCampaign, ...prev])
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground text-pretty flex items-center gap-2">
                <Zap className="h-8 w-8 text-primary" />
                Campaigns
              </h1>
              <p className="text-muted-foreground mt-1">
                Active fundraising campaigns and relief initiatives
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <Target className="h-3 w-3 mr-1" />
                {activeCampaigns} Active
              </Badge>
              {criticalCampaigns > 0 && (
                <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {criticalCampaigns} Critical
                </Badge>
              )}
              <AddCampaignDialog onAddCampaign={handleAddCampaign} categories={CATEGORIES} />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Raised
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ₹{(totalRaised / 100000).toFixed(1)}L
                </div>
                <Progress value={(totalRaised / totalGoal) * 100} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  of ₹{(totalGoal / 100000).toFixed(1)}L goal
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Donors
                </CardTitle>
                <Users className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {totalDonors.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all campaigns
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Campaigns
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {activeCampaigns}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Currently running
                </p>
              </CardContent>
            </Card>

            <Card className={criticalCampaigns > 0 ? "border-red-200 dark:border-red-800" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Urgent Need
                </CardTitle>
                <Clock className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {criticalCampaigns}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Critical campaigns
                </p>
              </CardContent>
            </Card>
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                All Campaigns
              </h2>
              <Badge variant="secondary">
                {filteredCampaigns.length} campaigns
              </Badge>
            </div>
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
                <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No campaigns found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Donate Dialog */}
      <DonateDialog
        campaign={selectedCampaign}
        open={donateDialogOpen}
        onOpenChange={setDonateDialogOpen}
        onDonateSuccess={handleDonateSuccess}
      />
    </AppLayout>
  )
}
