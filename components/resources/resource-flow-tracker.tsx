'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Warehouse, UserCheck, Truck, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FlowStep {
  id: string
  label: string
  count: number
  icon: 'storage' | 'assigned' | 'delivered'
  status: 'completed' | 'in-progress' | 'pending'
}

interface ResourceFlowTrackerProps {
  steps: FlowStep[]
}

const iconMap = {
  storage: Warehouse,
  assigned: UserCheck,
  delivered: Truck,
}

const statusColors = {
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-700',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-700',
  pending: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700',
}

export function ResourceFlowTracker({ steps }: ResourceFlowTrackerProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Resource Flow</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track resources from storage to delivery
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2">
          {steps.map((step, index) => {
            const Icon = iconMap[step.icon]
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      'w-16 h-16 rounded-full border-2 flex items-center justify-center',
                      statusColors[step.status]
                    )}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{step.count}</p>
                    <p className="text-xs text-muted-foreground mt-1">{step.label}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-6 w-6 text-muted-foreground mx-2 flex-shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
