import { MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export interface MapHotspot {
  id: string
  name: string
  count: number
  severity: 'high' | 'medium' | 'low'
}

interface MiniMapProps {
  hotspots: MapHotspot[]
}

export function MiniMap({ hotspots }: MiniMapProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-destructive/20 text-destructive border-destructive/50'
      case 'medium':
        return 'bg-accent/20 text-accent border-accent/50'
      case 'low':
        return 'bg-secondary/20 text-secondary border-secondary/50'
      default:
        return 'bg-primary/20 text-primary border-primary/50'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Active Hotspots
        </CardTitle>
        <CardDescription>Critical areas requiring attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Simplified map visualization */}
          <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden border border-border">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Map background */}
              <rect width="400" height="300" fill="currentColor" className="text-muted" />
              
              {/* Hotspot indicators */}
              {hotspots.map((spot, index) => {
                // Distribute hotspots across the map
                const x = 80 + (index % 3) * 120
                const y = 80 + Math.floor(index / 3) * 100
                const severity = spot.severity === 'high' ? 8 : spot.severity === 'medium' ? 6 : 4
                
                return (
                  <g key={spot.id}>
                    {/* Ripple effect */}
                    <circle
                      cx={x}
                      cy={y}
                      r={severity + 4}
                      className={spot.severity === 'high' ? 'fill-destructive/20' : spot.severity === 'medium' ? 'fill-accent/20' : 'fill-secondary/20'}
                    />
                    {/* Hotspot dot */}
                    <circle
                      cx={x}
                      cy={y}
                      r={severity}
                      className={spot.severity === 'high' ? 'fill-destructive' : spot.severity === 'medium' ? 'fill-accent' : 'fill-secondary'}
                    />
                    {/* Count label */}
                    <text
                      x={x}
                      y={y + 20}
                      textAnchor="middle"
                      className="text-xs font-bold fill-foreground"
                    >
                      {spot.count}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Hotspot list */}
          <div className="space-y-2 pt-2 border-t border-border">
            {hotspots.map((spot) => (
              <div key={spot.id} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-foreground font-medium">{spot.name}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getSeverityColor(spot.severity)}`}
                  >
                    {spot.count} issues
                  </Badge>
                </div>
              </div>
            ))}
            {hotspots.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                No active hotspots
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
