import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, MapPin, Star, CheckCircle2, Users, Zap, Target } from 'lucide-react'

interface Campaign {
  id: string
  name: string
  status: 'active' | 'completed'
  progress: number
}

interface ImpactStat {
  label: string
  value: string
}

interface NGODetailProps {
  ngo: {
    id: string
    name: string
    location: string
    focusAreas: string[]
    trustScore: number
    isVerified: boolean
    activeCampaigns: number
    description: string
    campaignsArray: Campaign[]
    resources: string[]
    impactStats: ImpactStat[]
  }
  onClose: () => void
}

export function NGODetailPanel({ ngo, onClose }: NGODetailProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <CardHeader className="flex flex-row items-start justify-between space-y-0 border-b pb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-2xl">{ngo.name}</CardTitle>
              {ngo.isVerified && (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              )}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {ngo.location}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Overview */}
          <div>
            <h3 className="font-semibold mb-2">Overview</h3>
            <p className="text-muted-foreground">{ngo.description}</p>
          </div>

          {/* Focus Areas */}
          <div>
            <h3 className="font-semibold mb-3">Focus Areas</h3>
            <div className="flex flex-wrap gap-2">
              {ngo.focusAreas.map((area) => (
                <Badge key={area} variant="secondary">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-xs text-muted-foreground">Trust Score</span>
              </div>
              <p className="text-2xl font-bold text-primary">{ngo.trustScore}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/10">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">Active Campaigns</span>
              </div>
              <p className="text-2xl font-bold text-secondary">
                {ngo.activeCampaigns}
              </p>
            </div>
          </div>

          {/* Active Campaigns */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Active Campaigns
            </h3>
            <div className="space-y-2">
              {ngo.campaignsArray.map((campaign) => (
                <div
                  key={campaign.id}
                  className="p-3 rounded-lg border border-border bg-muted/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{campaign.name}</span>
                    <Badge
                      variant={
                        campaign.status === 'active' ? 'default' : 'outline'
                      }
                      className="text-xs"
                    >
                      {campaign.status === 'active' ? 'Active' : 'Completed'}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {campaign.progress}% complete
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Resources Available */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Resources Available
            </h3>
            <div className="flex flex-wrap gap-2">
              {ngo.resources.map((resource) => (
                <Badge key={resource} variant="outline">
                  {resource}
                </Badge>
              ))}
            </div>
          </div>

          {/* Impact Stats */}
          <div>
            <h3 className="font-semibold mb-3">Impact Statistics</h3>
            <div className="grid grid-cols-3 gap-3">
              {ngo.impactStats.map((stat) => (
                <div key={stat.label} className="text-center p-3 rounded-lg bg-muted">
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1">
              View Full Profile
            </Button>
            <Button className="flex-1">Request Collaboration</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
