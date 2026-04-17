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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import type { Resource } from './resource-card'

interface AddResourceDialogProps {
  onAddResource: (resource: Resource) => void
  categories: string[]
}

const UNITS = ['units', 'packets', 'cases', 'kits', 'strips', 'pieces', 'cans', 'bottles', 'boxes']

export function AddResourceDialog({ onAddResource, categories }: AddResourceDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    allocatedQuantity: '',
    location: '',
    expiryDate: '',
    unit: 'units',
  })

  const calculateStatus = (
    quantity: number,
    allocatedQuantity: number,
    expiryDate: string
  ): Resource['status'] => {
    // Check for out of stock first (0 units and 0 allocated)
    if (quantity === 0 && allocatedQuantity === 0) {
      return 'out-of-stock'
    }

    // Check if expiry date is within 30 days
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0

    // If expiring soon takes priority for display (but only if there is stock)
    if (isExpiringSoon && quantity > 0) {
      return 'expiring-soon'
    }

    // Check stock levels
    if (quantity === 0) {
      return 'out-of-stock'
    }

    const available = quantity - allocatedQuantity
    const ratio = quantity > 0 ? available / quantity : 0

    if (ratio < 0.5) {
      return 'low-stock'
    }

    return 'in-stock'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const quantity = parseInt(formData.quantity) || 0
    const allocatedQuantity = parseInt(formData.allocatedQuantity) || 0

    if (formData.name && formData.category && formData.location && formData.expiryDate && quantity >= 0) {
      const status = calculateStatus(quantity, allocatedQuantity, formData.expiryDate)

      const newResource: Resource = {
        id: `r-${Date.now()}`,
        name: formData.name,
        category: formData.category,
        quantity: quantity,
        allocatedQuantity: allocatedQuantity,
        location: formData.location,
        expiryDate: formData.expiryDate,
        status: status,
        unit: formData.unit,
      }

      onAddResource(newResource)
      setFormData({
        name: '',
        category: '',
        quantity: '',
        allocatedQuantity: '',
        location: '',
        expiryDate: '',
        unit: 'units',
      })
      setOpen(false)
    }
  }

  const isFormValid =
    formData.name.trim() &&
    formData.category &&
    formData.location.trim() &&
    formData.expiryDate &&
    formData.quantity

  // Calculate preview status
  const previewStatus = formData.quantity && formData.expiryDate
    ? calculateStatus(
        parseInt(formData.quantity) || 0,
        parseInt(formData.allocatedQuantity) || 0,
        formData.expiryDate
      )
    : null

  const statusLabels: Record<Resource['status'], { label: string; color: string }> = {
    'in-stock': { label: 'In Stock', color: 'text-green-600' },
    'low-stock': { label: 'Low Stock', color: 'text-red-600' },
    'out-of-stock': { label: 'Out of Stock', color: 'text-gray-600' },
    'expiring-soon': { label: 'Expiring Soon', color: 'text-orange-600' },
  }

  // Filter out 'All' from categories for the select
  const selectableCategories = categories.filter((c) => c !== 'All')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Resource</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          {/* Resource Name */}
          <div className="space-y-2">
            <Label htmlFor="resourceName">Resource Name *</Label>
            <Input
              id="resourceName"
              placeholder="e.g., Emergency Food Packets"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Total Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                placeholder="e.g., 500"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Allocated Quantity */}
          <div className="space-y-2">
            <Label htmlFor="allocatedQuantity">Allocated Quantity</Label>
            <Input
              id="allocatedQuantity"
              type="number"
              min="0"
              placeholder="e.g., 100 (default: 0)"
              value={formData.allocatedQuantity}
              onChange={(e) => setFormData({ ...formData, allocatedQuantity: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Available = Total - Allocated. Status is &quot;Low Stock&quot; if available/total ratio is less than 0.5
            </p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="e.g., Warehouse A, Delhi"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date *</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Resources expiring within 30 days will be marked as &quot;Expiring Soon&quot;
            </p>
          </div>

          {/* Status Preview */}
          {previewStatus && (
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm">
                <span className="text-muted-foreground">Calculated Status: </span>
                <span className={`font-semibold ${statusLabels[previewStatus].color}`}>
                  {statusLabels[previewStatus].label}
                </span>
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid}>
              Add Resource
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
