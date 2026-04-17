'use client'

import { ArrowRight, Wallet, PieChart, Package, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface FundFlowStep {
  id: string
  label: string
  amount: number
  percentage: number
  icon: 'donation' | 'allocation' | 'usage' | 'impact'
  status: 'completed' | 'in-progress' | 'pending'
}

interface FundFlowTrackerProps {
  steps: FundFlowStep[]
  totalFunds: number
}

const iconMap = {
  donation: Wallet,
  allocation: PieChart,
  usage: Package,
  impact: Sparkles,
}

const statusColors = {
  completed: 'bg-secondary text-secondary-foreground border-secondary',
  'in-progress': 'bg-primary text-primary-foreground border-primary',
  pending: 'bg-muted text-muted-foreground border-border',
}

export function FundFlowTracker({ steps, totalFunds }: FundFlowTrackerProps) {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-primary" />
          Fund Flow Tracker
        </CardTitle>
        <CardDescription>
          Track how your donations flow from contribution to impact
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Flow Visualization */}
        <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const Icon = iconMap[step.icon]
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center min-w-[80px]">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all',
                      statusColors[step.status]
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium mt-2 text-center">
                    {step.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(step.amount)}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-muted-foreground mx-2 flex-shrink-0" />
                )}
              </div>
            )
          })}
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-foreground font-medium">{step.label}</span>
                <span className="text-muted-foreground">
                  {step.percentage}% ({formatCurrency(step.amount)})
                </span>
              </div>
              <Progress value={step.percentage} className="h-2" />
            </div>
          ))}
        </div>

        {/* Total Summary */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Total Funds Tracked</span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(totalFunds)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
