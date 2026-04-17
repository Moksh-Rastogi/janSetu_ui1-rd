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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Zap } from 'lucide-react'
import type { Campaign } from '@/components/donations/donation-card'

interface AddCampaignDialogProps {
  onAddCampaign: (campaign: Campaign) => void
  categories: string[]
}

const URGENCY_OPTIONS: { value: Campaign['urgency']; label: string; description: string }[] = [
  { value: 'critical', label: 'Critical', description: 'Immediate attention required' },
  { value: 'high', label: 'Urgent', description: 'High priority campaign' },
  { value: 'medium', label: 'Active', description: 'Regular ongoing campaign' },
  { value: 'low', label: 'Ongoing', description: 'Long-term initiative' },
]

export function AddCampaignDialog({ onAddCampaign, categories }: AddCampaignDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goalAmount: '',
    category: '',
    urgency: 'medium' as Campaign['urgency'],
    daysLeft: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const goalAmount = parseInt(formData.goalAmount) || 0
    const daysLeft = parseInt(formData.daysLeft) || 30

    if (formData.name && formData.description && formData.category && goalAmount > 0) {
      const newCampaign: Campaign = {
        id: `c-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        amountRaised: 0,
        goalAmount: goalAmount,
        donorCount: 0,
        daysLeft: daysLeft,
        urgency: formData.urgency,
        category: formData.category,
      }

      onAddCampaign(newCampaign)
      setFormData({
        name: '',
        description: '',
        goalAmount: '',
        category: '',
        urgency: 'medium',
        daysLeft: '',
      })
      setOpen(false)
    }
  }

  const isFormValid =
    formData.name.trim() &&
    formData.description.trim() &&
    formData.category &&
    formData.goalAmount &&
    parseInt(formData.goalAmount) > 0

  // Filter out 'All' from categories for the select
  const selectableCategories = categories.filter((c) => c !== 'All')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Create New Campaign
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          {/* Campaign Name */}
          <div className="space-y-2">
            <Label htmlFor="campaignName">Campaign Name *</Label>
            <Input
              id="campaignName"
              placeholder="e.g., Flood Relief Fund - District X"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the campaign goals and how the funds will be used..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {selectableCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Goal Amount and Days */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goalAmount">Goal Amount (₹) *</Label>
              <Input
                id="goalAmount"
                type="number"
                min="1000"
                placeholder="e.g., 500000"
                value={formData.goalAmount}
                onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="daysLeft">Duration (Days)</Label>
              <Input
                id="daysLeft"
                type="number"
                min="1"
                max="365"
                placeholder="e.g., 30"
                value={formData.daysLeft}
                onChange={(e) => setFormData({ ...formData, daysLeft: e.target.value })}
              />
            </div>
          </div>

          {/* Urgency Level */}
          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency Level *</Label>
            <Select
              value={formData.urgency}
              onValueChange={(value) => setFormData({ ...formData, urgency: value as Campaign['urgency'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {URGENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          {formData.goalAmount && parseInt(formData.goalAmount) > 0 && (
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Goal Preview:</span>{' '}
                {parseInt(formData.goalAmount) >= 100000 
                  ? `₹${(parseInt(formData.goalAmount) / 100000).toFixed(1)}L`
                  : parseInt(formData.goalAmount) >= 1000
                  ? `₹${(parseInt(formData.goalAmount) / 1000).toFixed(1)}K`
                  : `₹${formData.goalAmount}`
                }
                {formData.daysLeft && ` over ${formData.daysLeft} days`}
              </p>
            </div>
          )}

          {/* Default Values Info */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Note:</span> New campaigns start with ₹0 raised and 0 donors. Duration defaults to 30 days if not specified.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid}>
              Create Campaign
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
