'use client'

import { use } from 'react'
import Link from 'next/link'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Circle,
  PlayCircle,
  Heart
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TASKS } from '@/lib/search-data'
import { MOCK_TASKS } from '../page'

const priorityConfig = {
  critical: { label: 'Critical', className: 'bg-red-500 text-white', icon: AlertTriangle },
  high: { label: 'High', className: 'bg-orange-500 text-white', icon: AlertTriangle },
  medium: { label: 'Medium', className: 'bg-yellow-500 text-white', icon: Circle },
  low: { label: 'Low', className: 'bg-green-500 text-white', icon: Circle },
}

const statusConfig = {
  todo: { label: 'To Do', className: 'bg-gray-500/10 text-gray-600 border-gray-500/20', icon: Circle },
  'in-progress': { label: 'In Progress', className: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: PlayCircle },
  completed: { label: 'Completed', className: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle2 },
}

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  // Find task from search data first, then from mock tasks
  const searchTask = TASKS.find(t => t.id === id)
  const mockTask = MOCK_TASKS.find(t => t.id === id)
  
  if (!searchTask && !mockTask) {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold">Task not found</h1>
          <Link href="/tasks">
            <Button className="mt-4">Back to Tasks</Button>
          </Link>
        </div>
      </AppLayout>
    )
  }

  // Merge data from both sources
  const task = {
    id,
    title: searchTask?.title || mockTask?.title || '',
    description: searchTask?.description || mockTask?.description || '',
    location: searchTask?.location || mockTask?.location || '',
    status: (mockTask?.status || searchTask?.status || 'todo') as 'todo' | 'in-progress' | 'completed',
    category: searchTask?.category || mockTask?.category || 'General',
    priority: (mockTask?.priority || 'medium') as 'critical' | 'high' | 'medium' | 'low',
    dueDate: mockTask?.dueDate || '2024-01-20',
    assignedVolunteers: mockTask?.assignedVolunteers || [],
    donators: mockTask?.donators || [],
    aiAssigned: mockTask?.aiAssigned || false,
  }

  const priority = priorityConfig[task.priority]
  const status = statusConfig[task.status]
  const StatusIcon = status.icon
  const PriorityIcon = priority.icon

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <Link href="/tasks">
            <Button variant="ghost" className="gap-2 mb-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Tasks
            </Button>
          </Link>

          {/* Header Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge className={cn(priority.className)}>
                        <PriorityIcon className="h-3 w-3 mr-1" />
                        {priority.label}
                      </Badge>
                      <Badge variant="outline" className={status.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                      {task.aiAssigned && (
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                          AI Assigned
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                      {task.title}
                    </h1>
                    <p className="text-muted-foreground mt-2">{task.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {task.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Due: {new Date(task.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <Badge variant="outline">{task.category}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Assigned Volunteers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Assigned Volunteers ({task.assignedVolunteers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {task.assignedVolunteers.length > 0 ? (
                  task.assignedVolunteers.map((volunteer) => (
                    <Link 
                      key={volunteer.id} 
                      href={`/volunteers/${volunteer.id}`}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                          {volunteer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{volunteer.name}</p>
                        <p className="text-xs text-muted-foreground">Click to view profile</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No volunteers assigned yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Donors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Task Donors ({task.donators.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {task.donators.length > 0 ? (
                  task.donators.map((donor) => (
                    <div 
                      key={donor.id} 
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-green-500/10 text-green-600 text-sm font-bold">
                            {donor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{donor.name}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600">
                        ₹{donor.amount.toLocaleString()}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No donations yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Task Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Task Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-2 border-primary pl-4">
                <p className="text-xs text-muted-foreground mb-1">Task Created</p>
                <p className="text-sm">Task was created and added to the system</p>
              </div>
              {task.assignedVolunteers.length > 0 && (
                <div className="border-l-2 border-blue-500 pl-4">
                  <p className="text-xs text-muted-foreground mb-1">Volunteers Assigned</p>
                  <p className="text-sm">{task.assignedVolunteers.length} volunteer(s) assigned to this task</p>
                </div>
              )}
              {task.status === 'in-progress' && (
                <div className="border-l-2 border-yellow-500 pl-4">
                  <p className="text-xs text-muted-foreground mb-1">In Progress</p>
                  <p className="text-sm">Task is currently being worked on</p>
                </div>
              )}
              {task.status === 'completed' && (
                <div className="border-l-2 border-green-500 pl-4">
                  <p className="text-xs text-muted-foreground mb-1">Completed</p>
                  <p className="text-sm">Task has been successfully completed</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
