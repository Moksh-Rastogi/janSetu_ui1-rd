'use client'

import { useState } from 'react'
import { X, Users, Building2, Package, UserPlus, Heart, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { MarkerData } from './map-marker'
import { AssignVolunteerModal } from './assign-volunteer-modal'

interface RightPanelProps {
  marker: MarkerData | null
  isOpen: boolean
  onClose: () => void
}

const severityColors = {
  critical: 'bg-red-500/20 text-red-300 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  low: 'bg-green-500/20 text-green-300 border-green-500/30',
}

const categoryLabels = {
  health: 'Health Crisis',
  food: 'Food Shortage',
  disaster: 'Natural Disaster',
  education: 'Education Support',
}

export function RightPanel({ marker, isOpen, onClose }: RightPanelProps) {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [assignedVolunteers, setAssignedVolunteers] = useState<{ id: string; name: string }[]>([])

  const handleAssignVolunteer = (volunteerId: string, volunteerName: string) => {
    setAssignedVolunteers((prev) => [...prev, { id: volunteerId, name: volunteerName }])
  }

  return (
    <>
      <div
        className={cn(
          'absolute top-0 right-0 h-full w-full sm:w-96 z-40',
          'bg-black/40 backdrop-blur-xl border-l border-white/10',
          'transform transition-transform duration-300 ease-out',
          'flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {marker && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between p-4 border-b border-white/10">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">{marker.title}</h3>
                <p className="text-sm text-white/60">{categoryLabels[marker.category]}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close panel</span>
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Severity Badge */}
              <div>
                <Badge
                  variant="outline"
                  className={cn('capitalize text-sm', severityColors[marker.severity])}
                >
                  {marker.severity} Severity
                </Badge>
              </div>

              {/* People Affected */}
              <div className="flex items-center gap-3 text-white">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-white/60">People Affected</p>
                  <p className="text-xl font-semibold">{marker.peopleAffected.toLocaleString()}</p>
                </div>
              </div>

              {/* NGO Name */}
              <div className="flex items-center gap-3 text-white">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Managed by</p>
                  <p className="font-medium">{marker.ngoName}</p>
                </div>
              </div>

              {/* Required Resources */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/60">
                  <Package className="h-4 w-4" />
                  <span className="text-sm">Required Resources</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {marker.resources.map((resource, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-white/10 text-white border-white/20"
                    >
                      {resource}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Volunteers List */}
              <div className="space-y-3">
                <h4 className="text-sm text-white/60">Assigned Volunteers</h4>
                <div className="space-y-2">
                  {marker.volunteers.map((volunteer, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm font-medium">
                        {volunteer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{volunteer.name}</p>
                        <p className="text-xs text-white/50">{volunteer.role}</p>
                      </div>
                    </div>
                  ))}
                  {/* Newly assigned volunteers */}
                  {assignedVolunteers.map((volunteer, index) => (
                    <div
                      key={`new-${index}`}
                      className="flex items-center gap-3 p-2 rounded-lg bg-primary/10 border border-primary/30"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm font-medium">
                        {volunteer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{volunteer.name}</p>
                        <p className="text-xs text-white/50">{volunteer.id} - Newly Assigned</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons - Fixed at Bottom */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="flex gap-3">
                <Button 
                  className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-white font-medium h-11"
                  onClick={() => setIsAssignModalOpen(true)}
                >
                  <UserPlus className="h-4 w-4" />
                  Assign Volunteer
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2 border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white font-medium h-11"
                >
                  <Heart className="h-4 w-4" />
                  Donate
                </Button>
              </div>
              <Button
                variant="ghost"
                className="w-full mt-2 gap-2 text-white/70 hover:text-white hover:bg-white/10"
              >
                <ExternalLink className="h-4 w-4" />
                View Full Details
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Assign Volunteer Modal */}
      {marker && (
        <AssignVolunteerModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          onAssign={handleAssignVolunteer}
          issueTitle={marker.title}
        />
      )}
    </>
  )
}
