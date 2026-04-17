import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, CheckCircle2, Zap } from 'lucide-react'

interface NGO {
  id: string
  name: string
  location: string
  focusAreas: string[]
  trustScore: number
  isVerified: boolean
  activeCampaigns: number
  description: string
}

interface NGOCardProps {
  ngo: NGO
  isSelected: boolean
  onSelect: (id: string) => void
}

export function NGOCard({ ngo, isSelected, onSelect }: NGOCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected
          ? 'ring-2 ring-primary border-primary'
          : 'hover:border-primary/50'
      }`}
      onClick={() => onSelect(ngo.id)}
    >
      <CardHeader>
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-lg">{ngo.name}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                {ngo.location}
              </div>
            </div>
            {ngo.isVerified && (
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            )}
          </div>

          {/* Focus Areas */}
          <div className="flex flex-wrap gap-2 pt-2">
            {ngo.focusAreas.map((area) => (
              <Badge key={area} variant="secondary" className="text-xs">
                {area}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {ngo.description}
        </p>

        {/* Trust Score and Campaigns */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-border">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">Trust Score</p>
              <p className="text-sm font-semibold">{ngo.trustScore}/100</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-sm font-semibold">{ngo.activeCampaigns}</p>
            </div>
          </div>
        </div>

        {/* Click hint */}
        <p className="text-xs text-muted-foreground text-center pt-2">
          Click to view full profile
        </p>
      </CardContent>
    </Card>
  )
}
