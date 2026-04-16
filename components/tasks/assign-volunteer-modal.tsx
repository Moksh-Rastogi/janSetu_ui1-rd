'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Search, 
  Sparkles, 
  MapPin, 
  Star, 
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task } from '@/app/tasks/page'

interface AssignVolunteerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task
  onAssign: (taskId: string, volunteer: { id: string; name: string }) => void
}

interface Volunteer {
  id: string
  name: string
  skills: string[]
  availability: 'available' | 'busy' | 'offline'
  rating: number
  completedTasks: number
  distance: string
  aiRecommended?: boolean
}

const MOCK_VOLUNTEERS: Volunteer[] = [
  {
    id: 'v10',
    name: 'Arun Sharma',
    skills: ['Medical', 'First Aid', 'Emergency Response'],
    availability: 'available',
    rating: 4.8,
    completedTasks: 45,
    distance: '2.5 km',
    aiRecommended: true,
  },
  {
    id: 'v11',
    name: 'Neha Kapoor',
    skills: ['Relief Distribution', 'Logistics'],
    availability: 'available',
    rating: 4.9,
    completedTasks: 62,
    distance: '3.1 km',
    aiRecommended: true,
  },
  {
    id: 'v12',
    name: 'Suresh Reddy',
    skills: ['Survey', 'Documentation', 'Photography'],
    availability: 'busy',
    rating: 4.5,
    completedTasks: 28,
    distance: '5.2 km',
  },
  {
    id: 'v13',
    name: 'Lakshmi Iyer',
    skills: ['Training', 'Communication'],
    availability: 'available',
    rating: 4.7,
    completedTasks: 38,
    distance: '4.0 km',
  },
  {
    id: 'v14',
    name: 'Mohammed Ali',
    skills: ['Infrastructure', 'Construction'],
    availability: 'offline',
    rating: 4.6,
    completedTasks: 52,
    distance: '6.8 km',
  },
]

const availabilityConfig = {
  available: { label: 'Available', className: 'bg-green-500' },
  busy: { label: 'Busy', className: 'bg-yellow-500' },
  offline: { label: 'Offline', className: 'bg-gray-400' },
}

export function AssignVolunteerModal({ open, onOpenChange, task, onAssign }: AssignVolunteerModalProps) {
  const [search, setSearch] = useState('')
  const [filterSkill, setFilterSkill] = useState<string | null>(null)
  const [filterAvailability, setFilterAvailability] = useState<string | null>('available')

  const filteredVolunteers = MOCK_VOLUNTEERS.filter(volunteer => {
    if (search && !volunteer.name.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (filterSkill && !volunteer.skills.some(s => s.toLowerCase().includes(filterSkill.toLowerCase()))) {
      return false
    }
    if (filterAvailability && volunteer.availability !== filterAvailability) {
      return false
    }
    // Exclude already assigned volunteers
    if (task.assignedVolunteers.some(av => av.id === volunteer.id)) {
      return false
    }
    return true
  })

  // Sort AI recommended first
  const sortedVolunteers = [...filteredVolunteers].sort((a, b) => {
    if (a.aiRecommended && !b.aiRecommended) return -1
    if (!a.aiRecommended && b.aiRecommended) return 1
    return 0
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Assign Volunteer</DialogTitle>
          <DialogDescription>
            Select a volunteer to assign to &quot;{task.title}&quot;
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search volunteers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant={filterAvailability === 'available' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setFilterAvailability(filterAvailability === 'available' ? null : 'available')}
            >
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
              Available Only
            </Badge>
            <Badge
              variant={filterSkill === task.category ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setFilterSkill(filterSkill === task.category ? null : task.category)}
            >
              <Filter className="h-3 w-3 mr-1" />
              {task.category} Skills
            </Badge>
          </div>
        </div>

        {/* AI Suggestion Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">AI Recommendations</p>
            <p className="text-xs text-muted-foreground">
              Based on skills, availability, and proximity to task location
            </p>
          </div>
        </div>

        {/* Volunteer List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {sortedVolunteers.map(volunteer => (
            <VolunteerCard
              key={volunteer.id}
              volunteer={volunteer}
              onAssign={() => onAssign(task.id, { id: volunteer.id, name: volunteer.name })}
            />
          ))}

          {sortedVolunteers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No volunteers match your criteria
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface VolunteerCardProps {
  volunteer: Volunteer
  onAssign: () => void
}

function VolunteerCard({ volunteer, onAssign }: VolunteerCardProps) {
  const availability = availabilityConfig[volunteer.availability]
  
  return (
    <Card className={cn(
      'hover:shadow-md transition-shadow',
      volunteer.aiRecommended && 'border-primary/30 bg-primary/5'
    )}>
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {volunteer.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{volunteer.name}</span>
              {volunteer.aiRecommended && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <Sparkles className="h-3 w-3" />
                  Recommended
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className={cn('w-2 h-2 rounded-full', availability.className)} />
                {availability.label}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                {volunteer.rating}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {volunteer.completedTasks} tasks
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {volunteer.distance}
              </span>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {volunteer.skills.map(skill => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            size="sm"
            onClick={onAssign}
            disabled={volunteer.availability === 'offline'}
          >
            Assign
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
