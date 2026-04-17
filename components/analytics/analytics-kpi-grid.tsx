'use client'

import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface KPI {
  id: string
  title: string
  value: string | number
  unit?: string
  trend?: {
    direction: 'up' | 'down'
    value: number
    period: string
  }
  icon: LucideIcon
  color: 'primary' | 'secondary' | 'accent' | 'destructive'
}

interface AnalyticsKPIGridProps {
  kpis: KPI[]
}

const colorClasses = {
  primary: {
    icon: 'text-primary',
    bg: 'bg-primary/10',
  },
  secondary: {
    icon: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  accent: {
    icon: 'text-accent',
    bg: 'bg-accent/10',
  },
  destructive: {
    icon: 'text-destructive',
    bg: 'bg-destructive/10',
  },
}

export function AnalyticsKPIGrid({ kpis }: AnalyticsKPIGridProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        const colors = colorClasses[kpi.color]
        return (
          <Card key={kpi.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </p>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl font-bold text-foreground">
                      {kpi.value}
                    </span>
                    {kpi.unit && (
                      <span className="text-sm text-muted-foreground">
                        {kpi.unit}
                      </span>
                    )}
                  </div>
                  {kpi.trend && (
                    <div
                      className={cn(
                        'flex items-center gap-1 mt-2 text-xs font-medium',
                        kpi.trend.direction === 'up'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      )}
                    >
                      {kpi.trend.direction === 'up' ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      <span>
                        {kpi.trend.value}% {kpi.trend.period}
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className={cn(
                    'p-3 rounded-xl',
                    colors.bg
                  )}
                >
                  <Icon className={cn('h-5 w-5', colors.icon)} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
