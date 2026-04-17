'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { KPICard } from '@/components/dashboard/kpi-card'
import { AIInsightsPanel } from '@/components/dashboard/ai-insights'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { UrgentBanner } from '@/components/dashboard/urgent-banner'
import { MiniMap } from '@/components/dashboard/mini-map'
import { Users, Zap, Heart, TrendingUp } from 'lucide-react'

const MOCK_INSIGHTS = [
  {
    id: '1',
    type: 'alert' as const,
    severity: 'high' as const,
    title: 'Flood Risk Alert',
    description: 'Flash flood warning in District X. 5,000+ people at risk.',
    action: 'View Details',
  },
  {
    id: '2',
    type: 'recommendation' as const,
    severity: 'medium' as const,
    title: 'Volunteer Surge Opportunity',
    description: 'Recent campaign attracted 150 new volunteers. Consider launching related initiatives.',
    action: 'Launch Campaign',
  },
  {
    id: '3',
    type: 'trend' as const,
    severity: 'low' as const,
    title: 'Donation Pattern',
    description: 'Donations peak on weekends. Schedule campaigns accordingly.',
  },
]

const MOCK_ACTIVITIES = [
  {
    id: '1',
    type: 'donation' as const,
    user: { name: 'Raj Patel', initials: 'RP' },
    description: 'Donated ₹50,000 to Relief Fund',
    timestamp: '2 min ago',
  },
  {
    id: '2',
    type: 'volunteer_join' as const,
    user: { name: 'Priya Singh', initials: 'PS' },
    description: 'Joined as Medical Support Volunteer',
    timestamp: '15 min ago',
  },
  {
    id: '3',
    type: 'task_completed' as const,
    user: { name: 'Amit Kumar', initials: 'AK' },
    description: 'Completed flood relief distribution task',
    timestamp: '1 hour ago',
  },
  {
    id: '4',
    type: 'message' as const,
    user: { name: 'NGO Coordinator', initials: 'NC' },
    description: 'Sent urgent coordination message to team',
    timestamp: '2 hours ago',
  },
]

const MOCK_HOTSPOTS = [
  {
    id: '1',
    name: 'District X - Flood',
    count: 48,
    severity: 'high' as const,
  },
  {
    id: '2',
    name: 'District Y - Medical',
    count: 12,
    severity: 'medium' as const,
  },
  {
    id: '3',
    name: 'District Z - Relief',
    count: 5,
    severity: 'low' as const,
  },
]

export default function DashboardPage() {
  const [insights, setInsights] = useState(MOCK_INSIGHTS)

  const handleDismissInsight = (id: string) => {
    setInsights(insights.filter((i) => i.id !== id))
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground text-pretty">John Doe</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s your ecosystem overview.
          </p>
        </div>

        {/* Urgent Banner */}
        <UrgentBanner
          title="Critical: Flash Flood Alert"
          description="Multiple districts affected. 5,000+ people at risk. Immediate volunteer response needed."
          action={{ label: 'Launch Response', href: '#' }}
        />

        {/* KPI Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Issues Reported"
            value={1247}
            trend={{ direction: 'up', value: 12 }}
            icon={Zap}
            color="primary"
          />
          <KPICard
            title="Active Volunteers"
            value={3842}
            trend={{ direction: 'up', value: 8 }}
            icon={Users}
            color="secondary"
          />
          <KPICard
            title="Funds Raised"
            value="₹24.5L"
            trend={{ direction: 'up', value: 15 }}
            icon={Heart}
            color="accent"
          />
          <KPICard
            title="People Impacted"
            value={15230}
            trend={{ direction: 'up', value: 22 }}
            icon={TrendingUp}
            color="primary"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* AI Insights Panel - Spans 2 columns on desktop */}
          <AIInsightsPanel
            insights={insights}
            onDismiss={handleDismissInsight}
          />

          {/* Mini Map - Right column */}
          <MiniMap hotspots={MOCK_HOTSPOTS} />
        </div>

        {/* Activity Feed - Full width */}
        <ActivityFeed activities={MOCK_ACTIVITIES} />
        </div>
      </div>
    </AppLayout>
  )
}
