'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award, Star, Flame, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Volunteer } from '@/app/volunteers/page'

interface LeaderboardProps {
  volunteers: Volunteer[]
}

const rankConfig = {
  1: { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  2: { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-400/10' },
  3: { icon: Medal, color: 'text-amber-600', bg: 'bg-amber-600/10' },
}

export function Leaderboard({ volunteers }: LeaderboardProps) {
  // Sort by points
  const sortedVolunteers = [...volunteers].sort((a, b) => b.points - a.points)
  const topThree = sortedVolunteers.slice(0, 3)
  const restVolunteers = sortedVolunteers.slice(3)

  return (
    <div className="space-y-6">
      {/* Top 3 Podium */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {/* Second Place */}
        <div className="order-2 md:order-1">
          {topThree[1] && (
            <TopVolunteerCard volunteer={topThree[1]} rank={2} />
          )}
        </div>
        
        {/* First Place */}
        <div className="order-1 md:order-2">
          {topThree[0] && (
            <TopVolunteerCard volunteer={topThree[0]} rank={1} />
          )}
        </div>
        
        {/* Third Place */}
        <div className="order-3">
          {topThree[2] && (
            <TopVolunteerCard volunteer={topThree[2]} rank={3} />
          )}
        </div>
      </div>

      {/* Points & Badges Summary */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Flame className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {volunteers.reduce((sum, v) => sum + v.points, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Points Earned</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <Award className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {volunteers.reduce((sum, v) => sum + v.badges.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Badges Awarded</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {volunteers.reduce((sum, v) => sum + v.completedTasks, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Ranking Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Full Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedVolunteers.map((volunteer, index) => (
              <LeaderboardRow 
                key={volunteer.id} 
                volunteer={volunteer} 
                rank={index + 1} 
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface TopVolunteerCardProps {
  volunteer: Volunteer
  rank: 1 | 2 | 3
}

function TopVolunteerCard({ volunteer, rank }: TopVolunteerCardProps) {
  const config = rankConfig[rank]
  const Icon = config.icon
  
  return (
    <Card className={cn(
      'relative overflow-hidden',
      rank === 1 && 'md:-mt-4 border-yellow-500/30'
    )}>
      {/* Rank Badge */}
      <div className={cn(
        'absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center',
        config.bg
      )}>
        <Icon className={cn('h-5 w-5', config.color)} />
      </div>

      <CardContent className="p-6 text-center">
        <Avatar className={cn(
          'mx-auto mb-4',
          rank === 1 ? 'h-20 w-20' : 'h-16 w-16'
        )}>
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
            {volunteer.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>

        <h3 className="font-semibold text-foreground mb-1">{volunteer.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{volunteer.location}</p>

        <div className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-full',
          config.bg
        )}>
          <Flame className={cn('h-4 w-4', config.color)} />
          <span className={cn('font-bold', config.color)}>
            {volunteer.points.toLocaleString()} pts
          </span>
        </div>

        <div className="flex justify-center gap-4 mt-4 text-sm">
          <div className="text-center">
            <p className="font-semibold text-foreground">{volunteer.completedTasks}</p>
            <p className="text-xs text-muted-foreground">Tasks</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              {volunteer.rating}
            </p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">{volunteer.badges.length}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface LeaderboardRowProps {
  volunteer: Volunteer
  rank: number
}

function LeaderboardRow({ volunteer, rank }: LeaderboardRowProps) {
  const isTopThree = rank <= 3
  const config = isTopThree ? rankConfig[rank as 1 | 2 | 3] : null
  
  return (
    <div className={cn(
      'flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-muted/50',
      isTopThree && config?.bg
    )}>
      {/* Rank */}
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
        isTopThree && config ? config.bg : 'bg-muted',
        isTopThree && config ? config.color : 'text-muted-foreground'
      )}>
        {isTopThree && config ? (
          <config.icon className="h-4 w-4" />
        ) : (
          rank
        )}
      </div>

      {/* Avatar & Name */}
      <Avatar className="h-10 w-10">
        <AvatarFallback className="bg-primary/10 text-primary">
          {volunteer.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{volunteer.name}</p>
        <p className="text-xs text-muted-foreground">{volunteer.location}</p>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-6 text-sm">
        <div className="text-center">
          <p className="font-medium text-foreground">{volunteer.completedTasks}</p>
          <p className="text-xs text-muted-foreground">Tasks</p>
        </div>
        <div className="text-center">
          <p className="font-medium text-foreground flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            {volunteer.rating}
          </p>
          <p className="text-xs text-muted-foreground">Rating</p>
        </div>
      </div>

      {/* Points */}
      <Badge variant={isTopThree ? 'default' : 'secondary'} className="min-w-[80px] justify-center">
        <Flame className="h-3 w-3 mr-1" />
        {volunteer.points.toLocaleString()}
      </Badge>
    </div>
  )
}
