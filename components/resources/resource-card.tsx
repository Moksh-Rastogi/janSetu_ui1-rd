'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, MapPin, Calendar, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Resource {
  id: string
  name: string
  category: string
  quantity: number
  location: string
  expiryDate: string | null
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expiring-soon'
  allocatedQuantity: number
  unit: string
}

interface ResourceCardProps {
  resource: Resource
  onClick?: () => void
}

const statusConfig = {
  'in-stock': {
    label: 'In Stock',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
  },
  'low-stock': {
    label: 'Low Stock',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  },
  'out-of-stock': {
    label: 'Out of Stock',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800',
  },
  'expiring-soon': {
    label: 'Expiring Soon',
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  },
}

export function ResourceCard({ resource, onClick }: ResourceCardProps) {
  const config = statusConfig[resource.status]
  const availableQuantity = resource.quantity - resource.allocatedQuantity

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-lg h-full flex flex-col',
        resource.status === 'low-stock' && 'border-red-300 dark:border-red-700',
        resource.status === 'expiring-soon' && 'border-orange-300 dark:border-orange-700'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base line-clamp-1">{resource.name}</CardTitle>
            <Badge variant="secondary" className="mt-1 text-xs">
              {resource.category}
            </Badge>
          </div>
          {(resource.status === 'low-stock' || resource.status === 'expiring-soon') && (
            <AlertTriangle className={cn(
              'h-5 w-5 flex-shrink-0',
              resource.status === 'low-stock' ? 'text-red-500' : 'text-orange-500'
            )} />
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 pt-0">
        <div className="space-y-3 flex-1">
          {/* Quantity */}
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {resource.quantity} {resource.unit}
              </p>
              <p className="text-xs text-muted-foreground">
                {availableQuantity} available / {resource.allocatedQuantity} allocated
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground line-clamp-1">
              {resource.location}
            </span>
          </div>

          {/* Expiry Date */}
          {resource.expiryDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className={cn(
                'text-sm',
                resource.status === 'expiring-soon' ? 'text-orange-600 dark:text-orange-400 font-medium' : 'text-muted-foreground'
              )}>
                Expires: {resource.expiryDate}
              </span>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="pt-3 mt-auto border-t">
          <Badge variant="outline" className={cn('w-full justify-center', config.className)}>
            {config.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
