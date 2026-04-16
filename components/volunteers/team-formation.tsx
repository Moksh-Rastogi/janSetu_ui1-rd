'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Plus, 
  Users, 
  UserPlus, 
  X, 
  CheckCircle2,
  MapPin,
  Star
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Volunteer } from '@/app/volunteers/page'

interface TeamFormationProps {
  volunteers: Volunteer[]
}

interface Team {
  id: string
  name: string
  description: string
  members: Volunteer[]
  campaign?: string
}

const MOCK_TEAMS: Team[] = [
  {
    id: 't1',
    name: 'Delhi Relief Squad',
    description: 'Primary response team for Delhi region emergencies',
    members: [],
    campaign: 'Flood Relief 2024',
  },
  {
    id: 't2',
    name: 'Medical Response Unit',
    description: 'Healthcare professionals for medical emergencies',
    members: [],
    campaign: 'Health Camp Initiative',
  },
]

export function TeamFormation({ volunteers }: TeamFormationProps) {
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS.map((team, index) => ({
    ...team,
    members: volunteers.slice(index * 2, index * 2 + 2)
  })))
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamDescription, setNewTeamDescription] = useState('')
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return
    
    const newTeam: Team = {
      id: `t${Date.now()}`,
      name: newTeamName,
      description: newTeamDescription,
      members: [],
    }
    setTeams([...teams, newTeam])
    setNewTeamName('')
    setNewTeamDescription('')
    setShowCreateTeam(false)
  }

  const handleAddMember = (teamId: string, volunteer: Volunteer) => {
    setTeams(teams.map(team => {
      if (team.id === teamId && !team.members.some(m => m.id === volunteer.id)) {
        return { ...team, members: [...team.members, volunteer] }
      }
      return team
    }))
  }

  const handleRemoveMember = (teamId: string, volunteerId: string) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        return { ...team, members: team.members.filter(m => m.id !== volunteerId) }
      }
      return team
    }))
  }

  const availableVolunteers = volunteers.filter(v => 
    !teams.some(t => t.members.some(m => m.id === v.id))
  )

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Active Teams</h2>
          <p className="text-sm text-muted-foreground">{teams.length} teams created</p>
        </div>
        <Button onClick={() => setShowCreateTeam(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Team
        </Button>
      </div>

      {/* Create Team Form */}
      {showCreateTeam && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Create New Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Team name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
            />
            <Input
              placeholder="Description (optional)"
              value={newTeamDescription}
              onChange={(e) => setNewTeamDescription(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateTeam}>Create Team</Button>
              <Button variant="outline" onClick={() => setShowCreateTeam(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Teams Grid */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {teams.map(team => (
          <TeamCard
            key={team.id}
            team={team}
            isSelected={selectedTeam === team.id}
            onSelect={() => setSelectedTeam(selectedTeam === team.id ? null : team.id)}
            onRemoveMember={(volunteerId) => handleRemoveMember(team.id, volunteerId)}
            availableVolunteers={availableVolunteers}
            onAddMember={(volunteer) => handleAddMember(team.id, volunteer)}
          />
        ))}
      </div>

      {teams.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-foreground mb-1">No teams yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first team to start coordinating volunteers
            </p>
            <Button onClick={() => setShowCreateTeam(true)}>Create Team</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface TeamCardProps {
  team: Team
  isSelected: boolean
  onSelect: () => void
  onRemoveMember: (volunteerId: string) => void
  availableVolunteers: Volunteer[]
  onAddMember: (volunteer: Volunteer) => void
}

function TeamCard({ 
  team, 
  isSelected, 
  onSelect, 
  onRemoveMember,
  availableVolunteers,
  onAddMember 
}: TeamCardProps) {
  const [showAddMember, setShowAddMember] = useState(false)

  return (
    <Card className={cn(
      'transition-all',
      isSelected && 'ring-2 ring-primary'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {team.name}
            </CardTitle>
            {team.description && (
              <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
            )}
          </div>
          {team.campaign && (
            <Badge variant="secondary">{team.campaign}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Team Members */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              Members ({team.members.length})
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2"
              onClick={() => setShowAddMember(!showAddMember)}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {team.members.length > 0 ? (
            <div className="space-y-2">
              {team.members.map(member => (
                <div 
                  key={member.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {member.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        {member.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {member.completedTasks} tasks
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => onRemoveMember(member.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No members assigned yet
            </p>
          )}
        </div>

        {/* Add Member Dropdown */}
        {showAddMember && availableVolunteers.length > 0 && (
          <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Available Volunteers
            </p>
            {availableVolunteers.map(volunteer => (
              <div
                key={volunteer.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                onClick={() => {
                  onAddMember(volunteer)
                  setShowAddMember(false)
                }}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {volunteer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {volunteer.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {volunteer.skills.slice(0, 2).join(', ')}
                  </p>
                </div>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        )}

        {showAddMember && availableVolunteers.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2 border rounded-lg">
            All volunteers are assigned to teams
          </p>
        )}
      </CardContent>
    </Card>
  )
}
