'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AssignTaskModal } from '@/components/volunteers/assign-task-modal'
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Calendar, 
  CheckCircle2,
  TrendingUp,
  Award,
  Flame,
  Clock,
  Building2,
  Mail,
  Phone,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_VOLUNTEERS } from '../page'
import { MOCK_TASKS } from '../../tasks/page'
import { useVolunteers } from '@/components/volunteers/volunteer-context'

interface Volunteer {
  id: string
  name: string
  email: string
  phone: string
  skills: string[]
  availability: 'available' | 'busy' | 'offline'
  rating: number
  reliabilityScore: number
  completedTasks: number
  points: number
  badges: { name: string; description: string; earnedDate: string }[]
  joinedDate: string
  location: string
  ngoAssociations: string[]
  taskHistory: {
    id: string
    title: string
    status: 'completed' | 'in-progress' | 'cancelled'
    date: string
    rating?: number
  }[]
  monthlyStats: { month: string; tasks: number; hours: number }[]
}

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

// Function to create default profile for new volunteers
function createDefaultProfileFromBase(baseVolunteer: any): Volunteer {
  return {
    id: baseVolunteer.id,
    name: baseVolunteer.name,
    email: baseVolunteer.email || `${baseVolunteer.name.toLowerCase().replace(/\s+/g, '.')}@jansetu.org`,
    phone: baseVolunteer.phone || 'Not provided',
    skills: baseVolunteer.skills || [],
    availability: baseVolunteer.availability || 'available',
    rating: baseVolunteer.rating || 5,
    reliabilityScore: baseVolunteer.reliabilityScore || 99,
    completedTasks: baseVolunteer.completedTasks || 0,
    points: baseVolunteer.points || 0,
    badges: [],
    joinedDate: baseVolunteer.joinedDate || new Date().toISOString().split('T')[0],
    location: baseVolunteer.location || 'Not specified',
    ngoAssociations: baseVolunteer.ngoAssociations || [],
    taskHistory: [],
    monthlyStats: [],
  }
}

// Enhanced volunteer profiles with contact info and history
const ENHANCED_VOLUNTEER_PROFILES: Record<string, Volunteer> = {
  v1: {
    id: 'v1',
    name: 'Raj Patel',
    email: 'raj.patel@example.com',
    phone: '+91 98765 43210',
    skills: ['Medical', 'First Aid', 'Emergency Response', 'Counseling', 'Logistics'],
    availability: 'available',
    rating: 4.9,
    reliabilityScore: 98,
    completedTasks: 87,
    points: 4250,
    badges: [
      { name: 'First Responder', description: 'Completed 10 emergency tasks', earnedDate: '2023-06-15' },
      { name: 'Top Contributor', description: 'In top 10% of volunteers', earnedDate: '2023-08-20' },
      { name: 'Medical Expert', description: 'Completed 20 medical tasks', earnedDate: '2023-10-05' },
      { name: 'Mentor', description: 'Trained 5 new volunteers', earnedDate: '2023-12-01' },
      { name: 'Night Owl', description: 'Completed 10 night-shift tasks', earnedDate: '2024-01-10' },
    ],
    joinedDate: '2023-03-15',
    location: 'Delhi, India',
    ngoAssociations: ['Red Cross', 'NDRF', 'Goonj'],
    taskHistory: [
      { id: 't1', title: 'Emergency Medical Support - Sector 12', status: 'completed', date: '2024-01-14', rating: 5 },
      { id: 't2', title: 'Relief Distribution Drive', status: 'completed', date: '2024-01-12', rating: 5 },
      { id: 't3', title: 'First Aid Training Session', status: 'completed', date: '2024-01-10', rating: 4 },
      { id: 't4', title: 'Flood Relief Coordination', status: 'in-progress', date: '2024-01-15' },
      { id: 't5', title: 'Health Camp Organization', status: 'completed', date: '2024-01-08', rating: 5 },
      { id: 't6', title: 'Volunteer Orientation', status: 'completed', date: '2024-01-05', rating: 4 },
      { id: 't7', title: 'Supply Chain Management', status: 'cancelled', date: '2024-01-03' },
    ],
    monthlyStats: [
      { month: 'Oct', tasks: 8, hours: 32 },
      { month: 'Nov', tasks: 12, hours: 48 },
      { month: 'Dec', tasks: 15, hours: 60 },
      { month: 'Jan', tasks: 10, hours: 40 },
    ],
  },
  v2: {
    id: 'v2',
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    phone: '+91 97654 32109',
    skills: ['Relief Distribution', 'Logistics', 'Coordination'],
    availability: 'available',
    rating: 4.8,
    reliabilityScore: 95,
    completedTasks: 62,
    points: 3180,
    badges: [
      { name: 'Logistics Star', description: 'Completed 30 logistics tasks', earnedDate: '2023-08-10' },
      { name: 'Team Player', description: 'Coordinated 10 team activities', earnedDate: '2023-09-15' },
    ],
    joinedDate: '2023-05-20',
    location: 'Noida, India',
    ngoAssociations: ['Goonj', 'CRY'],
    taskHistory: [
      { id: 't8', title: 'Food Distribution - North Delhi', status: 'completed', date: '2024-01-10', rating: 5 },
      { id: 't9', title: 'Supply Chain Coordination', status: 'completed', date: '2024-01-05', rating: 4 },
      { id: 't10', title: 'Relief Supplies Sorting', status: 'in-progress', date: '2024-01-15' },
    ],
    monthlyStats: [
      { month: 'Oct', tasks: 6, hours: 24 },
      { month: 'Nov', tasks: 9, hours: 36 },
      { month: 'Dec', tasks: 10, hours: 40 },
      { month: 'Jan', tasks: 8, hours: 32 },
    ],
  },
  v3: {
    id: 'v3',
    name: 'Dr. Amit Kumar',
    email: 'amit.kumar@example.com',
    phone: '+91 96543 21098',
    skills: ['Medical', 'Surgery', 'Health Camps'],
    availability: 'busy',
    rating: 5.0,
    reliabilityScore: 100,
    completedTasks: 120,
    points: 6500,
    badges: [
      { name: 'Medical Expert', description: 'Completed 50 medical tasks', earnedDate: '2023-06-01' },
      { name: 'Life Saver', description: 'Saved 5 lives', earnedDate: '2023-09-20' },
      { name: 'Mentor', description: 'Trained 10 volunteers', earnedDate: '2024-01-01' },
      { name: 'Top Contributor', description: 'In top 1% of volunteers', earnedDate: '2024-01-10' },
    ],
    joinedDate: '2022-11-10',
    location: 'Gurgaon, India',
    ngoAssociations: ['Mercy Corps', 'WHO India'],
    taskHistory: [
      { id: 't11', title: 'Emergency Surgery Camp', status: 'completed', date: '2024-01-12', rating: 5 },
      { id: 't12', title: 'Health Camp - West Delhi', status: 'completed', date: '2024-01-08', rating: 5 },
      { id: 't13', title: 'Medical Training Workshop', status: 'in-progress', date: '2024-01-15' },
    ],
    monthlyStats: [
      { month: 'Oct', tasks: 14, hours: 56 },
      { month: 'Nov', tasks: 16, hours: 64 },
      { month: 'Dec', tasks: 18, hours: 72 },
      { month: 'Jan', tasks: 12, hours: 48 },
    ],
  },
  v4: {
    id: 'v4',
    name: 'Sneha Gupta',
    email: 'sneha.gupta@example.com',
    phone: '+91 95432 10987',
    skills: ['Training', 'Communication', 'Social Media'],
    availability: 'available',
    rating: 4.7,
    reliabilityScore: 92,
    completedTasks: 45,
    points: 2100,
    badges: [
      { name: 'Trainer', description: 'Trained 20 volunteers', earnedDate: '2023-10-15' },
      { name: 'Communicator', description: 'Great communication skills', earnedDate: '2023-11-20' },
    ],
    joinedDate: '2023-07-01',
    location: 'Delhi, India',
    ngoAssociations: ['Teach for India'],
    taskHistory: [
      { id: 't14', title: 'Volunteer Orientation Session', status: 'completed', date: '2024-01-10', rating: 4 },
      { id: 't15', title: 'Social Media Campaign', status: 'completed', date: '2024-01-05', rating: 4 },
    ],
    monthlyStats: [
      { month: 'Oct', tasks: 4, hours: 16 },
      { month: 'Nov', tasks: 5, hours: 20 },
      { month: 'Dec', tasks: 6, hours: 24 },
      { month: 'Jan', tasks: 5, hours: 20 },
    ],
  },
  v5: {
    id: 'v5',
    name: 'Vikram Sharma',
    email: 'vikram.sharma@example.com',
    phone: '+91 94321 09876',
    skills: ['Survey', 'Documentation', 'Data Analysis'],
    availability: 'offline',
    rating: 4.5,
    reliabilityScore: 88,
    completedTasks: 38,
    points: 1850,
    badges: [
      { name: 'Data Wizard', description: 'Expert in data analysis', earnedDate: '2023-09-10' },
      { name: 'Surveyor', description: 'Completed 20 surveys', earnedDate: '2023-10-25' },
    ],
    joinedDate: '2023-08-15',
    location: 'Faridabad, India',
    ngoAssociations: ['CARE India'],
    taskHistory: [
      { id: 't16', title: 'Damage Assessment Survey', status: 'completed', date: '2024-01-08', rating: 4 },
      { id: 't17', title: 'Data Analysis Report', status: 'completed', date: '2024-01-03', rating: 4 },
    ],
    monthlyStats: [
      { month: 'Oct', tasks: 3, hours: 12 },
      { month: 'Nov', tasks: 4, hours: 16 },
      { month: 'Dec', tasks: 5, hours: 20 },
      { month: 'Jan', tasks: 3, hours: 12 },
    ],
  },
  v6: {
    id: 'v6',
    name: 'Anita Rao',
    email: 'anita.rao@example.com',
    phone: '+91 93210 98765',
    skills: ['Shelter Management', 'Food Distribution'],
    availability: 'available',
    rating: 4.6,
    reliabilityScore: 90,
    completedTasks: 55,
    points: 2750,
    badges: [
      { name: 'Shelter Expert', description: 'Managed 15 shelters', earnedDate: '2023-08-20' },
      { name: 'Food Angel', description: 'Distributed food to 1000+ people', earnedDate: '2023-11-10' },
    ],
    joinedDate: '2023-04-22',
    location: 'Ghaziabad, India',
    ngoAssociations: ['Akshaya Patra', 'NDRF'],
    taskHistory: [
      { id: 't18', title: 'Emergency Shelter Setup', status: 'completed', date: '2024-01-12', rating: 5 },
      { id: 't19', title: 'Food Distribution Drive', status: 'completed', date: '2024-01-08', rating: 5 },
    ],
    monthlyStats: [
      { month: 'Oct', tasks: 5, hours: 20 },
      { month: 'Nov', tasks: 7, hours: 28 },
      { month: 'Dec', tasks: 8, hours: 32 },
      { month: 'Jan', tasks: 6, hours: 24 },
    ],
  },
  v7: {
    id: 'v7',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '+91 92109 87654',
    skills: ['Construction', 'Infrastructure', 'Heavy Machinery'],
    availability: 'available',
    rating: 4.4,
    reliabilityScore: 85,
    completedTasks: 32,
    points: 1600,
    badges: [
      { name: 'Builder', description: 'Completed 15 construction projects', earnedDate: '2023-10-01' },
      { name: 'Infrastructure Pro', description: 'Expert in infrastructure', earnedDate: '2023-11-15' },
    ],
    joinedDate: '2023-09-01',
    location: 'Delhi, India',
    ngoAssociations: ['Habitat for Humanity'],
    taskHistory: [
      { id: 't20', title: 'Shelter Construction', status: 'completed', date: '2024-01-10', rating: 4 },
      { id: 't21', title: 'Infrastructure Repair', status: 'completed', date: '2024-01-05', rating: 4 },
    ],
    monthlyStats: [
      { month: 'Oct', tasks: 3, hours: 12 },
      { month: 'Nov', tasks: 4, hours: 16 },
      { month: 'Dec', tasks: 5, hours: 20 },
      { month: 'Jan', tasks: 3, hours: 12 },
    ],
  },
  v8: {
    id: 'v8',
    name: 'Meera Joshi',
    email: 'meera.joshi@example.com',
    phone: '+91 91098 76543',
    skills: ['Counseling', 'Mental Health', 'Child Care'],
    availability: 'busy',
    rating: 4.8,
    reliabilityScore: 94,
    completedTasks: 68,
    points: 3400,
    badges: [
      { name: 'Mental Health Advocate', description: 'Counseled 50+ individuals', earnedDate: '2023-07-20' },
      { name: 'Child Protector', description: 'Protected 20+ children', earnedDate: '2023-09-10' },
      { name: 'Counselor', description: 'Expert counselor', earnedDate: '2023-10-01' },
    ],
    joinedDate: '2023-02-10',
    location: 'Noida, India',
    ngoAssociations: ['Childline', 'iCall'],
    taskHistory: [
      { id: 't22', title: 'Mental Health Awareness Session', status: 'completed', date: '2024-01-10', rating: 5 },
      { id: 't23', title: 'Child Protection Workshop', status: 'completed', date: '2024-01-05', rating: 5 },
      { id: 't24', title: 'Counseling Session', status: 'in-progress', date: '2024-01-15' },
    ],
    monthlyStats: [
      { month: 'Oct', tasks: 7, hours: 28 },
      { month: 'Nov', tasks: 8, hours: 32 },
      { month: 'Dec', tasks: 9, hours: 36 },
      { month: 'Jan', tasks: 7, hours: 28 },
    ],
  },
}



const availabilityConfig = {
  available: { label: 'Available', className: 'bg-green-500' },
  busy: { label: 'Busy', className: 'bg-yellow-500' },
  offline: { label: 'Offline', className: 'bg-gray-400' },
}

const statusConfig = {
  completed: { label: 'Completed', className: 'bg-green-500/10 text-green-600 border-green-500/20' },
  'in-progress': { label: 'In Progress', className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-500/10 text-gray-600 border-gray-500/20' },
}

export default function VolunteerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [assignTaskOpen, setAssignTaskOpen] = useState(false)
  const { getVolunteerById } = useVolunteers()
  
  // Fetch volunteer data based on id from URL
  // First check context for newly added volunteers, then fallback to enhanced profiles
  let baseVolunteer = getVolunteerById(id)
  let volunteer: Volunteer
  
  if (baseVolunteer) {
    // Create enhanced profile from context volunteer
    volunteer = createDefaultProfileFromBase(baseVolunteer)
  } else if (ENHANCED_VOLUNTEER_PROFILES[id]) {
    // Use pre-built enhanced profile for original volunteers
    volunteer = ENHANCED_VOLUNTEER_PROFILES[id]
  } else {
    // Fallback to first volunteer
    volunteer = ENHANCED_VOLUNTEER_PROFILES['v1']
  }
  
  // Use volunteer's actual availability from context
  const availability = availabilityConfig[volunteer.availability]

  const handleAssignTask = (volunteerId: string, taskId: string) => {
    // In a real app, this would make an API call to assign the task
    console.log(`[v0] Assigned task ${taskId} to volunteer ${volunteerId}`)
    setAssignTaskOpen(false)
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Back Button */}
          <Link href="/volunteers">
            <Button variant="ghost" className="gap-2 mb-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Volunteers
            </Button>
          </Link>

          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                    <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                      {volunteer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span 
                    className={cn(
                      'absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-background',
                      availability.className
                    )}
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">{volunteer.name}</h1>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {volunteer.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined {new Date(volunteer.joinedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <Badge className={cn('gap-1', availability.className === 'bg-green-500' ? 'bg-green-500' : '')}>
                          <span className={cn('w-2 h-2 rounded-full', availability.className)} />
                          {availability.label}
                        </Badge>
                        {volunteer.ngoAssociations.map(ngo => (
                          <Badge key={ngo} variant="outline" className="gap-1">
                            <Building2 className="h-3 w-3" />
                            {ngo}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                      <Button size="sm" onClick={() => setAssignTaskOpen(true)}>
                        Assign Task
                      </Button>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-xl font-bold text-foreground">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        {volunteer.rating}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Rating</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-xl font-bold text-foreground">
                        <TrendingUp className="h-5 w-5 text-secondary" />
                        {volunteer.reliabilityScore}%
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Reliability</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-xl font-bold text-foreground">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        {volunteer.completedTasks}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Tasks Done</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-xl font-bold text-foreground">
                        <Flame className="h-5 w-5 text-accent" />
                        {volunteer.points.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Points</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">Task History</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {volunteer.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{volunteer.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{volunteer.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{volunteer.location}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Analytics */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Performance Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {volunteer.monthlyStats.length === 0 ? (
                      <div className="text-center py-8">
                        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-muted-foreground">No performance analytics yet</p>
                      </div>
                    ) : (
                      <div className="grid gap-6 sm:grid-cols-2">
                        {/* Monthly Tasks Chart (simplified) */}
                        <div>
                          <p className="text-sm font-medium mb-4">Monthly Tasks</p>
                          <div className="space-y-3">
                            {volunteer.monthlyStats.map(stat => (
                              <div key={stat.month} className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground w-10">{stat.month}</span>
                                <div className="flex-1">
                                  <Progress value={(stat.tasks / 15) * 100} className="h-2" />
                                </div>
                                <span className="text-sm font-medium w-8">{stat.tasks}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Monthly Hours */}
                        <div>
                          <p className="text-sm font-medium mb-4">Hours Contributed</p>
                          <div className="space-y-3">
                            {volunteer.monthlyStats.map(stat => (
                              <div key={stat.month} className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground w-10">{stat.month}</span>
                                <div className="flex-1">
                                  <Progress value={(stat.hours / 60) * 100} className="h-2" />
                                </div>
                                <span className="text-sm font-medium w-10">{stat.hours}h</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Task History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {volunteer.taskHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">No task history yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {volunteer.taskHistory.map(task => {
                        const status = statusConfig[task.status]
                        return (
                          <div 
                            key={task.id}
                            className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">{task.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(task.date).toLocaleDateString('en-IN', { 
                                  day: 'numeric', 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              {task.rating && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  {task.rating}
                                </div>
                              )}
                              <Badge variant="outline" className={status.className}>
                                {status.label}
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="badges" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Earned Badges ({volunteer.badges.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {volunteer.badges.length === 0 ? (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">No badges earned yet</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {volunteer.badges.map(badge => (
                        <div 
                          key={badge.name}
                          className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30"
                        >
                          <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                            <Award className="h-6 w-6 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{badge.name}</p>
                            <p className="text-sm text-muted-foreground">{badge.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Earned {new Date(badge.earnedDate).toLocaleDateString('en-IN', { 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Assign Task Modal */}
      <AssignTaskModal
        open={assignTaskOpen}
        onOpenChange={setAssignTaskOpen}
        volunteer={{
          id: volunteer.id,
          name: volunteer.name,
          skills: volunteer.skills,
          availability: volunteer.availability,
        }}
        tasks={MOCK_TASKS}
        allTasks={MOCK_TASKS}
        onAssign={handleAssignTask}
        realTasksFromManagement={MOCK_TASKS}
      />
    </AppLayout>
  )
}
