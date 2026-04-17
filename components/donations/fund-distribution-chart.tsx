'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Label } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PieChart as PieChartIcon } from 'lucide-react'

interface FundCategory {
  name: string
  value: number
  color: string
}

interface FundDistributionChartProps {
  data: FundCategory[]
  title?: string
  description?: string
}

// Vibrant color palette for the chart
const VIBRANT_COLORS = [
  '#FF6B6B', // Coral Red
  '#4ECDC4', // Teal
  '#FFE66D', // Sunny Yellow
  '#95E1D3', // Mint Green
  '#F38181', // Salmon Pink
  '#AA96DA', // Lavender
  '#FCBAD3', // Pink
  '#A8D8EA', // Sky Blue
]

export function FundDistributionChart({
  data,
  title = 'Fund Distribution',
  description = 'How your donations are being allocated',
}: FundDistributionChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Apply vibrant colors to data
  const coloredData = data.map((item, index) => ({
    ...item,
    color: VIBRANT_COLORS[index % VIBRANT_COLORS.length],
  }))

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`
    }
    return `₹${amount}`
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0]
      const percentage = ((item.value / total) * 100).toFixed(1)
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">{item.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(item.value)} ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: { payload?: Array<{ value: string; color: string }> }) => {
    if (!payload) return null
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2 px-2 py-1 rounded-full bg-muted/50">
            <div
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs font-medium text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  // Custom label for pie slices
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }: {
    cx: number
    cy: number
    midAngle: number
    innerRadius: number
    outerRadius: number
    percent: number
    name: string
  }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 1.4
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percent < 0.08) return null // Don't show label for very small slices

    return (
      <text
        x={x}
        y={y}
        fill="currentColor"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-medium fill-foreground"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <PieChartIcon className="h-5 w-5 text-primary" />
          </div>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={coloredData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
                strokeWidth={2}
                stroke="hsl(var(--background))"
              >
                {coloredData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="drop-shadow-sm hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
                <Label
                  value={formatCurrency(total)}
                  position="center"
                  className="text-lg font-bold fill-foreground"
                />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown List */}
        <div className="mt-4 space-y-2">
          {coloredData.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1)
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2.5 rounded-xl transition-all hover:scale-[1.01]"
                style={{ 
                  backgroundColor: `${item.color}15`,
                  borderLeft: `4px solid ${item.color}`
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-semibold text-foreground">
                    {item.name}
                  </span>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: item.color }}>
                    {formatCurrency(item.value)}
                  </span>
                  <span 
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${item.color}25`, color: item.color }}
                  >
                    {percentage}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="font-medium text-foreground">Total Allocated Funds</span>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
