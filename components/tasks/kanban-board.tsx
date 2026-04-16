'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  MapPin, 
  Calendar, 
  UserPlus, 
  Sparkles,
  GripVertical,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task } from '@/app/tasks/page'

interface KanbanBoardProps {
  tasks: Task[]
  onTaskMove: (taskId: string, newStatus: Task['status']) => void
  onAssignVolunteer: (task: Task) => void
}

const COLUMNS: { id: Task['status']; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: 'bg-muted' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-primary/10' },
  { id: 'completed', title: 'Completed', color: 'bg-secondary/10' },
]

const priorityConfig = {
  critical: { label: 'Critical', className: 'bg-red-500/10 text-red-600 border-red-500/20' },
  high: { label: 'High', className: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
  medium: { label: 'Medium', className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  low: { label: 'Low', className: 'bg-green-500/10 text-green-600 border-green-500/20' },
}

export function TaskKanbanBoard({ tasks, onTaskMove, onAssignVolunteer }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<Task['status'] | null>(null)

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, columnId: Task['status']) => {
    e.preventDefault()
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, columnId: Task['status']) => {
    e.preventDefault()
    if (draggedTask) {
      onTaskMove(draggedTask, columnId)
    }
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status)
  }

  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-4">
      {COLUMNS.map(column => {
        const columnTasks = getTasksByStatus(column.id)
        const isOver = dragOverColumn === column.id
        
        return (
          <div
            key={column.id}
            className="flex-1 min-w-[300px] max-w-[400px] flex flex-col"
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className={cn('rounded-t-lg px-4 py-3', column.color)}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{column.title}</h3>
                <Badge variant="secondary" className="rounded-full">
                  {columnTasks.length}
                </Badge>
              </div>
            </div>

            {/* Column Content */}
            <div
              className={cn(
                'flex-1 rounded-b-lg border border-t-0 border-border bg-muted/30 p-3 space-y-3 overflow-y-auto transition-colors',
                isOver && 'bg-primary/5 border-primary/30'
              )}
            >
              {columnTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isDragging={draggedTask === task.id}
                  onDragStart={handleDragStart}
                  onAssignVolunteer={onAssignVolunteer}
                />
              ))}

              {columnTasks.length === 0 && (
                <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
                  No tasks
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface TaskCardProps {
  task: Task
  isDragging: boolean
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onAssignVolunteer: (task: Task) => void
}

function TaskCard({ task, isDragging, onDragStart, onAssignVolunteer }: TaskCardProps) {
  const priority = priorityConfig[task.priority]
  
  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className={cn(
        'cursor-grab active:cursor-grabbing transition-all hover:shadow-md',
        isDragging && 'opacity-50 rotate-2 scale-105',
        task.priority === 'critical' && 'border-l-4 border-l-red-500'
      )}
    >
      <CardHeader className="p-3 pb-2">
        <div className="flex items-start gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge variant="outline" className={cn('text-xs', priority.className)}>
                {priority.label}
              </Badge>
              {task.aiAssigned && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI
                </Badge>
              )}
            </div>
            <CardTitle className="text-sm font-medium leading-tight">
              {task.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-3">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {task.description}
        </p>
        
        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{task.location}</span>
        </div>
        
        {/* Due Date */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{new Date(task.dueDate).toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short' 
          })}</span>
        </div>

        {/* Assigned Volunteers */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            {task.assignedVolunteers.length > 0 ? (
              <div className="flex -space-x-2">
                {task.assignedVolunteers.slice(0, 3).map((volunteer) => (
                  <Avatar key={volunteer.id} className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {volunteer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {task.assignedVolunteers.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
                    +{task.assignedVolunteers.length - 3}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">Unassigned</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation()
              onAssignVolunteer(task)
            }}
          >
            <UserPlus className="h-3 w-3 mr-1" />
            Assign
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
