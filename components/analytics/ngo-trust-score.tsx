'use client'

import { Shield, CheckCircle, Eye, FileText, Star, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface TransparencyIndicator {
  id: string
  label: string
  status: 'verified' | 'pending' | 'not-verified'
  description: string
}

interface NGOTrustScoreProps {
  score: number
  maxScore: number
  isVerified: boolean
  indicators: TransparencyIndicator[]
  lastAuditDate?: string
}

const statusConfig = {
  verified: {
    icon: CheckCircle,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    label: 'Verified',
  },
  pending: {
    icon: Eye,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    label: 'Pending',
  },
  'not-verified': {
    icon: FileText,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    label: 'Not Verified',
  },
}

export function NGOTrustScore({
  score,
  maxScore,
  isVerified,
  indicators,
  lastAuditDate,
}: NGOTrustScoreProps) {
  const percentage = Math.round((score / maxScore) * 100)

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-secondary'
    if (percentage >= 60) return 'text-primary'
    if (percentage >= 40) return 'text-accent'
    return 'text-destructive'
  }

  const getScoreLabel = (percentage: number) => {
    if (percentage >= 90) return 'Excellent'
    if (percentage >= 80) return 'Very Good'
    if (percentage >= 70) return 'Good'
    if (percentage >= 60) return 'Fair'
    return 'Needs Improvement'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Trust Score
            </CardTitle>
            <CardDescription>
              Transparency and accountability rating
            </CardDescription>
          </div>
          {isVerified && (
            <Badge className="bg-secondary text-secondary-foreground">
              <Award className="h-3 w-3 mr-1" />
              Verified NGO
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Score Display */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center">
              <div className="text-center">
                <div className={cn('text-3xl font-bold', getScoreColor(percentage))}>
                  {score}
                </div>
                <div className="text-xs text-muted-foreground">
                  out of {maxScore}
                </div>
              </div>
            </div>
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(hsl(var(--secondary)) ${percentage * 3.6}deg, transparent 0deg)`,
                mask: 'radial-gradient(transparent 55%, black 56%)',
                WebkitMask: 'radial-gradient(transparent 55%, black 56%)',
              }}
            />
          </div>
        </div>

        {/* Score Label */}
        <div className="text-center mb-6">
          <Badge variant="outline" className={cn('text-sm', getScoreColor(percentage))}>
            <Star className="h-3 w-3 mr-1" />
            {getScoreLabel(percentage)}
          </Badge>
          {lastAuditDate && (
            <p className="text-xs text-muted-foreground mt-2">
              Last audited: {lastAuditDate}
            </p>
          )}
        </div>

        {/* Transparency Indicators */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Transparency Indicators
          </h4>
          {indicators.map((indicator) => {
            const status = statusConfig[indicator.status]
            const Icon = status.icon
            return (
              <div
                key={indicator.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
              >
                <div className={cn('p-2 rounded-lg', status.bgColor)}>
                  <Icon className={cn('h-4 w-4', status.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {indicator.label}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn('text-xs', status.color)}
                    >
                      {status.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {indicator.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust Breakdown */}
        <div className="mt-6 pt-4 border-t border-border space-y-3">
          <h4 className="text-sm font-medium text-foreground">Trust Breakdown</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Financial Transparency</span>
              <span className="font-medium text-foreground">92%</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Impact Reporting</span>
              <span className="font-medium text-foreground">88%</span>
            </div>
            <Progress value={88} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Governance</span>
              <span className="font-medium text-foreground">85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
