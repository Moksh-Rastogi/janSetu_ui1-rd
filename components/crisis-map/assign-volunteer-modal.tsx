'use client'

import { useState } from 'react'
import { X, UserPlus, Search, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface RegisteredVolunteer {
  id: string
  name: string
  skills: string[]
  availability: 'available' | 'busy' | 'offline'
  rating: number
  reliabilityScore: number
  completedTasks: number
  points: number
  badges: string[]
  joinedDate: string
  location: string
  ngoAssociations: string[]
}

interface AssignVolunteerModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (volunteerId: string, volunteerName: string) => void
  issueTitle: string
  registeredVolunteers?: RegisteredVolunteer[]
}

export function AssignVolunteerModal({ 
  isOpen, 
  onClose, 
  onAssign, 
  issueTitle,
  registeredVolunteers = []
}: AssignVolunteerModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [manualName, setManualName] = useState('')
  const [manualId, setManualId] = useState('')
  const [selectedVolunteer, setSelectedVolunteer] = useState<RegisteredVolunteer | null>(null)
  const [assignMode, setAssignMode] = useState<'select' | 'manual'>('select')

  const filteredVolunteers = registeredVolunteers.filter((v) => {
    const query = searchQuery.toLowerCase()
    return (
      v.name.toLowerCase().includes(query) ||
      v.id.toLowerCase().includes(query) ||
      v.skills.some(skill => skill.toLowerCase().includes(query))
    )
  }).filter(v => v.availability === 'available')

  const handleAssign = () => {
    if (assignMode === 'select' && selectedVolunteer) {
      onAssign(selectedVolunteer.id, selectedVolunteer.name)
    } else if (assignMode === 'manual' && manualName && manualId) {
      onAssign(manualId, manualName)
    }
    // Reset state
    setSearchQuery('')
    setManualName('')
    setManualId('')
    setSelectedVolunteer(null)
    onClose()
  }

  const canAssign = assignMode === 'select' 
    ? selectedVolunteer !== null 
    : manualName.trim() !== '' && manualId.trim() !== ''

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
              <UserPlus className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Assign Volunteer</h3>
              <p className="text-xs text-white/60 truncate max-w-[200px]">{issueTitle}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Mode Toggle */}
        <div className="flex p-3 gap-2 border-b border-white/10">
          <Button
            size="sm"
            onClick={() => setAssignMode('select')}
            className={cn(
              'flex-1 transition-all',
              assignMode === 'select' 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-transparent border border-white/30 text-white hover:bg-white/10'
            )}
          >
            Select from List
          </Button>
          <Button
            size="sm"
            onClick={() => setAssignMode('manual')}
            className={cn(
              'flex-1 transition-all',
              assignMode === 'manual' 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-transparent border border-white/30 text-white hover:bg-white/10'
            )}
          >
            Manual Entry
          </Button>
        </div>

        {/* Content */}
        <div className="p-3 max-h-[280px] overflow-y-auto">
          {assignMode === 'select' ? (
            <>
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Search by name or volunteer ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              {/* Volunteer List */}
              <div className="space-y-2">
                {filteredVolunteers.map((volunteer) => (
                  <div
                    key={volunteer.id}
                    onClick={() => volunteer.available && setSelectedVolunteer(volunteer)}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer',
                      !volunteer.available && 'opacity-50 cursor-not-allowed',
                      selectedVolunteer?.id === volunteer.id
                        ? 'bg-primary/20 border-primary/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white text-sm font-medium">
                        {volunteer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{volunteer.name}</p>
                        <p className="text-xs text-white/50">
                          {volunteer.id} - {volunteer.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!volunteer.available && (
                        <span className="text-xs text-orange-400 bg-orange-400/10 px-2 py-1 rounded">
                          Unavailable
                        </span>
                      )}
                      {selectedVolunteer?.id === volunteer.id && (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {filteredVolunteers.length === 0 && (
                  <div className="text-center py-8 text-white/50">
                    No volunteers found matching your search
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Manual Entry Form */
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="volunteerName" className="text-white/80">
                  Volunteer Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="volunteerName"
                  placeholder="Enter volunteer's full name"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="volunteerId" className="text-white/80">
                  Volunteer ID <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="volunteerId"
                  placeholder="Enter volunteer ID (e.g., VOL001)"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <p className="text-xs text-white/40">
                Enter the volunteer&apos;s details manually if they are not in the system yet.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-3 border-t border-white/10">
          <Button
            size="sm"
            onClick={onClose}
            className="bg-transparent border border-white/30 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleAssign}
            disabled={!canAssign}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Assign
          </Button>
        </div>
      </div>
    </div>
  )
}
