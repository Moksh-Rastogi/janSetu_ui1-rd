'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, TrendingUp, Calendar } from 'lucide-react'

interface PredictionData {
  month: string
  actual?: number
  predicted: number
  confidence: number
}

interface PredictiveInsightsProps {
  data: PredictionData[]
  metric: string
  growth: number
  nextMilestone: string
}

export function PredictiveInsights({
  data,
  metric,
  growth,
  nextMilestone,
}: PredictiveInsightsProps) {
  const formatValue = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value.toLocaleString()
  }

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string; dataKey: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      const item = payload[0]
      const dataPoint = data.find(d => d.month === label)
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">
                {entry.dataKey === 'actual' ? 'Actual' : 'Predicted'}:
              </span>
              <span className="font-medium text-foreground">
                {formatValue(entry.value)}
              </span>
            </div>
          ))}
          {dataPoint && !dataPoint.actual && (
            <p className="text-xs text-muted-foreground mt-2">
              Confidence: {dataPoint.confidence}%
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Predictive Analytics
            </CardTitle>
            <CardDescription>
              AI-powered forecasting for {metric}
            </CardDescription>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <TrendingUp className="h-3 w-3 mr-1" />
            +{growth}% predicted growth
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                tickFormatter={(value) => {
                  if (value >= 100000) return `${(value / 100000).toFixed(0)}L`
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                  return value
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#actualGradient)"
              />
              <Area
                type="monotone"
                dataKey="predicted"
                name="Predicted"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#predictedGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Next Milestone */}
        <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Next Milestone</p>
              <p className="text-sm text-muted-foreground">{nextMilestone}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
