'use client'

import { use } from 'react'
import Link from 'next/link'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users,
  Target,
  Heart,
  Building2,
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CAMPAIGNS } from '@/lib/search-data'

// Extended campaign data with more details
const CAMPAIGN_DETAILS: Record<string, {
  goalAmount: number
  amountRaised: number
  donors: number
  volunteers: number
  startDate: string
  endDate: string
  urgency: 'critical' | 'high' | 'medium' | 'low'
  ngo: string
  updates: { date: string; text: string }[]
  activities: { title: string; status: 'completed' | 'in-progress' | 'pending' }[]
}> = {
  c1: {
    goalAmount: 500000,
    amountRaised: 325000,
    donors: 156,
    volunteers: 45,
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    urgency: 'critical',
    ngo: 'Red Cross India',
    updates: [
      { date: '2024-01-15', text: 'Distributed relief supplies to 200 families' },
      { date: '2024-01-10', text: 'Set up 3 temporary shelters' },
      { date: '2024-01-05', text: 'Campaign launched with initial response team' },
    ],
    activities: [
      { title: 'Emergency shelter setup', status: 'completed' },
      { title: 'Food distribution', status: 'in-progress' },
      { title: 'Medical camp', status: 'in-progress' },
      { title: 'Long-term rehabilitation', status: 'pending' },
    ],
  },
  c2: {
    goalAmount: 300000,
    amountRaised: 180000,
    donors: 89,
    volunteers: 28,
    startDate: '2024-01-05',
    endDate: '2024-04-30',
    urgency: 'high',
    ngo: 'Doctors Without Borders',
    updates: [
      { date: '2024-01-14', text: 'Medical camp served 500 patients' },
      { date: '2024-01-08', text: 'Deployed mobile health units' },
    ],
    activities: [
      { title: 'Health screening', status: 'completed' },
      { title: 'Medication distribution', status: 'in-progress' },
      { title: 'Health awareness program', status: 'pending' },
    ],
  },
  c3: {
    goalAmount: 200000,
    amountRaised: 145000,
    donors: 234,
    volunteers: 52,
    startDate: '2024-01-03',
    endDate: '2024-02-28',
    urgency: 'high',
    ngo: 'Akshaya Patra Foundation',
    updates: [
      { date: '2024-01-13', text: 'Fed 1000 families this week' },
      { date: '2024-01-07', text: 'Expanded to 3 new distribution centers' },
    ],
    activities: [
      { title: 'Kitchen setup', status: 'completed' },
      { title: 'Daily meal distribution', status: 'in-progress' },
      { title: 'Nutrition program', status: 'in-progress' },
    ],
  },
}

const urgencyConfig = {
  critical: { label: 'Critical', className: 'bg-red-500 text-white' },
  high: { label: 'High Priority', className: 'bg-orange-500 text-white' },
  medium: { label: 'Medium', className: 'bg-yellow-500 text-white' },
  low: { label: 'Low', className: 'bg-green-500 text-white' },
}

const statusConfig = {
  completed: { label: 'Completed', className: 'bg-green-500/10 text-green-600 border-green-500/20' },
  'in-progress': { label: 'In Progress', className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  pending: { label: 'Pending', className: 'bg-gray-500/10 text-gray-600 border-gray-500/20' },
}

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  const campaign = CAMPAIGNS.find(c => c.id === id)
  const details = CAMPAIGN_DETAILS[id] || CAMPAIGN_DETAILS['c1']
  
  if (!campaign) {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold">Campaign not found</h1>
          <Link href="/campaigns">
            <Button className="mt-4">Back to Campaigns</Button>
          </Link>
        </div>
      </AppLayout>
    )
  }

  const progress = (details.amountRaised / details.goalAmount) * 100
  const urgency = urgencyConfig[details.urgency]

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`
    return `₹${amount}`
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Back Button */}
          <Link href="/campaigns">
            <Button variant="ghost" className="gap-2 mb-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Campaigns
            </Button>
          </Link>

          {/* Header Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className={cn('mb-3', urgency.className)}>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {urgency.label}
                    </Badge>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                      {campaign.title}
                    </h1>
                    <p className="text-muted-foreground mt-2">{campaign.description}</p>
                  </div>
                  <Button className="gap-2">
                    <Heart className="h-4 w-4" />
                    Donate Now
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {campaign.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {details.ngo}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(details.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - {new Date(details.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {/* Progress */}
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{formatCurrency(details.amountRaised)} raised</span>
                    <span className="text-muted-foreground">of {formatCurrency(details.goalAmount)}</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <p className="text-sm text-muted-foreground">{Math.round(progress)}% of goal reached</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold">{formatCurrency(details.goalAmount)}</p>
                <p className="text-xs text-muted-foreground">Goal Amount</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 mx-auto text-green-500 mb-2" />
                <p className="text-2xl font-bold">{formatCurrency(details.amountRaised)}</p>
                <p className="text-xs text-muted-foreground">Amount Raised</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="h-6 w-6 mx-auto text-red-500 mb-2" />
                <p className="text-2xl font-bold">{details.donors}</p>
                <p className="text-xs text-muted-foreground">Donors</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                <p className="text-2xl font-bold">{details.volunteers}</p>
                <p className="text-xs text-muted-foreground">Volunteers</p>
              </CardContent>
            </Card>
          </div>

          {/* Activities and Updates */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Campaign Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {details.activities.map((activity, index) => {
                  const status = statusConfig[activity.status]
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">{activity.title}</span>
                      <Badge variant="outline" className={status.className}>
                        {status.label}
                      </Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {details.updates.map((update, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      {new Date(update.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-sm">{update.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
