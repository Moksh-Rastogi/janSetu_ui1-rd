'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Resource } from './resource-card'

interface ResourceTableProps {
  resources: Resource[]
  onResourceClick?: (resource: Resource) => void
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

export function ResourceTable({ resources, onResourceClick }: ResourceTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Resource Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => {
            const config = statusConfig[resource.status]
            return (
              <TableRow
                key={resource.id}
                className={cn(
                  'cursor-pointer',
                  resource.status === 'low-stock' && 'bg-red-50/50 dark:bg-red-950/20',
                  resource.status === 'expiring-soon' && 'bg-orange-50/50 dark:bg-orange-950/20'
                )}
                onClick={() => onResourceClick?.(resource)}
              >
                <TableCell className="font-medium">{resource.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {resource.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div>
                    <span className="font-semibold">{resource.quantity}</span>
                    <span className="text-muted-foreground ml-1">{resource.unit}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {resource.quantity - resource.allocatedQuantity} available
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {resource.location}
                </TableCell>
                <TableCell className={cn(
                  resource.status === 'expiring-soon' ? 'text-orange-600 dark:text-orange-400 font-medium' : 'text-muted-foreground'
                )}>
                  {resource.expiryDate || '-'}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={config.className}>
                    {config.label}
                  </Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {resources.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No resources found</p>
        </div>
      )}
    </div>
  )
}
