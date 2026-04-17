'use client'

import { Sparkles, Target, TrendingUp, AlertTriangle, Lightbulb, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AIInsight {
  id: string
  type: 'allocation' | 'impact' | 'prediction' | 'warning'
  title: string
  description: string
  confidence: number
  action?: string
  priority: 'high' | 'medium' | 'low'
}

interface AIAnalyticsInsightsProps {
  insights: AIInsight[]
  onAction?: (id: string) => void
}

const typeConfig = {
  allocation: {
    icon: Target,
    label: 'Fund Allocation',
    color: 'text-primary bg-primary/10',
  },
  impact: {
    icon: TrendingUp,
    label: 'High Impact',
    color: 'text-secondary bg-secondary/10',
  },
  prediction: {
    icon: Lightbulb,
    label: 'Prediction',
    color: 'text-chart-4 bg-chart-4/10',
  },
  warning: {
    icon: AlertTriangle,
    label: 'Alert',
    color: 'text-accent bg-accent/10',
  },
}

const priorityConfig = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-accent/10 text-accent border-accent/20',
  low: 'bg-primary/10 text-primary border-primary/20',
}

export function AIAnalyticsInsights({ insights, onAction }: AIAnalyticsInsightsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI-Powered Insights
        </CardTitle>
        <CardDescription>
          Smart recommendations based on data analysis and predictive models
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => {
            const config = typeConfig[insight.type]
            const Icon = config.icon
            return (
              <div
                key={insight.id}
                className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={cn('p-2 rounded-lg', config.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={cn('text-xs', priorityConfig[insight.priority])}>
                          {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)} Priority
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Sparkles className="h-3 w-3" />
                        {insight.confidence}% confidence
                      </div>
                    </div>
                    <h4 className="font-medium text-foreground">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {insight.description}
                    </p>
                    {insight.action && (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 mt-2 text-primary"
                        onClick={() => onAction?.(insight.id)}
                      >
                        {insight.action}
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          {insights.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">AI is analyzing your data...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
