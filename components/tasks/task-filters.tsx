'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskFiltersProps {
  filters: {
    priority: string
    category: string[]
    assignee: string
  }
  onFiltersChange: (filters: {
    priority: string
    category: string[]
    assignee: string
  }) => void
  onClose: () => void
}

const PRIORITIES = [
  { value: 'critical', label: 'Critical', color: 'bg-red-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'low', label: 'Low', color: 'bg-green-500' },
]

const CATEGORIES = [
  'Relief',
  'Medical',
  'Training',
  'Survey',
  'Shelter',
  'Infrastructure',
]

export function TaskFilters({ filters, onFiltersChange, onClose }: TaskFiltersProps) {
  const togglePriority = (priority: string) => {
    // Single select - toggle off if already selected, otherwise select the new one
    const newPriority = filters.priority === priority ? '' : priority
    onFiltersChange({ ...filters, priority: newPriority })
  }

  const toggleCategory = (category: string) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter(c => c !== category)
      : [...filters.category, category]
    onFiltersChange({ ...filters, category: newCategories })
  }

  const clearFilters = () => {
    onFiltersChange({ priority: '', category: [], assignee: '' })
  }

  const hasActiveFilters = filters.priority !== '' || filters.category.length > 0

  return (
    <div className="mb-4 bg-muted/50 p-4 rounded-none">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-foreground">Filters</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Priority Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Priority
          </label>
          <div className="flex flex-wrap gap-2">
            {PRIORITIES.map(p => (
              <Badge
                key={p.value}
                variant={filters.priority === p.value ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer transition-colors border-0',
                  filters.priority === p.value && 'bg-primary'
                )}
                onClick={() => togglePriority(p.value)}
              >
                <span className={cn('w-2 h-2 rounded-full mr-1.5', p.color)} />
                {p.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <Badge
                key={category}
                variant={filters.category.includes(category) ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer transition-colors border-0',
                  filters.category.includes(category) && 'bg-primary'
                )}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
