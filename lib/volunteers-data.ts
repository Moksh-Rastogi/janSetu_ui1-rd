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
  distance?: string
  aiRecommended?: boolean
}

// Initial volunteers data
const initialVolunteers: Volunteer[] = [
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
    distance: '2.5 km',
    aiRecommended: true,
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
    distance: '3.1 km',
    aiRecommended: true,
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
    distance: '4.2 km',
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
    distance: '1.8 km',
    aiRecommended: true,
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
    distance: '6.5 km',
  },
  {
    id: 'v6',
    name: 'Anita Rao',
    skills: ['Shelter Management', 'Food Distribution', 'Relief'],
    availability: 'available',
    rating: 4.6,
    reliabilityScore: 90,
    completedTasks: 55,
    points: 2750,
    badges: ['Shelter Expert', 'Food Angel'],
    joinedDate: '2023-04-22',
    location: 'Ghaziabad',
    ngoAssociations: ['Akshaya Patra', 'NDRF'],
    distance: '5.0 km',
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
    distance: '3.5 km',
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
    distance: '4.8 km',
  },
]

// Store volunteers in a module-level variable that can be updated
let volunteersData: Volunteer[] = [...initialVolunteers]

// Get all volunteers
export function getVolunteers(): Volunteer[] {
  return volunteersData
}

// Add a new volunteer
export function addVolunteer(volunteer: Omit<Volunteer, 'id'>): Volunteer {
  const newVolunteer: Volunteer = {
    ...volunteer,
    id: `v-${Date.now()}`,
  }
  volunteersData = [newVolunteer, ...volunteersData]
  return newVolunteer
}

// Update a volunteer
export function updateVolunteer(id: string, updates: Partial<Volunteer>): Volunteer | null {
  const index = volunteersData.findIndex(v => v.id === id)
  if (index === -1) return null
  
  volunteersData[index] = { ...volunteersData[index], ...updates }
  return volunteersData[index]
}

// Delete a volunteer
export function deleteVolunteer(id: string): boolean {
  const initialLength = volunteersData.length
  volunteersData = volunteersData.filter(v => v.id !== id)
  return volunteersData.length < initialLength
}

// Reset to initial data (useful for testing)
export function resetVolunteers(): void {
  volunteersData = [...initialVolunteers]
}
