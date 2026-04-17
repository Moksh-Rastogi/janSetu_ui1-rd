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
  Users,
  Building2,
  Globe,
  Mail,
  Phone,
  Calendar,
  Target,
  Heart,
  Award
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { NGOS } from '@/lib/search-data'

// Extended NGO data with more details
const NGO_DETAILS: Record<string, {
  email: string
  phone: string
  website: string
  foundedYear: number
  totalVolunteers: number
  totalDonors: number
  activeCampaigns: number
  totalRaised: number
  achievements: string[]
  focus: string[]
}> = {
  n1: {
    email: 'contact@redcross.org.in',
    phone: '+91 11 2371 6441',
    website: 'www.indianredcross.org',
    foundedYear: 1920,
    totalVolunteers: 2500,
    totalDonors: 15000,
    activeCampaigns: 12,
    totalRaised: 50000000,
    achievements: ['Nobel Peace Prize', 'Responded to 500+ disasters', 'Trained 100K first responders'],
    focus: ['Disaster Relief', 'Blood Donation', 'First Aid Training'],
  },
  n2: {
    email: 'info@msf.org.in',
    phone: '+91 22 2847 6632',
    website: 'www.msfindia.in',
    foundedYear: 1971,
    totalVolunteers: 1800,
    totalDonors: 12000,
    activeCampaigns: 8,
    totalRaised: 35000000,
    achievements: ['Nobel Peace Prize 1999', 'Operations in 70+ countries', 'Medical aid to millions'],
    focus: ['Emergency Medical Care', 'Epidemic Response', 'Conflict Zones'],
  },
  n3: {
    email: 'info@akshayapatra.org',
    phone: '+91 80 3014 3400',
    website: 'www.akshayapatra.org',
    foundedYear: 2000,
    totalVolunteers: 3000,
    totalDonors: 25000,
    activeCampaigns: 15,
    totalRaised: 80000000,
    achievements: ['Serves 2M+ meals daily', 'Present in 15 states', 'ISO certified kitchens'],
    focus: ['Mid-day Meals', 'Hunger Elimination', 'Child Nutrition'],
  },
  n4: {
    email: 'contact@teachforindia.org',
    phone: '+91 22 6189 8989',
    website: 'www.teachforindia.org',
    foundedYear: 2008,
    totalVolunteers: 1500,
    totalDonors: 8000,
    activeCampaigns: 6,
    totalRaised: 25000000,
    achievements: ['50,000+ students impacted', 'Present in 8 cities', '3000+ alumni network'],
    focus: ['Education', 'Leadership Development', 'Community Building'],
  },
}

const categoryColors: Record<string, string> = {
  disaster: 'bg-red-500/10 text-red-600 border-red-500/20',
  health: 'bg-green-500/10 text-green-600 border-green-500/20',
  food: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  education: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
}

export default function NGODetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  const ngo = NGOS.find(n => n.id === id)
  const details = NGO_DETAILS[id] || NGO_DETAILS['n1']
  
  if (!ngo) {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold">NGO not found</h1>
          <Link href="/network">
            <Button className="mt-4">Back to Network</Button>
          </Link>
        </div>
      </AppLayout>
    )
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`
    return `₹${amount.toLocaleString()}`
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Back Button */}
          <Link href="/network">
            <Button variant="ghost" className="gap-2 mb-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Network
            </Button>
          </Link>

          {/* Header Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Logo */}
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                    {ngo.title.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <Badge 
                        variant="outline" 
                        className={cn('mb-3', categoryColors[ngo.category || 'disaster'])}
                      >
                        {ngo.category?.charAt(0).toUpperCase() + (ngo.category?.slice(1) || '')}
                      </Badge>
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                        {ngo.title}
                      </h1>
                      <p className="text-muted-foreground mt-2">{ngo.description}</p>
                    </div>
                    <Button className="gap-2 whitespace-nowrap">
                      <Heart className="h-4 w-4" />
                      Support NGO
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {ngo.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Est. {details.foundedYear}
                    </span>
                    <a 
                      href={`https://${details.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      {details.website}
                    </a>
                  </div>

                  {/* Focus Areas */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {details.focus.map((area, index) => (
                      <Badge key={index} variant="secondary">{area}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                <p className="text-2xl font-bold">{details.totalVolunteers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Volunteers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="h-6 w-6 mx-auto text-red-500 mb-2" />
                <p className="text-2xl font-bold">{details.totalDonors.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Donors</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 mx-auto text-green-500 mb-2" />
                <p className="text-2xl font-bold">{details.activeCampaigns}</p>
                <p className="text-xs text-muted-foreground">Active Campaigns</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Building2 className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold">{formatCurrency(details.totalRaised)}</p>
                <p className="text-xs text-muted-foreground">Total Raised</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact & Achievements */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{details.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{details.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Website</p>
                    <a 
                      href={`https://${details.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {details.website}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Key Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {details.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Award className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{achievement}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
