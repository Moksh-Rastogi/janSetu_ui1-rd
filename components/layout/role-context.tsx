'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type UserRole = 'ngo-admin' | 'volunteer' | 'donor'

export interface RoleUser {
  name: string
  email: string
  phone: string
  avatar: string
  role: UserRole
  roleLabel: string
  trustScore: number
  isVerified: boolean
  organization: {
    name: string
    type: string
    registrationNumber: string
    address: string
    website: string
    verificationStatus: string
    documentsSubmitted: number
    documentsRequired: number
  }
}

// Mock data for different roles
const ROLE_USERS: Record<UserRole, RoleUser> = {
  'ngo-admin': {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@hopefoundation.org',
    phone: '+91 98765 43210',
    avatar: '',
    role: 'ngo-admin',
    roleLabel: 'NGO Admin',
    trustScore: 85,
    isVerified: true,
    organization: {
      name: 'Hope Foundation India',
      type: 'Non-Profit Organization',
      registrationNumber: 'NGO/2020/12345',
      address: '123 Civil Lines, New Delhi, India',
      website: 'www.hopefoundation.org',
      verificationStatus: 'verified',
      documentsSubmitted: 4,
      documentsRequired: 4,
    },
  },
  volunteer: {
    name: 'Priya Singh',
    email: 'priya.singh@gmail.com',
    phone: '+91 87654 32109',
    avatar: '',
    role: 'volunteer',
    roleLabel: 'Volunteer',
    trustScore: 78,
    isVerified: true,
    organization: {
      name: 'Goonj',
      type: 'Associated NGO',
      registrationNumber: 'VOL/2024/56789',
      address: 'Sector 15, Noida, India',
      website: 'www.goonj.org',
      verificationStatus: 'verified',
      documentsSubmitted: 2,
      documentsRequired: 2,
    },
  },
  donor: {
    name: 'Vikram Mehta',
    email: 'vikram.mehta@company.com',
    phone: '+91 76543 21098',
    avatar: '',
    role: 'donor',
    roleLabel: 'Donor',
    trustScore: 92,
    isVerified: true,
    organization: {
      name: 'Mehta Industries CSR',
      type: 'Corporate Donor',
      registrationNumber: 'DON/2023/78901',
      address: '456 Business Park, Mumbai, India',
      website: 'www.mehtaindustries.com',
      verificationStatus: 'verified',
      documentsSubmitted: 3,
      documentsRequired: 3,
    },
  },
}

interface RoleContextType {
  currentRole: UserRole
  currentUser: RoleUser
  setRole: (role: UserRole) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('ngo-admin')

  const setRole = (role: UserRole) => {
    setCurrentRole(role)
  }

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        currentUser: ROLE_USERS[currentRole],
        setRole,
      }}
    >
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error('useRole must be used within RoleProvider')
  }
  return context
}

export { ROLE_USERS }
