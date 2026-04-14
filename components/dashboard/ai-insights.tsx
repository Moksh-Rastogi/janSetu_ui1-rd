import { AlertCircle, Zap, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface AIInsight {
  id: string
  type: 'alert' | 'recommendation' | 'trend'
  severity: 'high' | 'medium' | 'low'
  title: string
  description: string
  action?: string
}

interface AIInsightsPanelProps {
  insights: AIInsight[]
  onDismiss?: (id: string) => void
}

export function AIInsightsPanel({ insights, onDismiss }: AIInsightsPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-l-destructive bg-destructive/5'
      case 'medium':
        return 'border-l-accent bg-accent/5'
      case 'low':
        return 'border-l-primary bg-primary/5'
      default:
        return 'border-l-primary bg-primary/5'
    }
  }

  const getIcon = (type: string, severity: string) => {
    if (type === 'alert') {
      return <AlertCircle className={cn('h-5 w-5', severity === 'high' ? 'text-destructive' : 'text-accent')} />
    } else if (type === 'recommendation') {
      return <Zap className="h-5 w-5 text-primary" />
    } else {
      return <TrendingUp className="h-5 w-5 text-secondary" />
    }
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          AI Insights & Alerts
        </CardTitle>
        <CardDescription>
          Smart recommendations and critical alerts for your ecosystem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={cn(
                'flex items-start gap-3 rounded-lg border-l-4 p-4 transition-all',
                getSeverityColor(insight.severity)
              )}
            >
              <div className="mt-0.5">{getIcon(insight.type, insight.severity)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">{insight.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                {insight.action && (
                  <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-xs">
                    {insight.action}
                  </Button>
                )}
              </div>
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDismiss(insight.id)}
                  className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                >
                  ×
                </Button>
              )}
            </div>
          ))}
          {insights.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No active insights at this time</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
