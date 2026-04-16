'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { X, UserPlus, Check } from 'lucide-react'
import type { Task } from '@/app/tasks/page'

interface NewTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: (task: Omit<Task, 'id' | 'aiAssigned'>) => void
}

const PRIORITIES: { value: Task['priority']; label: string; color: string }[] = [
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

const AVAILABLE_VOLUNTEERS = [
  { id: 'v1', name: 'Raj Patel' },
  { id: 'v2', name: 'Priya Singh' },
  { id: 'v3', name: 'Dr. Amit Kumar' },
  { id: 'v4', name: 'Sneha Gupta' },
  { id: 'v5', name: 'Vikram Sharma' },
  { id: 'v6', name: 'Anita Rao' },
  { id: 'v7', name: 'Rahul Verma' },
  { id: 'v8', name: 'Meera Joshi' },
]

export function NewTaskModal({ open, onOpenChange, onAddTask }: NewTaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const [location, setLocation] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('Relief')
  const [assignedVolunteers, setAssignedVolunteers] = useState<{ id: string; name: string }[]>([])
  const [showVolunteerList, setShowVolunteerList] = useState(false)

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setPriority('medium')
    setLocation('')
    setDueDate('')
    setCategory('Relief')
    setAssignedVolunteers([])
    setShowVolunteerList(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || !location || !dueDate) return

    onAddTask({
      title,
      description,
      priority,
      location,
      status: 'todo',
      assignedVolunteers,
      dueDate,
      category,
    })
    resetForm()
  }

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm()
    }
    onOpenChange(isOpen)
  }

  const toggleVolunteer = (volunteer: { id: string; name: string }) => {
    if (assignedVolunteers.find(v => v.id === volunteer.id)) {
      setAssignedVolunteers(assignedVolunteers.filter(v => v.id !== volunteer.id))
    } else {
      setAssignedVolunteers([...assignedVolunteers, volunteer])
    }
  }

  const removeVolunteer = (volunteerId: string) => {
    setAssignedVolunteers(assignedVolunteers.filter(v => v.id !== volunteerId))
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Name */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Name *</Label>
            <Input
              id="title"
              placeholder="Enter task name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Requirements/Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Requirements *</Label>
            <Textarea
              id="description"
              placeholder="Describe the task requirements"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority *</Label>
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map((p) => (
                <Badge
                  key={p.value}
                  variant={priority === p.value ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-colors',
                    priority === p.value && 'bg-primary'
                  )}
                  onClick={() => setPriority(p.value)}
                >
                  <span className={cn('w-2 h-2 rounded-full mr-1.5', p.color)} />
                  {p.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Badge
                  key={cat}
                  variant={category === cat ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-colors',
                    category === cat && 'bg-primary'
                  )}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          {/* Area/Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Area/Location *</Label>
            <Input
              id="location"
              placeholder="e.g., Sector 12, Delhi"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          {/* Assigned Volunteers */}
          <div className="space-y-2">
            <Label>Assign Volunteers</Label>
            
            {/* Selected Volunteers */}
            {assignedVolunteers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {assignedVolunteers.map((volunteer) => (
                  <Badge
                    key={volunteer.id}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    {volunteer.name}
                    <button
                      type="button"
                      onClick={() => removeVolunteer(volunteer.id)}
                      className="ml-1 hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Add Volunteer Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowVolunteerList(!showVolunteerList)}
            >
              <UserPlus className="h-4 w-4" />
              {showVolunteerList ? 'Hide List' : 'Add Volunteers'}
            </Button>

            {/* Volunteer Selection List */}
            {showVolunteerList && (
              <div className="border rounded-lg p-2 max-h-40 overflow-y-auto space-y-1">
                {AVAILABLE_VOLUNTEERS.map((volunteer) => {
                  const isSelected = assignedVolunteers.find(v => v.id === volunteer.id)
                  return (
                    <div
                      key={volunteer.id}
                      className={cn(
                        'flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors',
                        isSelected ? 'bg-primary/10' : 'hover:bg-muted'
                      )}
                      onClick={() => toggleVolunteer(volunteer)}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {volunteer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm flex-1">{volunteer.name}</span>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
