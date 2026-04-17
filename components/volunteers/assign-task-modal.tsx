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
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search,
  Flame,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Task {
  id: string
  title: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  location: string
  status: 'todo' | 'in-progress' | 'completed'
  assignedVolunteers: {
    id: string
    name: string
    avatar?: string
  }[]
  aiAssigned: boolean
  dueDate: string
  category: string
  donators?: {
    id: string
    name: string
    amount: number
  }[]
}

interface Volunteer {
  id: string
  name: string
  skills: string[]
  availability: 'available' | 'busy' | 'offline'
}

interface AssignTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  volunteer: Volunteer
  tasks: Task[]
  onAssign: (volunteerId: string, taskId: string) => void
  allTasks?: Task[]
}

const priorityConfig = {
  critical: { label: 'Critical', className: 'bg-red-500/10 text-red-600 border-red-500/20', icon: Flame },
  high: { label: 'High', className: 'bg-orange-500/10 text-orange-600 border-orange-500/20', icon: AlertCircle },
  medium: { label: 'Medium', className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: Clock },
  low: { label: 'Low', className: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Clock },
}

export function AssignTaskModal({
  open,
  onOpenChange,
  volunteer,
  tasks,
  onAssign,
  allTasks = [],
}: AssignTaskModalProps) {
  const [search, setSearch] = useState('')

  // Check if volunteer has any in-progress or to-do tasks
  const volunteerAssignedInProgressTasks = allTasks.filter(
    task => task.status === 'in-progress' && 
             task.assignedVolunteers.some(v => v.id === volunteer.id)
  )
  
  const volunteerAssignedToDoTasks = allTasks.filter(
    task => task.status === 'todo' && 
            task.assignedVolunteers.some(v => v.id === volunteer.id)
  )
  
  const volunteerBusyCount = volunteerAssignedInProgressTasks.length + volunteerAssignedToDoTasks.length
  const isVolunteerBusy = volunteerBusyCount > 0

  // Filter tasks by volunteer skills
  const relevantTasks = tasks.filter(task => {
    const taskCategory = task.category.toLowerCase()
    const hasSkill = volunteer.skills.some(skill =>
      skill.toLowerCase().includes(taskCategory) || taskCategory.includes(skill.toLowerCase())
    )
    return hasSkill
  })

  // Separate tasks by status
  const todoTasks = relevantTasks.filter(t => t.status === 'todo')
  const inProgressTasks = relevantTasks.filter(t => t.status === 'in-progress')

  // Apply search filter
  const filterTasks = (taskList: Task[]) => {
    return taskList.filter(task =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase()) ||
      task.location.toLowerCase().includes(search.toLowerCase())
    )
  }

  const filteredTodoTasks = filterTasks(todoTasks)
  const filteredInProgressTasks = filterTasks(inProgressTasks)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <DialogTitle>Assign Tasks to {volunteer.name}</DialogTitle>
            {isVolunteerBusy && (
              <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">
                Currently assigned to {volunteerBusyCount} task{volunteerBusyCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <DialogDescription>
            Showing tasks related to {volunteer.skills.slice(0, 2).join(', ')}
            {volunteer.skills.length > 2 && ` and ${volunteer.skills.length - 2} more skills`}
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks by title, description, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Volunteer Skills Badge */}
        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
          <span className="text-xs font-medium text-muted-foreground">Matched Skills:</span>
          {volunteer.skills.map(skill => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        {/* Tasks Tabs */}
        <Tabs defaultValue="todo" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="todo" className="flex-1">
              To Do ({todoTasks.length})
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="flex-1">
              In Progress ({inProgressTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todo" className="flex-1 overflow-y-auto space-y-2">
            {filteredTodoTasks.length > 0 ? (
              filteredTodoTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onAssign={() => {
                    onAssign(volunteer.id, task.id)
                    onOpenChange(false)
                  }}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {todoTasks.length === 0
                  ? 'No to-do tasks match this volunteer skills'
                  : 'No tasks match your search'}
              </div>
            )}
          </TabsContent>

          <TabsContent value="in-progress" className="flex-1 overflow-y-auto space-y-2">
            {filteredInProgressTasks.length > 0 ? (
              filteredInProgressTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onAssign={() => {
                    onAssign(volunteer.id, task.id)
                    onOpenChange(false)
                  }}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {inProgressTasks.length === 0
                  ? 'No in-progress tasks match this volunteer skills'
                  : 'No tasks match your search'}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

interface TaskCardProps {
  task: Task
  onAssign: () => void
}

function TaskCard({ task, onAssign }: TaskCardProps) {
  const config = priorityConfig[task.priority]
  const PriorityIcon = config.icon

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            {/* Title and Priority */}
            <div className="flex items-start gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground line-clamp-2">{task.title}</h4>
              </div>
              <Badge className={cn('flex-shrink-0 gap-1', config.className)}>
                <PriorityIcon className="h-3 w-3" />
                {config.label}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {task.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {task.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Due {new Date(task.dueDate).toLocaleDateString()}
              </span>
              <Badge variant="outline" className="text-xs">
                {task.category}
              </Badge>
              {task.assignedVolunteers.length > 0 && (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {task.assignedVolunteers.length} assigned
                </span>
              )}
            </div>
          </div>

          {/* Assign Button */}
          <Button
            size="sm"
            onClick={onAssign}
            className="flex-shrink-0"
          >
            Assign
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
