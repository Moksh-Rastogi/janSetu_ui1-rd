'use client'

import { useState } from 'react'
import { Calendar, Heart, Clock, Settings, ChevronRight, Repeat } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImpactReport } from '@/components/donations/impact-report'
import { cn } from '@/lib/utils'

interface Donation {
  id: string
  campaignName: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'failed'
  impact?: string
}

interface RecurringDonation {
  id: string
  campaignName: string
  amount: number
  frequency: 'weekly' | 'monthly' | 'yearly'
  nextDate: string
  active: boolean
}

interface DonorDashboardProps {
  donations: Donation[]
  recurringDonations: RecurringDonation[]
  totalDonated: number
  totalImpact: number
  onToggleRecurring?: (id: string, active: boolean) => void
}

const statusConfig = {
  completed: { label: 'Completed', className: 'bg-secondary/10 text-secondary border-secondary/20' },
  pending: { label: 'Pending', className: 'bg-accent/10 text-accent border-accent/20' },
  failed: { label: 'Failed', className: 'bg-destructive/10 text-destructive border-destructive/20' },
}

const frequencyLabels = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
}

export function DonorDashboard({
  donations,
  recurringDonations,
  totalDonated,
  totalImpact,
  onToggleRecurring,
}: DonorDashboardProps) {
  const [activeRecurring, setActiveRecurring] = useState<Record<string, boolean>>(
    recurringDonations.reduce((acc, d) => ({ ...acc, [d.id]: d.active }), {})
  )
  const [showImpactReport, setShowImpactReport] = useState(false)

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`
    }
    return `₹${amount}`
  }

  const handleToggleRecurring = (id: string) => {
    const newState = !activeRecurring[id]
    setActiveRecurring((prev) => ({ ...prev, [id]: newState }))
    onToggleRecurring?.(id, newState)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Your Donor Dashboard
        </CardTitle>
        <CardDescription>
          Track your donations, impact, and manage recurring contributions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="text-sm text-muted-foreground">Total Donated</div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(totalDonated)}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
            <div className="text-sm text-muted-foreground">People Helped</div>
            <div className="text-2xl font-bold text-secondary">
              {totalImpact.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Tabs for History and Recurring */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="history" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="recurring" className="flex-1">
              <Repeat className="h-4 w-4 mr-2" />
              Recurring
            </TabsTrigger>
          </TabsList>

          {/* Donation History */}
          <TabsContent value="history" className="mt-4">
            <div className="space-y-3">
              {donations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No donations yet</p>
                </div>
              ) : (
                donations.map((donation) => {
                  const status = statusConfig[donation.status]
                  return (
                    <div
                      key={donation.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {donation.campaignName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {donation.date}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn('text-xs', status.className)}
                          >
                            {status.label}
                          </Badge>
                        </div>
                        {donation.impact && (
                          <p className="text-xs text-secondary mt-1">
                            {donation.impact}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-3">
                        <span className="font-semibold text-foreground">
                          {formatCurrency(donation.amount)}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </TabsContent>

          {/* Recurring Donations */}
          <TabsContent value="recurring" className="mt-4">
            <div className="space-y-3">
              {recurringDonations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No recurring donations set up</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Settings className="h-4 w-4 mr-2" />
                    Set Up Recurring
                  </Button>
                </div>
              ) : (
                recurringDonations.map((recurring) => (
                  <div
                    key={recurring.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {recurring.campaignName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {frequencyLabels[recurring.frequency]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Next: {recurring.nextDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-3">
                      <span className="font-semibold text-foreground">
                        {formatCurrency(recurring.amount)}
                      </span>
                      <Switch
                        checked={activeRecurring[recurring.id]}
                        onCheckedChange={() => handleToggleRecurring(recurring.id)}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* View All Button */}
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => setShowImpactReport(true)}
        >
          View Full Impact Report
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>

        {/* Impact Report Dialog */}
        <ImpactReport
          open={showImpactReport}
          onOpenChange={setShowImpactReport}
          totalDonated={totalDonated}
          totalImpact={totalImpact}
          donations={donations}
        />
      </CardContent>
    </Card>
  )
}
