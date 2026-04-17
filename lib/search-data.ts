// Centralized search data for the application

export interface SearchItem {
  id: string
  type: 'campaign' | 'task' | 'ngo' | 'volunteer'
  title: string
  description: string
  location?: string
  status?: string
  category?: string
}

// Campaigns data (from crisis-map)
export const CAMPAIGNS: SearchItem[] = [
  {
    id: 'c1',
    type: 'campaign',
    title: 'Flood Relief Camp - North Delhi',
    description: 'Emergency flood relief operations for affected families',
    location: 'North Delhi',
    status: 'active',
    category: 'disaster',
  },
  {
    id: 'c2',
    type: 'campaign',
    title: 'Medical Emergency - South Delhi',
    description: 'Medical aid and healthcare services for communities',
    location: 'South Delhi',
    status: 'active',
    category: 'health',
  },
  {
    id: 'c3',
    type: 'campaign',
    title: 'Food Distribution - Central Mumbai',
    description: 'Food distribution drive for underprivileged families',
    location: 'Central Mumbai',
    status: 'active',
    category: 'food',
  },
  {
    id: 'c4',
    type: 'campaign',
    title: 'School Reconstruction - Navi Mumbai',
    description: 'Rebuilding schools damaged by natural disasters',
    location: 'Navi Mumbai',
    status: 'active',
    category: 'education',
  },
  {
    id: 'c5',
    type: 'campaign',
    title: 'Cyclone Response - North Chennai',
    description: 'Emergency response and relief for cyclone affected areas',
    location: 'North Chennai',
    status: 'active',
    category: 'disaster',
  },
  {
    id: 'c6',
    type: 'campaign',
    title: 'Malnutrition Camp - South Bangalore',
    description: 'Nutritional support for malnourished children',
    location: 'South Bangalore',
    status: 'active',
    category: 'health',
  },
  {
    id: 'c7',
    type: 'campaign',
    title: 'Community Kitchen - Central Kolkata',
    description: 'Free meals for homeless and daily wage workers',
    location: 'Central Kolkata',
    status: 'active',
    category: 'food',
  },
  {
    id: 'c8',
    type: 'campaign',
    title: 'Digital Literacy Program - Salt Lake',
    description: 'Computer education for underprivileged youth',
    location: 'Salt Lake, Kolkata',
    status: 'active',
    category: 'education',
  },
  {
    id: 'c9',
    type: 'campaign',
    title: 'Air Quality Emergency - Sector 62 Noida',
    description: 'Health support during air pollution emergency',
    location: 'Sector 62, Noida',
    status: 'active',
    category: 'health',
  },
  {
    id: 'c10',
    type: 'campaign',
    title: 'Waterlogging Relief - Sector 76 Noida',
    description: 'Relief operations for waterlogged areas',
    location: 'Sector 76, Noida',
    status: 'active',
    category: 'disaster',
  },
]

// Tasks data
export const TASKS: SearchItem[] = [
  {
    id: 't1',
    type: 'task',
    title: 'Distribute Relief Supplies',
    description: 'Distribute food and water packets to affected families in Sector 12',
    location: 'Sector 12, Delhi',
    status: 'todo',
    category: 'Relief',
  },
  {
    id: 't2',
    type: 'task',
    title: 'Medical Camp Setup',
    description: 'Set up medical camp for health checkups and first aid',
    location: 'Community Hall, Noida',
    status: 'todo',
    category: 'Medical',
  },
  {
    id: 't3',
    type: 'task',
    title: 'Volunteer Training Session',
    description: 'Conduct training for new volunteers on emergency protocols',
    location: 'NGO Office, Gurgaon',
    status: 'in-progress',
    category: 'Training',
  },
  {
    id: 't4',
    type: 'task',
    title: 'Damage Assessment Survey',
    description: 'Survey flood-affected areas and document damage for relief planning',
    location: 'Multiple Districts',
    status: 'in-progress',
    category: 'Survey',
  },
  {
    id: 't5',
    type: 'task',
    title: 'Shelter Setup Complete',
    description: 'Emergency shelter setup for displaced families',
    location: 'Stadium Ground, Delhi',
    status: 'completed',
    category: 'Shelter',
  },
  {
    id: 't6',
    type: 'task',
    title: 'Food Distribution Drive',
    description: 'Completed food distribution to 500 families',
    location: 'Block A, Faridabad',
    status: 'completed',
    category: 'Relief',
  },
  {
    id: 't7',
    type: 'task',
    title: 'Water Purification Setup',
    description: 'Install water purification units at relief camps',
    location: 'Relief Camp 3, Ghaziabad',
    status: 'todo',
    category: 'Infrastructure',
  },
]

// NGOs data
export const NGOS: SearchItem[] = [
  {
    id: 'n1',
    type: 'ngo',
    title: 'Red Cross India',
    description: 'Humanitarian organization providing emergency assistance and disaster relief',
    location: 'Pan India',
    category: 'disaster',
  },
  {
    id: 'n2',
    type: 'ngo',
    title: 'Doctors Without Borders',
    description: 'International medical humanitarian organization',
    location: 'Pan India',
    category: 'health',
  },
  {
    id: 'n3',
    type: 'ngo',
    title: 'Akshaya Patra Foundation',
    description: 'Mid-day meal program and food distribution',
    location: 'Mumbai',
    category: 'food',
  },
  {
    id: 'n4',
    type: 'ngo',
    title: 'Teach For India',
    description: 'Education-focused NGO working in underserved communities',
    location: 'Mumbai',
    category: 'education',
  },
  {
    id: 'n5',
    type: 'ngo',
    title: 'UNICEF India',
    description: 'Child rights and humanitarian aid organization',
    location: 'Pan India',
    category: 'disaster',
  },
  {
    id: 'n6',
    type: 'ngo',
    title: 'Care India',
    description: 'Health and nutrition support for women and children',
    location: 'Bangalore',
    category: 'health',
  },
  {
    id: 'n7',
    type: 'ngo',
    title: 'Feeding India',
    description: 'Zero hunger initiative and food rescue',
    location: 'Kolkata',
    category: 'food',
  },
  {
    id: 'n8',
    type: 'ngo',
    title: 'Pratham Education',
    description: 'Largest education NGO in India',
    location: 'Pan India',
    category: 'education',
  },
  {
    id: 'n9',
    type: 'ngo',
    title: 'Goonj Foundation',
    description: 'Disaster relief and rural development',
    location: 'Delhi NCR',
    category: 'disaster',
  },
  {
    id: 'n10',
    type: 'ngo',
    title: 'Robin Hood Army',
    description: 'Volunteer-based zero hunger movement',
    location: 'Noida',
    category: 'food',
  },
  {
    id: 'n11',
    type: 'ngo',
    title: 'Clean Air India',
    description: 'Air quality and environmental health advocacy',
    location: 'Delhi NCR',
    category: 'health',
  },
  {
    id: 'n12',
    type: 'ngo',
    title: 'NIIT Foundation',
    description: 'Digital literacy and skill development',
    location: 'Greater Noida',
    category: 'education',
  },
  {
    id: 'n13',
    type: 'ngo',
    title: 'Mercy Corps',
    description: 'Global humanitarian aid organization',
    location: 'Gurgaon',
    category: 'health',
  },
  {
    id: 'n14',
    type: 'ngo',
    title: 'CRY - Child Rights and You',
    description: 'Child rights and education advocacy',
    location: 'Noida',
    category: 'education',
  },
  {
    id: 'n15',
    type: 'ngo',
    title: 'Habitat for Humanity',
    description: 'Affordable housing and shelter solutions',
    location: 'Delhi',
    category: 'disaster',
  },
]

// Volunteers data
export const VOLUNTEERS: SearchItem[] = [
  {
    id: 'v1',
    type: 'volunteer',
    title: 'Raj Patel',
    description: 'Medical, First Aid, Emergency Response',
    location: 'Delhi',
    status: 'available',
  },
  {
    id: 'v2',
    type: 'volunteer',
    title: 'Priya Singh',
    description: 'Relief Distribution, Logistics, Coordination',
    location: 'Noida',
    status: 'available',
  },
  {
    id: 'v3',
    type: 'volunteer',
    title: 'Dr. Amit Kumar',
    description: 'Medical, Surgery, Health Camps',
    location: 'Gurgaon',
    status: 'busy',
  },
  {
    id: 'v4',
    type: 'volunteer',
    title: 'Sneha Gupta',
    description: 'Training, Communication, Social Media',
    location: 'Delhi',
    status: 'available',
  },
  {
    id: 'v5',
    type: 'volunteer',
    title: 'Vikram Sharma',
    description: 'Survey, Documentation, Data Analysis',
    location: 'Faridabad',
    status: 'offline',
  },
  {
    id: 'v6',
    type: 'volunteer',
    title: 'Anita Rao',
    description: 'Shelter Management, Food Distribution',
    location: 'Ghaziabad',
    status: 'available',
  },
  {
    id: 'v7',
    type: 'volunteer',
    title: 'Rahul Verma',
    description: 'Construction, Infrastructure, Heavy Machinery',
    location: 'Delhi',
    status: 'available',
  },
  {
    id: 'v8',
    type: 'volunteer',
    title: 'Meera Joshi',
    description: 'Counseling, Mental Health, Child Care',
    location: 'Noida',
    status: 'busy',
  },
  {
    id: 'v9',
    type: 'volunteer',
    title: 'Karan Singh',
    description: 'Food Distribution, Community Outreach',
    location: 'Faridabad',
    status: 'available',
  },
  {
    id: 'v10',
    type: 'volunteer',
    title: 'Dr. Sunita Rao',
    description: 'Chief Medical Officer, Emergency Medicine',
    location: 'Delhi',
    status: 'busy',
  },
  {
    id: 'v11',
    type: 'volunteer',
    title: 'Kunal Sharma',
    description: 'Kitchen Management, Food Preparation',
    location: 'Noida',
    status: 'available',
  },
  {
    id: 'v12',
    type: 'volunteer',
    title: 'Deepa Nair',
    description: 'Relief Coordination, Logistics',
    location: 'Chennai',
    status: 'available',
  },
]

// Combined search function
export function searchAll(query: string): SearchItem[] {
  if (!query.trim()) return []
  
  const lowerQuery = query.toLowerCase()
  const allItems = [...CAMPAIGNS, ...TASKS, ...NGOS, ...VOLUNTEERS]
  
  return allItems.filter(item => 
    item.title.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery) ||
    (item.location && item.location.toLowerCase().includes(lowerQuery)) ||
    (item.category && item.category.toLowerCase().includes(lowerQuery)) ||
    (item.status && item.status.toLowerCase().includes(lowerQuery))
  )
}

// Get type label
export function getTypeLabel(type: SearchItem['type']): string {
  switch (type) {
    case 'campaign': return 'Campaign'
    case 'task': return 'Task'
    case 'ngo': return 'NGO'
    case 'volunteer': return 'Volunteer'
    default: return type
  }
}

// Get type color
export function getTypeColor(type: SearchItem['type']): string {
  switch (type) {
    case 'campaign': return 'bg-blue-500'
    case 'task': return 'bg-amber-500'
    case 'ngo': return 'bg-green-500'
    case 'volunteer': return 'bg-purple-500'
    default: return 'bg-gray-500'
  }
}
