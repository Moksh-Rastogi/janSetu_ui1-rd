'use client'

import { Users, Package, CheckCircle, TrendingUp, MapPin, Calendar, Award, Heart, Target, Sparkles, Download } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, Legend } from 'recharts'
import { cn } from '@/lib/utils'

interface ImpactReportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  totalDonated: number
  totalImpact: number
  donations: Array<{
    id: string
    campaignName: string
    amount: number
    date: string
    status: 'completed' | 'pending' | 'failed'
    impact?: string
  }>
}

// Mock data for charts
const monthlyImpactData = [
  { month: 'Oct', donations: 2500, impact: 5 },
  { month: 'Nov', donations: 3200, impact: 8 },
  { month: 'Dec', donations: 4100, impact: 12 },
  { month: 'Jan', donations: 3800, impact: 10 },
  { month: 'Feb', donations: 4500, impact: 14 },
  { month: 'Mar', donations: 5200, impact: 18 },
]

const impactByCategory = [
  { name: 'Emergency Relief', value: 35, color: '#FF6B6B' },
  { name: 'Education', value: 25, color: '#4ECDC4' },
  { name: 'Healthcare', value: 20, color: '#FFE66D' },
  { name: 'Infrastructure', value: 12, color: '#95E1D3' },
  { name: 'Empowerment', value: 8, color: '#AA96DA' },
]

const regionalImpact = [
  { region: 'North', families: 120, resources: 450 },
  { region: 'South', families: 95, resources: 380 },
  { region: 'East', families: 85, resources: 320 },
  { region: 'West', families: 110, resources: 420 },
  { region: 'Central', families: 75, resources: 280 },
]

const milestones = [
  { id: 1, title: 'First Donation', description: 'Made your first contribution', date: 'Oct 2023', achieved: true },
  { id: 2, title: 'Helped 5 Families', description: 'Your donations supported 5 families', date: 'Nov 2023', achieved: true },
  { id: 3, title: 'Education Champion', description: 'Contributed to 3 education campaigns', date: 'Jan 2024', achieved: true },
  { id: 4, title: 'Regular Donor', description: 'Set up recurring donations', date: 'Feb 2024', achieved: true },
  { id: 5, title: 'Community Hero', description: 'Help 25 families', date: 'Target', achieved: false, progress: 60 },
]

const impactStories = [
  {
    id: 1,
    title: 'Ramesh\'s Family Rebuilds',
    location: 'District X',
    story: 'After floods destroyed their home, your donation helped Ramesh\'s family rebuild and restart their small business.',
    category: 'Emergency Relief',
    date: 'Mar 2024',
  },
  {
    id: 2,
    title: 'Priya Goes to School',
    location: 'Village Y',
    story: 'Your contribution provided school supplies and uniforms for 12-year-old Priya, enabling her to continue her education.',
    category: 'Education',
    date: 'Feb 2024',
  },
  {
    id: 3,
    title: 'Mobile Clinic Success',
    location: 'Rural Zone Z',
    story: 'The mobile health clinic you supported provided medical checkups to 150+ villagers who had no prior healthcare access.',
    category: 'Healthcare',
    date: 'Jan 2024',
  },
]

export function ImpactReport({ open, onOpenChange, totalDonated, totalImpact, donations }: ImpactReportProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`
    }
    return `₹${amount}`
  }

  const completedDonations = donations.filter(d => d.status === 'completed')
  const totalAmount = completedDonations.reduce((sum, d) => sum + d.amount, 0)

  const handleDownloadReport = () => {
    const reportDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // Calculate totals for resources
    const totalFamiliesHelped = regionalImpact.reduce((sum, r) => sum + r.families, 0)
    const totalResourcesDelivered = regionalImpact.reduce((sum, r) => sum + r.resources, 0)

    // Build report content
    const reportContent = `
================================================================================
                         JANSETU IMPACT REPORT
================================================================================
Generated on: ${reportDate}
Report Period: October 2023 - March 2024

================================================================================
                              SUMMARY
================================================================================

Total Amount Donated:        ${formatCurrency(totalAmount)}
Total People Helped:         ${totalImpact}
Campaigns Supported:         ${completedDonations.length}
Milestones Achieved:         ${milestones.filter(m => m.achieved).length}

================================================================================
                         DONATION HISTORY
================================================================================

${completedDonations.map((d, i) => `
${i + 1}. ${d.campaignName}
   Amount: ₹${d.amount.toLocaleString('en-IN')}
   Date: ${d.date}
   Status: ${d.status.charAt(0).toUpperCase() + d.status.slice(1)}
   ${d.impact ? `Impact: ${d.impact}` : ''}
`).join('\n')}

================================================================================
                       IMPACT BY CATEGORY
================================================================================

${impactByCategory.map(cat => `${cat.name.padEnd(20)} ${cat.value}%`).join('\n')}

================================================================================
                       REGIONAL IMPACT
================================================================================

Region          Families Helped    Resources Delivered
------          ---------------    -------------------
${regionalImpact.map(r => `${r.region.padEnd(16)}${r.families.toString().padEnd(19)}${r.resources}`).join('\n')}
------          ---------------    -------------------
TOTAL           ${totalFamiliesHelped.toString().padEnd(19)}${totalResourcesDelivered}

================================================================================
                      RESOURCES DELIVERED
================================================================================

Food Packages:           245
Medical Kits:            89
School Supplies:         156
Shelter Materials:       42

================================================================================
                       BENEFICIARIES
================================================================================

Children:                89
Women:                   67
Elderly:                 34
Families:                45

================================================================================
                   MILESTONES ACHIEVED
================================================================================

${milestones.filter(m => m.achieved).map((m, i) => `
${i + 1}. ${m.title}
   ${m.description}
   Achieved: ${m.date}
`).join('\n')}

================================================================================
                       IMPACT STORIES
================================================================================

${impactStories.map((s, i) => `
${i + 1}. ${s.title}
   Location: ${s.location}
   Category: ${s.category}
   Date: ${s.date}
   
   "${s.story}"
`).join('\n')}

================================================================================
                    MONTHLY DONATION TREND
================================================================================

Month       Donations (₹)     People Helped
-----       -------------     -------------
${monthlyImpactData.map(m => `${m.month.padEnd(12)}₹${m.donations.toString().padEnd(14)}${m.impact}`).join('\n')}

================================================================================

Thank you for your generous contributions! Your support has made a real 
difference in the lives of many people across communities.

For questions or feedback, contact us at support@jansetu.org

================================================================================
                    Generated by JanSetu Platform
================================================================================
`

    // Create blob and download
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `JanSetu_Impact_Report_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            Your Full Impact Report
          </DialogTitle>
          <DialogDescription>
            A comprehensive view of how your donations have made a difference
          </DialogDescription>
        </DialogHeader>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <Heart className="h-5 w-5 text-primary mb-2" />
            <div className="text-2xl font-bold text-foreground">{formatCurrency(totalAmount)}</div>
            <div className="text-xs text-muted-foreground">Total Donated</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
            <Users className="h-5 w-5 text-secondary mb-2" />
            <div className="text-2xl font-bold text-foreground">{totalImpact}</div>
            <div className="text-xs text-muted-foreground">People Helped</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
            <Package className="h-5 w-5 text-accent mb-2" />
            <div className="text-2xl font-bold text-foreground">{completedDonations.length}</div>
            <div className="text-xs text-muted-foreground">Campaigns Supported</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
            <Target className="h-5 w-5 text-green-600 mb-2" />
            <div className="text-2xl font-bold text-foreground">4</div>
            <div className="text-xs text-muted-foreground">Milestones Achieved</div>
          </div>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4 space-y-6">
            {/* Monthly Trend Chart */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Your Donation Trend
              </h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyImpactData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line type="monotone" dataKey="donations" stroke="#4ECDC4" strokeWidth={2} dot={{ fill: '#4ECDC4' }} name="Donations (₹)" />
                    <Line type="monotone" dataKey="impact" stroke="#FF6B6B" strokeWidth={2} dot={{ fill: '#FF6B6B' }} name="People Helped" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Impact by Category
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="h-[180px] w-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={impactByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {impactByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {impactByCategory.map((cat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-sm text-foreground">{cat.name}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact" className="mt-4 space-y-6">
            {/* Regional Impact */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Regional Impact Distribution
              </h3>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalImpact} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis dataKey="region" type="category" tick={{ fill: 'hsl(var(--muted-foreground))' }} width={60} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="families" fill="#4ECDC4" name="Families Helped" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="resources" fill="#FFE66D" name="Resources Delivered" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Impact Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Package className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="font-medium text-foreground">Resources Delivered</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Food Packages</span>
                    <span className="font-medium text-foreground">245</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Medical Kits</span>
                    <span className="font-medium text-foreground">89</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">School Supplies</span>
                    <span className="font-medium text-foreground">156</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shelter Materials</span>
                    <span className="font-medium text-foreground">42</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Users className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="font-medium text-foreground">Beneficiaries</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Children</span>
                    <span className="font-medium text-foreground">89</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Women</span>
                    <span className="font-medium text-foreground">67</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Elderly</span>
                    <span className="font-medium text-foreground">34</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Families</span>
                    <span className="font-medium text-foreground">45</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="mt-4">
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={cn(
                    'p-4 rounded-xl border transition-colors',
                    milestone.achieved
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-border bg-card'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'p-2 rounded-full',
                        milestone.achieved
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">{milestone.title}</h4>
                        {milestone.achieved ? (
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            Achieved
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            In Progress
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{milestone.date}</span>
                      </div>
                      {!milestone.achieved && milestone.progress && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{milestone.progress}%</span>
                          </div>
                          <Progress value={milestone.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Stories Tab */}
          <TabsContent value="stories" className="mt-4">
            <div className="space-y-4">
              {impactStories.map((story) => (
                <div key={story.id} className="p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{story.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {story.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{story.story}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {story.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {story.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={handleDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Close Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
