'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export interface FilterState {
  urgency: string[]
  category: string[]
  ngo: string[]
  distance: number
}

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

const urgencyOptions = [
  { id: 'critical', label: 'Critical', color: 'bg-red-500' },
  { id: 'high', label: 'High', color: 'bg-orange-500' },
  { id: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { id: 'low', label: 'Low', color: 'bg-green-500' },
]

const categoryOptions = [
  { id: 'health', label: 'Health' },
  { id: 'food', label: 'Food' },
  { id: 'disaster', label: 'Disaster' },
  { id: 'education', label: 'Education' },
]

const ngoOptions = [
  { id: 'red-cross', label: 'Red Cross' },
  { id: 'care-india', label: 'Care India' },
  { id: 'unicef', label: 'UNICEF' },
  { id: 'local-ngo', label: 'Local NGOs' },
]

export function FilterPanel({ isOpen, onClose, filters, onFiltersChange }: FilterPanelProps) {
  const handleUrgencyChange = (urgencyId: string, checked: boolean) => {
    const newUrgency = checked
      ? [...filters.urgency, urgencyId]
      : filters.urgency.filter(u => u !== urgencyId)
    onFiltersChange({ ...filters, urgency: newUrgency })
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategory = checked
      ? [...filters.category, categoryId]
      : filters.category.filter(c => c !== categoryId)
    onFiltersChange({ ...filters, category: newCategory })
  }

  const handleNgoChange = (ngoId: string, checked: boolean) => {
    const newNgo = checked
      ? [...filters.ngo, ngoId]
      : filters.ngo.filter(n => n !== ngoId)
    onFiltersChange({ ...filters, ngo: newNgo })
  }

  const handleDistanceChange = (value: number[]) => {
    onFiltersChange({ ...filters, distance: value[0] })
  }

  const handleClearAll = () => {
    onFiltersChange({
      urgency: [],
      category: [],
      ngo: [],
      distance: 100,
    })
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm z-30"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          'absolute top-16 left-4 z-40 w-80',
          'bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl',
          'transform transition-all duration-300 ease-out',
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-semibold text-white">Filters</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Urgency */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">Urgency Level</Label>
            <div className="space-y-2">
              {urgencyOptions.map((option) => (
                <div key={option.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`urgency-${option.id}`}
                    checked={filters.urgency.includes(option.id)}
                    onCheckedChange={(checked) => handleUrgencyChange(option.id, checked as boolean)}
                    className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className={cn('w-3 h-3 rounded-full', option.color)} />
                  <Label
                    htmlFor={`urgency-${option.id}`}
                    className="text-sm text-white/80 cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">Category</Label>
            <div className="space-y-2">
              {categoryOptions.map((option) => (
                <div key={option.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`category-${option.id}`}
                    checked={filters.category.includes(option.id)}
                    onCheckedChange={(checked) => handleCategoryChange(option.id, checked as boolean)}
                    className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label
                    htmlFor={`category-${option.id}`}
                    className="text-sm text-white/80 cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* NGO */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">NGO</Label>
            <div className="space-y-2">
              {ngoOptions.map((option) => (
                <div key={option.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`ngo-${option.id}`}
                    checked={filters.ngo.includes(option.id)}
                    onCheckedChange={(checked) => handleNgoChange(option.id, checked as boolean)}
                    className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label
                    htmlFor={`ngo-${option.id}`}
                    className="text-sm text-white/80 cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Distance Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-white">Distance</Label>
              <span className="text-sm text-white/60">{filters.distance} km</span>
            </div>
            <Slider
              value={[filters.distance]}
              onValueChange={handleDistanceChange}
              max={100}
              min={5}
              step={5}
              className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-0"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex gap-2">
          <Button
            variant="ghost"
            onClick={handleClearAll}
            className="flex-1 text-white/70 hover:text-white hover:bg-white/10"
          >
            Clear All
          </Button>
          <Button onClick={onClose} className="flex-1 bg-primary hover:bg-primary/90">
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  )
}
