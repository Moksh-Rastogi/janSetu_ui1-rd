'use client'

import { Heart, Users, Clock, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface Campaign {
  id: string
  name: string
  description: string
  amountRaised: number
  goalAmount: number
  donorCount: number
  daysLeft: number
  urgency: 'critical' | 'high' | 'medium' | 'low'
  category: string
  image?: string
}

interface DonationCardProps {
  campaign: Campaign
  onDonate?: (id: string) => void
}

const urgencyConfig = {
  critical: { label: 'Critical', className: 'bg-destructive text-destructive-foreground' },
  high: { label: 'Urgent', className: 'bg-accent text-accent-foreground' },
  medium: { label: 'Active', className: 'bg-primary text-primary-foreground' },
  low: { label: 'Ongoing', className: 'bg-secondary text-secondary-foreground' },
}

export function DonationCard({ campaign, onDonate }: DonationCardProps) {
  const progress = Math.min((campaign.amountRaised / campaign.goalAmount) * 100, 100)
  const urgency = urgencyConfig[campaign.urgency]

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`
    }
    return `₹${amount}`
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Badge className={cn('mb-2', urgency.className)}>
              {urgency.label}
            </Badge>
            <CardTitle className="text-lg line-clamp-2 min-h-[3.5rem]">{campaign.name}</CardTitle>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 min-h-[2.5rem]">
          {campaign.description}
        </p>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-foreground">
              {formatCurrency(campaign.amountRaised)}
            </span>
            <span className="text-muted-foreground">
              of {formatCurrency(campaign.goalAmount)}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {progress.toFixed(0)}% funded
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{campaign.donorCount}</span>
            <span className="text-xs text-muted-foreground">Donors</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
            <Target className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium">{formatCurrency(campaign.goalAmount)}</span>
            <span className="text-xs text-muted-foreground">Goal</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
            <Clock className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">{campaign.daysLeft}</span>
            <span className="text-xs text-muted-foreground">Days Left</span>
          </div>
        </div>

        {/* Action Button - pushed to bottom */}
        <div className="mt-auto pt-2">
          <Button 
            className="w-full" 
            onClick={() => onDonate?.(campaign.id)}
          >
            <Heart className="h-4 w-4 mr-2" />
            Donate Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
