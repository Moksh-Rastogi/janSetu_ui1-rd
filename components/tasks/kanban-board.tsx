'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { 
  MapPin, 
  Calendar, 
  UserPlus, 
  Sparkles,
  GripVertical,
  X,
  Share2,
  Heart,
  IndianRupee,
  Trash2,
  CheckCircle,
  PlayCircle,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { Task } from '@/app/tasks/page'

interface KanbanBoardProps {
  tasks: Task[]
  onTaskMove: (taskId: string, newStatus: Task['status']) => void
  onAssignVolunteer: (task: Task) => void
  onUnassignVolunteer: (taskId: string, volunteerId: string) => void
  onDonate: (taskId: string, donation: { name: string; amount: number }) => void
  onDeleteTask: (taskId: string) => void
  onCompleteTask: (taskId: string) => void
  onMoveToInProgress: (taskId: string) => void
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

export function TaskKanbanBoard({ tasks, onTaskMove, onAssignVolunteer, onUnassignVolunteer, onDonate, onDeleteTask, onCompleteTask, onMoveToInProgress }: KanbanBoardProps) {
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
                  onUnassignVolunteer={onUnassignVolunteer}
                  onDonate={onDonate}
                  onDeleteTask={onDeleteTask}
                  onCompleteTask={onCompleteTask}
                  onMoveToInProgress={onMoveToInProgress}
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
  onUnassignVolunteer: (taskId: string, volunteerId: string) => void
  onDonate: (taskId: string, donation: { name: string; amount: number }) => void
  onDeleteTask: (taskId: string) => void
  onCompleteTask: (taskId: string) => void
  onMoveToInProgress: (taskId: string) => void
}

function TaskCard({ task, isDragging, onDragStart, onAssignVolunteer, onUnassignVolunteer, onDonate, onDeleteTask, onCompleteTask, onMoveToInProgress }: TaskCardProps) {
  const priority = priorityConfig[task.priority]
  const [showDonateModal, setShowDonateModal] = useState(false)
  const [donorName, setDonorName] = useState('')
  const [donationAmount, setDonationAmount] = useState('')

  const handleShare = async () => {
    const shareText = `Task: ${task.title}\nDescription: ${task.description}\nLocation: ${task.location}\nPriority: ${priority.label}\nDue Date: ${new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}\nStatus: ${task.status.replace('-', ' ').toUpperCase()}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: task.title,
          text: shareText,
        })
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareText)
      alert('Task details copied to clipboard!')
    }
  }

  const handleDonateSubmit = () => {
    if (donorName.trim() && donationAmount && Number(donationAmount) > 0) {
      onDonate(task.id, { name: donorName.trim(), amount: Number(donationAmount) })
      setShowDonateModal(false)
      setDonorName('')
      setDonationAmount('')
    }
  }
  
  return (
    <>
      <Card
        draggable
        onDragStart={(e) => onDragStart(e, task.id)}
        className={cn(
          'cursor-grab active:cursor-grabbing transition-all hover:shadow-md border-l-4',
          isDragging && 'opacity-50 rotate-2 scale-105',
          task.priority === 'critical' && 'border-l-red-500',
          task.priority === 'high' && 'border-l-orange-500',
          task.priority === 'medium' && 'border-l-yellow-500',
          task.priority === 'low' && 'border-l-green-500'
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
                  <Badge className="text-xs gap-1 bg-green-600 hover:bg-green-600 text-white">
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

          {/* Donators - Only show for completed tasks */}
          {task.status === 'completed' && task.donators && task.donators.length > 0 && (
            <div className="pt-2 border-t border-border">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 cursor-pointer transition-colors">
                    <Heart className="h-3 w-3 fill-green-600" />
                    <span className="font-medium">{task.donators.length} Donator{task.donators.length > 1 ? 's' : ''}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3" align="start">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground mb-3">Donators</p>
                    {task.donators.map((donator) => (
                      <div key={donator.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-600">
                            {donator.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-medium">{donator.name}</span>
                        </div>
                        <span className="text-xs font-medium text-green-600 flex items-center">
                          <IndianRupee className="h-3 w-3" />
                          {donator.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Assigned Volunteers */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-1">
              {task.assignedVolunteers.length > 0 ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium cursor-pointer hover:bg-blue-200 transition-colors">
                      {task.assignedVolunteers[0].name.split(' ')[0].toUpperCase()}
                      {task.assignedVolunteers.length > 1 && (
                        <span>
                          , {task.assignedVolunteers[1].name.split(' ').map(n => n[0]).join('')} +{task.assignedVolunteers.length - 1}
                        </span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3" align="start">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground mb-3">Assigned Volunteers</p>
                      {task.assignedVolunteers.map((volunteer) => (
                        <div key={volunteer.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                              {volunteer.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-sm font-medium">{volunteer.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              onUnassignVolunteer(task.id, volunteer.id)
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <span className="text-xs text-muted-foreground">Unassigned</span>
              )}
            </div>
            {task.status !== 'completed' && (
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
            )}
          </div>

          {/* Action Buttons - Share & Donate */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            {/* Share Button - Available for all tasks */}
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs flex-1"
              onClick={(e) => {
                e.stopPropagation()
                handleShare()
              }}
            >
              <Share2 className="h-3 w-3 mr-1" />
              Share
            </Button>

            {/* Donate Button - Only for TODO and IN-PROGRESS tasks */}
            {task.status !== 'completed' && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs flex-1 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDonateModal(true)
                }}
              >
                <Heart className="h-3 w-3 mr-1" />
                Donate
              </Button>
            )}
          </div>

          {/* Go to In Progress & Remove Button - Only for TODO tasks */}
          {task.status === 'todo' && (
            <div className="pt-2 border-t border-border space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs w-full text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                onClick={(e) => {
                  e.stopPropagation()
                  onMoveToInProgress(task.id)
                }}
              >
                <PlayCircle className="h-3 w-3 mr-1" />
                Go to In Progress
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteTask(task.id)
                }}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Remove Task
              </Button>
            </div>
          )}

          {/* Complete Button - Only for IN-PROGRESS tasks */}
          {task.status === 'in-progress' && (
            <div className="pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs w-full text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                onClick={(e) => {
                  e.stopPropagation()
                  onCompleteTask(task.id)
                }}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Mark Complete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Donate Modal */}
      <Dialog open={showDonateModal} onOpenChange={setShowDonateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Make a Donation</DialogTitle>
            <DialogDescription>
              Support this task: &quot;{task.title}&quot;
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="donor-name">Your Name</Label>
              <Input
                id="donor-name"
                placeholder="Enter your name"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="donation-amount">Amount (INR)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="donation-amount"
                  type="number"
                  placeholder="Enter amount"
                  className="pl-9"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  min="1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDonateModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDonateSubmit}
              disabled={!donorName.trim() || !donationAmount || Number(donationAmount) <= 0}
              className="bg-green-600 hover:bg-green-700"
            >
              <Heart className="h-4 w-4 mr-2" />
              Donate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
