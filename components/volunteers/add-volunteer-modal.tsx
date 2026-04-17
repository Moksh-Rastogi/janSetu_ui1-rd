'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface Volunteer {
  id: string
  name: string
  avatar?: string
  skills: string[]
  availability: 'available' | 'busy' | 'offline'
  rating: number
  reliabilityScore: number
  completedTasks: number
  points: number
  badges: string[]
  joinedDate: string
  location: string
  ngoAssociations: string[]
}

interface AddVolunteerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (volunteer: Volunteer) => void
}

export function AddVolunteerModal({
  open,
  onOpenChange,
  onAdd,
}: AddVolunteerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    email: '',
    phone: '',
    skills: [] as string[],
    ngoAssociations: [] as string[],
    currentSkill: '',
    currentNgo: '',
  })

  const handleAddSkill = () => {
    if (formData.currentSkill.trim() && !formData.skills.includes(formData.currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.currentSkill.trim()],
        currentSkill: '',
      }))
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }))
  }

  const handleAddNgo = () => {
    if (formData.currentNgo.trim() && !formData.ngoAssociations.includes(formData.currentNgo.trim())) {
      setFormData(prev => ({
        ...prev,
        ngoAssociations: [...prev.ngoAssociations, prev.currentNgo.trim()],
        currentNgo: '',
      }))
    }
  }

  const handleRemoveNgo = (ngo: string) => {
    setFormData(prev => ({
      ...prev,
      ngoAssociations: prev.ngoAssociations.filter(n => n !== ngo),
    }))
  }

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.location.trim() || formData.skills.length === 0) {
      alert('Please fill in all required fields and add at least one skill')
      return
    }

    const newVolunteer: Volunteer = {
      id: `v${Date.now()}`,
      name: formData.name,
      skills: formData.skills,
      availability: 'available',
      rating: 5,
      reliabilityScore: 99,
      completedTasks: 0,
      points: 0,
      badges: [],
      joinedDate: new Date().toISOString().split('T')[0],
      location: formData.location,
      ngoAssociations: formData.ngoAssociations,
    }

    onAdd(newVolunteer)
    
    // Reset form
    setFormData({
      name: '',
      location: '',
      email: '',
      phone: '',
      skills: [],
      ngoAssociations: [],
      currentSkill: '',
      currentNgo: '',
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Volunteer</DialogTitle>
          <DialogDescription>
            Fill in the volunteer details to add them to the JanSetu ecosystem
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter volunteer name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Location <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              placeholder="Enter location (e.g., Delhi, India)"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="volunteer@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone
              </Label>
              <Input
                id="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skill" className="text-sm font-medium">
              Skills <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="skill"
                placeholder="Add a skill (e.g., Medical, First Aid)"
                value={formData.currentSkill}
                onChange={(e) => setFormData(prev => ({ ...prev, currentSkill: e.target.value }))}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddSkill()
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddSkill}
                className="px-4"
              >
                Add
              </Button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="gap-2">
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* NGO Associations */}
          <div className="space-y-2">
            <Label htmlFor="ngo" className="text-sm font-medium">
              NGO Associations
            </Label>
            <div className="flex gap-2">
              <Input
                id="ngo"
                placeholder="Add NGO (e.g., Red Cross, NDRF)"
                value={formData.currentNgo}
                onChange={(e) => setFormData(prev => ({ ...prev, currentNgo: e.target.value }))}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddNgo()
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddNgo}
                className="px-4"
              >
                Add
              </Button>
            </div>
            {formData.ngoAssociations.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.ngoAssociations.map(ngo => (
                  <Badge key={ngo} variant="secondary" className="gap-2">
                    {ngo}
                    <button
                      onClick={() => handleRemoveNgo(ngo)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Default Values Info */}
          <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">Default Values Set:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Rating: 5.0</li>
              <li>Reliability Score: 99%</li>
              <li>Tasks Completed: 0</li>
              <li>Points: 0</li>
              <li>Joined Date: Today</li>
              <li>Availability: Available</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Add Volunteer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
