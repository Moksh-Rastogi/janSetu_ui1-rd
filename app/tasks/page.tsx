'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { TaskKanbanBoard } from '@/components/tasks/kanban-board'
import { TaskFilters } from '@/components/tasks/task-filters'
import { AssignVolunteerModal } from '@/components/tasks/assign-volunteer-modal'
import { NewTaskModal } from '@/components/tasks/new-task-modal'
import { Button } from '@/components/ui/button'
import { Plus, Filter } from 'lucide-react'
import { useVolunteers } from '@/components/volunteers/volunteer-context'

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
  donators?: {
    id: string
    name: string
    amount: number
  }[]
}

export interface Volunteer {
  id: string
  name: string
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

const REGISTERED_VOLUNTEERS: Volunteer[] = [
  {
    id: 'v1',
    name: 'Raj Patel',
    skills: ['Medical', 'First Aid', 'Emergency Response'],
    availability: 'available',
    rating: 4.9,
    reliabilityScore: 98,
    completedTasks: 87,
    points: 4250,
    badges: ['First Responder', 'Top Contributor', 'Medical Expert'],
    joinedDate: '2023-03-15',
    location: 'Delhi',
    ngoAssociations: ['Red Cross', 'NDRF'],
  },
  {
    id: 'v2',
    name: 'Priya Singh',
    skills: ['Relief Distribution', 'Logistics', 'Coordination'],
    availability: 'available',
    rating: 4.8,
    reliabilityScore: 95,
    completedTasks: 62,
    points: 3180,
    badges: ['Logistics Star', 'Team Player'],
    joinedDate: '2023-05-20',
    location: 'Noida',
    ngoAssociations: ['Goonj', 'CRY'],
  },
  {
    id: 'v3',
    name: 'Dr. Amit Kumar',
    skills: ['Medical', 'Surgery', 'Health Camps'],
    availability: 'busy',
    rating: 5.0,
    reliabilityScore: 100,
    completedTasks: 120,
    points: 6500,
    badges: ['Medical Expert', 'Life Saver', 'Mentor', 'Top Contributor'],
    joinedDate: '2022-11-10',
    location: 'Gurgaon',
    ngoAssociations: ['Mercy Corps', 'WHO India'],
  },
  {
    id: 'v4',
    name: 'Sneha Gupta',
    skills: ['Training', 'Communication', 'Social Media'],
    availability: 'available',
    rating: 4.7,
    reliabilityScore: 92,
    completedTasks: 45,
    points: 2100,
    badges: ['Trainer', 'Communicator'],
    joinedDate: '2023-07-01',
    location: 'Delhi',
    ngoAssociations: ['Teach for India'],
  },
  {
    id: 'v5',
    name: 'Vikram Sharma',
    skills: ['Survey', 'Documentation', 'Data Analysis'],
    availability: 'offline',
    rating: 4.5,
    reliabilityScore: 88,
    completedTasks: 38,
    points: 1850,
    badges: ['Data Wizard', 'Surveyor'],
    joinedDate: '2023-08-15',
    location: 'Faridabad',
    ngoAssociations: ['CARE India'],
  },
  {
    id: 'v6',
    name: 'Anita Rao',
    skills: ['Shelter Management', 'Food Distribution'],
    availability: 'available',
    rating: 4.6,
    reliabilityScore: 90,
    completedTasks: 55,
    points: 2750,
    badges: ['Shelter Expert', 'Food Angel'],
    joinedDate: '2023-04-22',
    location: 'Ghaziabad',
    ngoAssociations: ['Akshaya Patra', 'NDRF'],
  },
  {
    id: 'v7',
    name: 'Rahul Verma',
    skills: ['Construction', 'Infrastructure', 'Heavy Machinery'],
    availability: 'available',
    rating: 4.4,
    reliabilityScore: 85,
    completedTasks: 32,
    points: 1600,
    badges: ['Builder', 'Infrastructure Pro'],
    joinedDate: '2023-09-01',
    location: 'Delhi',
    ngoAssociations: ['Habitat for Humanity'],
  },
  {
    id: 'v8',
    name: 'Meera Joshi',
    skills: ['Counseling', 'Mental Health', 'Child Care'],
    availability: 'busy',
    rating: 4.8,
    reliabilityScore: 94,
    completedTasks: 68,
    points: 3400,
    badges: ['Mental Health Advocate', 'Child Protector', 'Counselor'],
    joinedDate: '2023-02-10',
    location: 'Noida',
    ngoAssociations: ['Childline', 'iCall'],
  },
]

export const MOCK_TASKS: Task[] = [
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
    donators: [
      { id: 'd1', name: 'Ravi Kapoor', amount: 5000 },
      { id: 'd2', name: 'Sunita Devi', amount: 2500 },
    ],
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
    donators: [
      { id: 'd3', name: 'Amit Sharma', amount: 10000 },
      { id: 'd4', name: 'Geeta Rani', amount: 3000 },
      { id: 'd5', name: 'Vijay Kumar', amount: 7500 },
    ],
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
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [filters, setFilters] = useState<TaskFilters>({
    priority: null,
    category: [],
  })
  const { updateVolunteerAvailability } = useVolunteers()
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
    // Update volunteer availability to busy when assigned to a task
    updateVolunteerAvailability(volunteer.id, 'busy')
    setShowAssignModal(false)
  }

  const handleUnassignVolunteer = (taskId: string, volunteerId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, assignedVolunteers: task.assignedVolunteers.filter(v => v.id !== volunteerId) }
        : task
    ))
    // Update volunteer availability to available when removed from task
    updateVolunteerAvailability(volunteerId, 'available')
  }

  const handleAddNewTask = (newTask: Omit<Task, 'id' | 'aiAssigned'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      aiAssigned: true,
    }
    setTasks([task, ...tasks])
    setShowNewTaskModal(false)
  }

  const handleDonate = (taskId: string, donation: { name: string; amount: number }) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            donators: [
              ...(task.donators || []), 
              { id: `d-${Date.now()}`, ...donation }
            ] 
          }
        : task
    ))
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status: 'completed' as const } : t
    ))
    // Update all assigned volunteers to available when task is completed
    if (task) {
      task.assignedVolunteers.forEach(volunteer => {
        updateVolunteerAvailability(volunteer.id, 'available')
      })
    }
  }

  const handleMoveToInProgress = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'in-progress' as const } : task
    ))
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
            onUnassignVolunteer={handleUnassignVolunteer}
            onDonate={handleDonate}
            onDeleteTask={handleDeleteTask}
            onCompleteTask={handleCompleteTask}
            onMoveToInProgress={handleMoveToInProgress}
          />
        </div>

        {/* Assign Volunteer Modal */}
        {selectedTask && (
          <AssignVolunteerModal
            open={showAssignModal}
            onOpenChange={setShowAssignModal}
            task={selectedTask}
            onAssign={handleVolunteerAssigned}
            registeredVolunteers={REGISTERED_VOLUNTEERS}
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
