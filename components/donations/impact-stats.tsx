'use client'

import { Users, Package, CheckCircle, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ImpactMetric {
  id: string
  label: string
  value: number
  unit: string
  icon: 'people' | 'resources' | 'tasks' | 'growth'
  trend?: { direction: 'up' | 'down'; value: number }
  color: 'primary' | 'secondary' | 'accent'
}

interface ImpactStatsProps {
  metrics: ImpactMetric[]
  title?: string
  description?: string
}

const iconMap = {
  people: Users,
  resources: Package,
  tasks: CheckCircle,
  growth: TrendingUp,
}

const colorClasses = {
  primary: 'text-primary bg-primary/10',
  secondary: 'text-secondary bg-secondary/10',
  accent: 'text-accent bg-accent/10',
}

export function ImpactStats({ metrics, title = 'Impact Visualization', description }: ImpactStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = iconMap[metric.icon]
            return (
              <div
                key={metric.id}
                className="flex flex-col items-center p-4 rounded-xl bg-muted/30 border border-border/50 text-center"
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center mb-3',
                    colorClasses[metric.color]
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {formatNumber(metric.value)}
                </div>
                <div className="text-xs text-muted-foreground">{metric.unit}</div>
                <div className="text-sm font-medium text-foreground mt-1">
                  {metric.label}
                </div>
                {metric.trend && (
                  <div
                    className={cn(
                      'text-xs mt-1 flex items-center gap-1',
                      metric.trend.direction === 'up'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    <TrendingUp
                      className={cn(
                        'h-3 w-3',
                        metric.trend.direction === 'down' && 'rotate-180'
                      )}
                    />
                    {metric.trend.value}%
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
