'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { VolunteerGrid } from '@/components/volunteers/volunteer-grid'
import { Leaderboard } from '@/components/volunteers/leaderboard'
import { TeamFormation } from '@/components/volunteers/team-formation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, UserPlus, Users, Trophy, UsersRound } from 'lucide-react'

export interface Volunteer {
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

export const MOCK_VOLUNTEERS: Volunteer[] = [
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
    dueDate: '2024-01-12',
    category: 'Shelter',
  },
]

export default function VolunteersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('volunteers')

  const filteredVolunteers = MOCK_VOLUNTEERS.filter(volunteer =>
    volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    volunteer.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Volunteer Ecosystem</h1>
              <p className="text-muted-foreground mt-1">
                Manage volunteers, track performance, and build teams
              </p>
            </div>
            <Button className="gap-2 w-fit">
              <UserPlus className="h-4 w-4" />
              Add Volunteer
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="volunteers" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Volunteers</span>
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="gap-2">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Leaderboard</span>
              </TabsTrigger>
              <TabsTrigger value="teams" className="gap-2">
                <UsersRound className="h-4 w-4" />
                <span className="hidden sm:inline">Teams</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="volunteers" className="mt-6">
              <VolunteerGrid volunteers={filteredVolunteers} tasks={MOCK_TASKS} />
            </TabsContent>

            <TabsContent value="leaderboard" className="mt-6">
              <Leaderboard volunteers={MOCK_VOLUNTEERS} />
            </TabsContent>

            <TabsContent value="teams" className="mt-6">
              <TeamFormation volunteers={MOCK_VOLUNTEERS} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}
