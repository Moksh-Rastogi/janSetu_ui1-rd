'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Volunteer {
  id: string
  name: string
  avatar?: string
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
  email?: string
  phone?: string
}

interface VolunteerContextType {
  volunteers: Volunteer[]
  addVolunteer: (volunteer: Volunteer) => void
  getVolunteerById: (id: string) => Volunteer | undefined
}

const VolunteerContext = createContext<VolunteerContextType | undefined>(undefined)

export function VolunteerProvider({ children, initialVolunteers }: { children: React.ReactNode; initialVolunteers: Volunteer[] }) {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(initialVolunteers)

  const addVolunteer = (volunteer: Volunteer) => {
    setVolunteers(prev => [...prev, volunteer])
  }

  const getVolunteerById = (id: string): Volunteer | undefined => {
    return volunteers.find(v => v.id === id)
  }

  return (
    <VolunteerContext.Provider value={{ volunteers, addVolunteer, getVolunteerById }}>
      {children}
    </VolunteerContext.Provider>
  )
}

export function useVolunteers() {
  const context = useContext(VolunteerContext)
  if (!context) {
    throw new Error('useVolunteers must be used within VolunteerProvider')
  }
  return context
}
