'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'

interface ImpactStat {
  label: string
  value: string
}

interface NGOFormData {
  name: string
  location: string
  description: string
  focusAreas: string[]
  resources: string[]
  impactStats: ImpactStat[]
}

interface AddNGODialogProps {
  onAddNGO: (ngo: NGOFormData) => void
}

export function AddNGODialog({ onAddNGO }: AddNGODialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<NGOFormData>({
    name: '',
    location: '',
    description: '',
    focusAreas: [],
    resources: [],
    impactStats: [],
  })
  const [newFocusArea, setNewFocusArea] = useState('')
  const [newResource, setNewResource] = useState('')
  const [newStatLabel, setNewStatLabel] = useState('')
  const [newStatValue, setNewStatValue] = useState('')

  const handleAddFocusArea = () => {
    if (newFocusArea.trim() && !formData.focusAreas.includes(newFocusArea.trim())) {
      setFormData({
        ...formData,
        focusAreas: [...formData.focusAreas, newFocusArea.trim()],
      })
      setNewFocusArea('')
    }
  }

  const handleRemoveFocusArea = (area: string) => {
    setFormData({
      ...formData,
      focusAreas: formData.focusAreas.filter((a) => a !== area),
    })
  }

  const handleAddResource = () => {
    if (newResource.trim() && !formData.resources.includes(newResource.trim())) {
      setFormData({
        ...formData,
        resources: [...formData.resources, newResource.trim()],
      })
      setNewResource('')
    }
  }

  const handleRemoveResource = (resource: string) => {
    setFormData({
      ...formData,
      resources: formData.resources.filter((r) => r !== resource),
    })
  }

  const handleAddImpactStat = () => {
    if (newStatLabel.trim() && newStatValue.trim()) {
      setFormData({
        ...formData,
        impactStats: [
          ...formData.impactStats,
          { label: newStatLabel.trim(), value: newStatValue.trim() },
        ],
      })
      setNewStatLabel('')
      setNewStatValue('')
    }
  }

  const handleRemoveImpactStat = (label: string) => {
    setFormData({
      ...formData,
      impactStats: formData.impactStats.filter((s) => s.label !== label),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.location && formData.description && formData.focusAreas.length > 0) {
      onAddNGO(formData)
      setFormData({
        name: '',
        location: '',
        description: '',
        focusAreas: [],
        resources: [],
        impactStats: [],
      })
      setOpen(false)
    }
  }

  const isFormValid =
    formData.name.trim() &&
    formData.location.trim() &&
    formData.description.trim() &&
    formData.focusAreas.length > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add NGO
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New NGO to Network</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">NGO Name *</Label>
              <Input
                id="name"
                placeholder="Enter NGO name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Mumbai, Maharashtra"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Overview *</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the NGO and its mission"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          {/* Focus Areas */}
          <div className="space-y-3">
            <Label>Focus Areas *</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Healthcare, Education"
                value={newFocusArea}
                onChange={(e) => setNewFocusArea(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddFocusArea()
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={handleAddFocusArea}>
                Add
              </Button>
            </div>
            {formData.focusAreas.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.focusAreas.map((area) => (
                  <Badge key={area} variant="secondary" className="gap-1">
                    {area}
                    <button
                      type="button"
                      onClick={() => handleRemoveFocusArea(area)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Resources Available */}
          <div className="space-y-3">
            <Label>Resources Available</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Volunteers, Equipment"
                value={newResource}
                onChange={(e) => setNewResource(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddResource()
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={handleAddResource}>
                Add
              </Button>
            </div>
            {formData.resources.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.resources.map((resource) => (
                  <Badge key={resource} variant="outline" className="gap-1">
                    {resource}
                    <button
                      type="button"
                      onClick={() => handleRemoveResource(resource)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Impact Statistics */}
          <div className="space-y-3">
            <Label>Impact Statistics</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Label (e.g., People Served)"
                value={newStatLabel}
                onChange={(e) => setNewStatLabel(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Value (e.g., 1,000)"
                value={newStatValue}
                onChange={(e) => setNewStatValue(e.target.value)}
                className="flex-1"
              />
              <Button type="button" variant="secondary" onClick={handleAddImpactStat}>
                Add
              </Button>
            </div>
            {formData.impactStats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {formData.impactStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="p-2 rounded-lg bg-muted text-center relative group"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveImpactStat(stat.label)}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <p className="font-bold text-sm">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Default Values Info */}
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Note:</span> New NGOs are added with a Trust Score of 100 and 0 Active Campaigns by default.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid}>
              Add NGO to Network
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
