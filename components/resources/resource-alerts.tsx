'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Clock, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Resource } from './resource-card'

interface ResourceAlertsProps {
  resources: Resource[]
}

export function ResourceAlerts({ resources }: ResourceAlertsProps) {
  const lowStockResources = resources.filter((r) => r.status === 'low-stock')
  const expiringResources = resources.filter((r) => r.status === 'expiring-soon')

  if (lowStockResources.length === 0 && expiringResources.length === 0) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Low Stock Alerts */}
      {lowStockResources.length > 0 && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert ({lowStockResources.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {lowStockResources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-2 rounded-md bg-white dark:bg-gray-900/50"
                >
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">{resource.name}</p>
                      <p className="text-xs text-muted-foreground">{resource.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                      {resource.quantity} {resource.unit}
                    </p>
                    <p className="text-xs text-muted-foreground">remaining</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expiring Soon Alerts */}
      {expiringResources.length > 0 && (
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <Clock className="h-5 w-5" />
              Expiring Soon ({expiringResources.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {expiringResources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-2 rounded-md bg-white dark:bg-gray-900/50"
                >
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">{resource.name}</p>
                      <p className="text-xs text-muted-foreground">{resource.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                      {resource.expiryDate}
                    </p>
                    <p className="text-xs text-muted-foreground">expiry date</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
