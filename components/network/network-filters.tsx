import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Filter, X } from 'lucide-react'

interface Filters {
  location: string
  category: string
  trustScore: number
  activeCampaigns: boolean
}

interface NetworkFiltersProps {
  filters: Filters
  setFilters: (filters: Filters) => void
}

const LOCATIONS = [
  'All Locations',
  'Mumbai, Maharashtra',
  'Delhi, Delhi',
  'Bangalore, Karnataka',
  'Hyderabad, Telangana',
  'Chennai, Tamil Nadu',
  'Pune, Maharashtra',
]

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'water', label: 'Water & Sanitation' },
  { value: 'women', label: 'Women Empowerment' },
  { value: 'emergency', label: 'Emergency Relief' },
  { value: 'environment', label: 'Environment' },
]

export function NetworkFilters({ filters, setFilters }: NetworkFiltersProps) {
  const hasActiveFilters =
    filters.location || filters.category || filters.trustScore > 0 || filters.activeCampaigns

  const handleReset = () => {
    setFilters({
      location: '',
      category: '',
      trustScore: 0,
      activeCampaigns: false,
    })
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <Filter className="h-4 w-4" />
          Filters
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Location Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Select
            value={filters.location}
            onValueChange={(value) =>
              setFilters({ ...filters, location: value === 'All Locations' ? '' : value })
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={filters.category}
            onValueChange={(value) =>
              setFilters({ ...filters, category: value })
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Trust Score Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Min Trust Score: {filters.trustScore}
          </label>
          <Slider
            value={[filters.trustScore]}
            onValueChange={(value) =>
              setFilters({ ...filters, trustScore: value[0] })
            }
            min={0}
            max={100}
            step={5}
            className="mt-2"
          />
        </div>

        {/* Active Campaigns Filter */}
        <div className="space-y-2 flex items-end">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="activeCampaigns"
              checked={filters.activeCampaigns}
              onCheckedChange={(checked) =>
                setFilters({
                  ...filters,
                  activeCampaigns: checked === true,
                })
              }
            />
            <Label htmlFor="activeCampaigns" className="text-sm font-medium cursor-pointer">
              Active Campaigns Only
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
