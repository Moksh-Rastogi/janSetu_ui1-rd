'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { TaskKanbanBoard } from '@/components/tasks/kanban-board'
import { TaskFilters } from '@/components/tasks/task-filters'
import { AssignVolunteerModal } from '@/components/tasks/assign-volunteer-modal'
import { NewTaskModal } from '@/components/tasks/new-task-modal'
import { Button } from '@/components/ui/button'
import { Plus, Filter } from 'lucide-react'

export interface Task {
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
}

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Distribute Relief Supplies',
    description: 'Distribute food and water packets to affected families in Sector 12',
    priority: 'critical',
    location: 'Sector 12, Delhi',
    status: 'todo',
    assignedVolunteers: [
      { id: 'v1', name: 'Raj Patel' },
      { id: 'v2', name: 'Priya Singh' },
    ],
    aiAssigned: true,
    dueDate: '2024-01-15',
    category: 'Relief',
  },
  {
    id: '2',
    title: 'Medical Camp Setup',
    description: 'Set up medical camp for health checkups and first aid',
    priority: 'high',
    location: 'Community Hall, Noida',
    status: 'todo',
    assignedVolunteers: [{ id: 'v3', name: 'Dr. Amit Kumar' }],
    aiAssigned: false,
    dueDate: '2024-01-16',
    category: 'Medical',
  },
  {
    id: '3',
    title: 'Volunteer Training Session',
    description: 'Conduct training for new volunteers on emergency protocols',
    priority: 'medium',
    location: 'NGO Office, Gurgaon',
    status: 'in-progress',
    assignedVolunteers: [{ id: 'v4', name: 'Sneha Gupta' }],
    aiAssigned: true,
    dueDate: '2024-01-14',
    category: 'Training',
  },
  {
    id: '4',
    title: 'Damage Assessment Survey',
    description: 'Survey flood-affected areas and document damage for relief planning',
    priority: 'high',
    location: 'Multiple Districts',
    status: 'in-progress',
    assignedVolunteers: [
      { id: 'v5', name: 'Vikram Sharma' },
      { id: 'v6', name: 'Anita Rao' },
    ],
    aiAssigned: false,
    dueDate: '2024-01-17',
    category: 'Survey',
  },
  {
    id: '5',
    title: 'Shelter Setup Complete',
    description: 'Emergency shelter setup for displaced families',
    priority: 'critical',
    location: 'Stadium Ground, Delhi',
    status: 'completed',
    assignedVolunteers: [
      { id: 'v7', name: 'Rahul Verma' },
      { id: 'v8', name: 'Meera Joshi' },
    ],
    aiAssigned: true,
    dueDate: '2024-01-13',
    category: 'Shelter',
  },
  {
    id: '6',
    title: 'Food Distribution Drive',
    description: 'Completed food distribution to 500 families',
    priority: 'high',
    location: 'Block A, Faridabad',
    status: 'completed',
    assignedVolunteers: [{ id: 'v9', name: 'Karan Singh' }],
    aiAssigned: false,
    dueDate: '2024-01-12',
    category: 'Relief',
  },
  {
    id: '7',
    title: 'Water Purification Setup',
    description: 'Install water purification units at relief camps',
    priority: 'medium',
    location: 'Relief Camp 3, Ghaziabad',
    status: 'todo',
    assignedVolunteers: [],
    aiAssigned: false,
    dueDate: '2024-01-18',
    category: 'Infrastructure',
  },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [filters, setFilters] = useState({
    priority: '' as string,
    category: [] as string[],
    assignee: '',
  })
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)

  const handleTaskMove = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
  }

  const handleAssignVolunteer = (task: Task) => {
    setSelectedTask(task)
    setShowAssignModal(true)
  }

  const handleVolunteerAssigned = (taskId: string, volunteer: { id: string; name: string }) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, assignedVolunteers: [...task.assignedVolunteers, volunteer] }
        : task
    ))
    setShowAssignModal(false)
  }

  const handleAddNewTask = (newTask: Omit<Task, 'id' | 'aiAssigned'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      aiAssigned: false,
    }
    setTasks([task, ...tasks])
    setShowNewTaskModal(false)
  }

  const filteredTasks = tasks.filter(task => {
    if (filters.priority && filters.priority !== task.priority) {
      return false
    }
    if (filters.category.length > 0 && !filters.category.includes(task.category)) {
      return false
    }
    return true
  })

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 h-[calc(100vh-64px)] flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Task Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all relief tasks across campaigns
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button className="gap-2" onClick={() => setShowNewTaskModal(true)}>
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <TaskFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClose={() => setShowFilters(false)}
          />
        )}

        {/* Kanban Board */}
        <div className="flex-1 overflow-hidden">
          <TaskKanbanBoard
            tasks={filteredTasks}
            onTaskMove={handleTaskMove}
            onAssignVolunteer={handleAssignVolunteer}
          />
        </div>

        {/* Assign Volunteer Modal */}
        {selectedTask && (
          <AssignVolunteerModal
            open={showAssignModal}
            onOpenChange={setShowAssignModal}
            task={selectedTask}
            onAssign={handleVolunteerAssigned}
          />
        )}

        {/* New Task Modal */}
        <NewTaskModal
          open={showNewTaskModal}
          onOpenChange={setShowNewTaskModal}
          onAddTask={handleAddNewTask}
        />
      </div>
    </AppLayout>
  )
}
