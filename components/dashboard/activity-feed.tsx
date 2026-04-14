import { Heart, CheckCircle2, MessageSquare, LogIn } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export interface ActivityItem {
  id: string
  type: 'donation' | 'volunteer_join' | 'task_completed' | 'message'
  user: {
    name: string
    initials: string
  }
  description: string
  timestamp: string
}

interface ActivityFeedProps {
  activities: ActivityItem[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'donation':
        return <Heart className="h-4 w-4 text-accent" />
      case 'volunteer_join':
        return <LogIn className="h-4 w-4 text-secondary" />
      case 'task_completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'message':
        return <MessageSquare className="h-4 w-4 text-primary" />
      default:
        return <Heart className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your ecosystem</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-4">
              <div className="relative flex flex-col items-center">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-muted text-xs">
                    {activity.user.initials}
                  </AvatarFallback>
                </Avatar>
                {index < activities.length - 1 && (
                  <div className="absolute top-10 h-6 w-0.5 bg-border" />
                )}
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {activity.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
