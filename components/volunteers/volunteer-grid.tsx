'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  Star, 
  CheckCircle2, 
  MapPin, 
  Award,
  ChevronRight,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Volunteer } from '@/app/volunteers/page'

interface VolunteerGridProps {
  volunteers: Volunteer[]
}

const availabilityConfig = {
  available: { label: 'Available', className: 'bg-green-500' },
  busy: { label: 'Busy', className: 'bg-yellow-500' },
  offline: { label: 'Offline', className: 'bg-gray-400' },
}

export function VolunteerGrid({ volunteers }: VolunteerGridProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {volunteers.map(volunteer => (
        <VolunteerCard key={volunteer.id} volunteer={volunteer} />
      ))}

      {volunteers.length === 0 && (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          No volunteers found matching your search
        </div>
      )}
    </div>
  )
}

interface VolunteerCardProps {
  volunteer: Volunteer
}

function VolunteerCard({ volunteer }: VolunteerCardProps) {
  const availability = availabilityConfig[volunteer.availability]
  
  return (
    <Card className="hover:shadow-lg transition-all group">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {volunteer.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span 
              className={cn(
                'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background',
                availability.className
              )}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{volunteer.name}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {volunteer.location}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-muted/50 rounded-lg py-2">
            <div className="flex items-center justify-center gap-1 text-sm font-semibold text-foreground">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              {volunteer.rating}
            </div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </div>
          <div className="bg-muted/50 rounded-lg py-2">
            <div className="flex items-center justify-center gap-1 text-sm font-semibold text-foreground">
              <TrendingUp className="h-3 w-3 text-secondary" />
              {volunteer.reliabilityScore}%
            </div>
            <div className="text-xs text-muted-foreground">Reliable</div>
          </div>
          <div className="bg-muted/50 rounded-lg py-2">
            <div className="flex items-center justify-center gap-1 text-sm font-semibold text-foreground">
              <CheckCircle2 className="h-3 w-3 text-primary" />
              {volunteer.completedTasks}
            </div>
            <div className="text-xs text-muted-foreground">Tasks</div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {volunteer.skills.slice(0, 3).map(skill => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {volunteer.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{volunteer.skills.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Badges */}
        {volunteer.badges.length > 0 && (
          <div className="flex items-center gap-1 mb-4">
            <Award className="h-4 w-4 text-accent" />
            <span className="text-xs text-muted-foreground">
              {volunteer.badges.length} badge{volunteer.badges.length !== 1 ? 's' : ''}
            </span>
            <div className="flex -space-x-1 ml-auto">
              {volunteer.badges.slice(0, 3).map((badge, i) => (
                <div
                  key={badge}
                  className="h-5 w-5 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center"
                  title={badge}
                >
                  <Award className="h-3 w-3 text-accent" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action */}
        <Link href={`/volunteers/${volunteer.id}`}>
          <Button 
            variant="ghost" 
            className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          >
            View Profile
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
