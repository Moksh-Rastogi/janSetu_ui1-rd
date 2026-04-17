'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { AnalyticsKPIGrid } from '@/components/analytics/analytics-kpi-grid'
import { RegionComparisonChart } from '@/components/analytics/region-comparison-chart'
import { TrendAnalysisChart } from '@/components/analytics/trend-analysis-chart'
import { AIAnalyticsInsights } from '@/components/analytics/ai-analytics-insights'
import { NGOTrustScore } from '@/components/analytics/ngo-trust-score'
import { PredictiveInsights } from '@/components/analytics/predictive-insights'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  Clock,
  Zap,
  Users,
  Heart,
  TrendingUp,
  Download,
  RefreshCw,
} from 'lucide-react'

// Mock Data for KPIs
const ANALYTICS_KPIS = [
  {
    id: '1',
    title: 'Issues Resolved',
    value: '1,892',
    trend: { direction: 'up' as const, value: 18, period: 'vs last month' },
    icon: CheckCircle,
    color: 'secondary' as const,
  },
  {
    id: '2',
    title: 'Avg Response Time',
    value: '2.4',
    unit: 'hours',
    trend: { direction: 'down' as const, value: 12, period: 'improvement' },
    icon: Clock,
    color: 'primary' as const,
  },
  {
    id: '3',
    title: 'Active Campaigns',
    value: '24',
    trend: { direction: 'up' as const, value: 8, period: 'vs last month' },
    icon: Zap,
    color: 'accent' as const,
  },
  {
    id: '4',
    title: 'Volunteer Engagement',
    value: '89%',
    trend: { direction: 'up' as const, value: 5, period: 'vs last month' },
    icon: Users,
    color: 'primary' as const,
  },
]

// Mock Data for Region Comparison
const REGION_DATA = [
  { name: 'North', issues: 450, resolved: 380, volunteers: 120 },
  { name: 'South', issues: 380, resolved: 340, volunteers: 95 },
  { name: 'East', issues: 520, resolved: 420, volunteers: 150 },
  { name: 'West', issues: 290, resolved: 260, volunteers: 80 },
  { name: 'Central', issues: 410, resolved: 350, volunteers: 110 },
]

// Mock Data for Trend Analysis
const TREND_DATA = [
  { month: 'Jan', donations: 1500000, volunteers: 320, impact: 1200 },
  { month: 'Feb', donations: 1800000, volunteers: 350, impact: 1450 },
  { month: 'Mar', donations: 2200000, volunteers: 420, impact: 1800 },
  { month: 'Apr', donations: 1900000, volunteers: 380, impact: 1650 },
  { month: 'May', donations: 2500000, volunteers: 480, impact: 2100 },
  { month: 'Jun', donations: 2800000, volunteers: 520, impact: 2400 },
]

// Mock Data for AI Insights
const AI_INSIGHTS = [
  {
    id: '1',
    type: 'allocation' as const,
    title: 'Optimize fund allocation to Eastern region',
    description: 'Analysis shows 28% higher impact per rupee in Eastern districts. Consider reallocating 15% of central funds.',
    confidence: 94,
    action: 'View Allocation Plan',
    priority: 'high' as const,
  },
  {
    id: '2',
    type: 'impact' as const,
    title: 'High impact zone identified: District X',
    description: 'Healthcare initiatives in District X show 3x higher engagement. Expand current programs to maximize reach.',
    confidence: 89,
    action: 'Explore Zone',
    priority: 'high' as const,
  },
  {
    id: '3',
    type: 'prediction' as const,
    title: 'Donation surge expected next month',
    description: 'Based on historical patterns and current trends, expect 35% increase in donations during festival season.',
    confidence: 85,
    action: 'Plan Campaigns',
    priority: 'medium' as const,
  },
  {
    id: '4',
    type: 'warning' as const,
    title: 'Volunteer fatigue detected in Northern region',
    description: 'Task completion rates have dropped 15% in the last 2 weeks. Consider rotating volunteers or reducing workload.',
    confidence: 91,
    action: 'View Details',
    priority: 'medium' as const,
  },
]

// Mock Data for Trust Score
const TRUST_INDICATORS = [
  { id: '1', label: 'Financial Audits', status: 'verified' as const, description: 'Annual audits completed and published' },
  { id: '2', label: 'Impact Reports', status: 'verified' as const, description: 'Quarterly impact reports available' },
  { id: '3', label: 'Board Governance', status: 'verified' as const, description: 'Transparent board meeting minutes' },
  { id: '4', label: 'Donor Communication', status: 'pending' as const, description: 'Monthly updates in progress' },
]

// Mock Data for Predictive Insights
const PREDICTION_DATA = [
  { month: 'Jan', actual: 1500000, predicted: 1500000, confidence: 100 },
  { month: 'Feb', actual: 1800000, predicted: 1750000, confidence: 100 },
  { month: 'Mar', actual: 2200000, predicted: 2100000, confidence: 100 },
  { month: 'Apr', actual: 1900000, predicted: 2000000, confidence: 100 },
  { month: 'May', actual: 2500000, predicted: 2400000, confidence: 100 },
  { month: 'Jun', actual: 2800000, predicted: 2700000, confidence: 100 },
  { month: 'Jul', predicted: 3100000, confidence: 92 },
  { month: 'Aug', predicted: 3400000, confidence: 88 },
  { month: 'Sep', predicted: 3800000, confidence: 85 },
]

export default function AnalyticsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  const handleAIAction = (id: string) => {
    console.log('AI Action triggered for insight:', id)
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground text-pretty">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Data-driven insights for transparent and impactful operations
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Summary Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-secondary/10 text-secondary border-secondary/20">
              <CheckCircle className="h-3 w-3 mr-1" />
              1,892 Issues Resolved
            </Badge>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Heart className="h-3 w-3 mr-1" />
              ₹28L Raised This Month
            </Badge>
            <Badge className="bg-accent/10 text-accent border-accent/20">
              <TrendingUp className="h-3 w-3 mr-1" />
              +24% Growth
            </Badge>
          </div>

          {/* KPI Grid */}
          <AnalyticsKPIGrid kpis={ANALYTICS_KPIS} />

          {/* Tabs for Different Views */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="regions">Regions</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="trust">Trust</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <TrendAnalysisChart
                  data={TREND_DATA}
                  title="Performance Trends"
                  description="Track donations, volunteers, and impact over time"
                />
                <AIAnalyticsInsights
                  insights={AI_INSIGHTS.slice(0, 3)}
                  onAction={handleAIAction}
                />
              </div>
            </TabsContent>

            {/* Regions Tab */}
            <TabsContent value="regions" className="mt-6 space-y-6">
              <RegionComparisonChart
                data={REGION_DATA}
                title="Regional Performance"
                description="Compare issues, resolutions, and volunteer activity across regions"
              />
              <AIAnalyticsInsights
                insights={AI_INSIGHTS.filter(i => i.type === 'allocation' || i.type === 'warning')}
                onAction={handleAIAction}
              />
            </TabsContent>

            {/* Predictions Tab */}
            <TabsContent value="predictions" className="mt-6 space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <PredictiveInsights
                  data={PREDICTION_DATA}
                  metric="donations"
                  growth={35}
                  nextMilestone="Expected to reach ₹50L total donations by September"
                />
                <AIAnalyticsInsights
                  insights={AI_INSIGHTS.filter(i => i.type === 'prediction' || i.type === 'impact')}
                  onAction={handleAIAction}
                />
              </div>
            </TabsContent>

            {/* Trust Tab */}
            <TabsContent value="trust" className="mt-6 space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <NGOTrustScore
                  score={88}
                  maxScore={100}
                  isVerified={true}
                  indicators={TRUST_INDICATORS}
                  lastAuditDate="March 15, 2024"
                />
                <div className="space-y-6">
                  <AIAnalyticsInsights
                    insights={[
                      {
                        id: 'trust-1',
                        type: 'impact' as const,
                        title: 'Trust score improvement opportunity',
                        description: 'Complete monthly donor communication updates to improve trust score by 5 points.',
                        confidence: 95,
                        action: 'View Recommendations',
                        priority: 'medium' as const,
                      },
                    ]}
                    onAction={handleAIAction}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}
