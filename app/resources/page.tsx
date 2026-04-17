'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { ResourceCard, Resource } from '@/components/resources/resource-card'
import { ResourceTable } from '@/components/resources/resource-table'
import { ResourceAlerts } from '@/components/resources/resource-alerts'
import { ResourceFlowTracker } from '@/components/resources/resource-flow-tracker'
import { AddResourceDialog } from '@/components/resources/add-resource-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Filter,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle,
  LayoutGrid,
  List,
} from 'lucide-react'

// Mock Data
const MOCK_RESOURCES: Resource[] = [
  {
    id: 'r1',
    name: 'Emergency Food Packets',
    category: 'Food',
    quantity: 2500,
    allocatedQuantity: 800,
    location: 'Warehouse A, Delhi',
    expiryDate: '2026-06-15',
    status: 'in-stock',
    unit: 'packets',
  },
  {
    id: 'r2',
    name: 'Drinking Water Bottles',
    category: 'Water',
    quantity: 150,
    allocatedQuantity: 100,
    location: 'Warehouse B, Noida',
    expiryDate: '2026-12-30',
    status: 'low-stock',
    unit: 'cases',
  },
  {
    id: 'r3',
    name: 'First Aid Kits',
    category: 'Medical',
    quantity: 450,
    allocatedQuantity: 150,
    location: 'Medical Storage, Gurgaon',
    expiryDate: '2027-03-20',
    status: 'in-stock',
    unit: 'kits',
  },
  {
    id: 'r4',
    name: 'Medicines - Paracetamol',
    category: 'Medical',
    quantity: 1000,
    allocatedQuantity: 200,
    location: 'Medical Storage, Gurgaon',
    expiryDate: '2026-05-10',
    status: 'expiring-soon',
    unit: 'strips',
  },
  {
    id: 'r5',
    name: 'Tents (4-person)',
    category: 'Shelter',
    quantity: 200,
    allocatedQuantity: 180,
    location: 'Warehouse C, Faridabad',
    expiryDate: '2030-12-31',
    status: 'in-stock',
    unit: 'units',
  },
  {
    id: 'r6',
    name: 'Blankets',
    category: 'Shelter',
    quantity: 80,
    allocatedQuantity: 50,
    location: 'Warehouse A, Delhi',
    expiryDate: '2028-06-30',
    status: 'low-stock',
    unit: 'pieces',
  },
  {
    id: 'r7',
    name: 'Sanitary Kits',
    category: 'Hygiene',
    quantity: 600,
    allocatedQuantity: 200,
    location: 'Warehouse B, Noida',
    expiryDate: '2026-05-05',
    status: 'expiring-soon',
    unit: 'kits',
  },
  {
    id: 'r8',
    name: 'Baby Formula',
    category: 'Food',
    quantity: 300,
    allocatedQuantity: 100,
    location: 'Warehouse A, Delhi',
    expiryDate: '2026-08-15',
    status: 'in-stock',
    unit: 'cans',
  },
  {
    id: 'r9',
    name: 'Portable Water Filters',
    category: 'Water',
    quantity: 0,
    allocatedQuantity: 0,
    location: 'Warehouse C, Faridabad',
    expiryDate: '2027-01-01',
    status: 'out-of-stock',
    unit: 'units',
  },
  {
    id: 'r10',
    name: 'Solar Lanterns',
    category: 'Equipment',
    quantity: 350,
    allocatedQuantity: 100,
    location: 'Warehouse B, Noida',
    expiryDate: '2029-12-31',
    status: 'in-stock',
    unit: 'units',
  },
]

const CATEGORIES = ['All', 'Food', 'Water', 'Medical', 'Shelter', 'Hygiene', 'Equipment']

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES)

  const handleAddResource = (newResource: Resource) => {
    setResources([newResource, ...resources])
  }

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calculate stats based on current resources state
  const totalResources = resources.reduce((acc, r) => acc + r.quantity, 0)
  const lowStockCount = resources.filter((r) => r.status === 'low-stock').length
  const expiringCount = resources.filter((r) => r.status === 'expiring-soon').length
  const allocatedCount = resources.reduce((acc, r) => acc + r.allocatedQuantity, 0)
  const availableCount = totalResources - allocatedCount

  // Resource flow tracker data (updates based on resources)
  const resourceFlow = [
    { id: '1', label: 'Storage', count: totalResources, icon: 'storage' as const, status: 'completed' as const },
    { id: '2', label: 'Assigned', count: allocatedCount, icon: 'assigned' as const, status: 'in-progress' as const },
    { id: '3', label: 'Delivered', count: Math.floor(allocatedCount * 0.66), icon: 'delivered' as const, status: 'pending' as const },
  ]

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground text-pretty flex items-center gap-2">
                <Package className="h-8 w-8 text-primary" />
                Resources
              </h1>
              <p className="text-muted-foreground mt-1">
                Inventory and logistics management for relief supplies
              </p>
            </div>
            <div className="flex items-center gap-3">
              <AddResourceDialog 
                onAddResource={handleAddResource}
                categories={CATEGORIES}
              />
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  <List className="h-4 w-4 mr-1" />
                  Table
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                >
                  <LayoutGrid className="h-4 w-4 mr-1" />
                  Cards
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Resources
                </CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {totalResources.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {MOCK_RESOURCES.length} items
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Low Stock Items
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {lowStockCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Need restocking
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Expiring Soon
                </CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {expiringCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Within 30 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Allocated vs Available
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {allocatedCount.toLocaleString()}
                  <span className="text-muted-foreground text-base font-normal ml-1">
                    / {availableCount.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Allocated / Available
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Alerts Section */}
          <ResourceAlerts resources={resources} />

          {/* Resources List/Grid */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Resources List/Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Resource Inventory
              </h2>
              <Badge variant="secondary">
                {filteredResources.length} items
              </Badge>
            </div>

            {viewMode === 'table' ? (
              <ResourceTable resources={filteredResources} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            )}

            {filteredResources.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No resources found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
