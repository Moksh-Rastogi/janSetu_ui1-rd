'use client'

import { useState, useMemo } from 'react'
import { Search, Bell, ChevronDown, LogOut, User, Menu, MapPin, Building2, Users, ClipboardList, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { searchAll, getTypeLabel, getTypeColor, type SearchItem } from '@/lib/search-data'
import Link from 'next/link'
import { useRole, type UserRole } from './role-context'

const ROLES: { value: UserRole; label: string; color: string }[] = [
  { value: 'ngo-admin', label: 'NGO Admin', color: 'bg-primary' },
  { value: 'volunteer', label: 'Volunteer', color: 'bg-secondary' },
  { value: 'donor', label: 'Donor', color: 'bg-accent' },
]

interface NavbarProps {
  onMenuClick?: () => void
  sidebarOpen?: boolean
}

// Get icon for search result type
function getTypeIcon(type: SearchItem['type']) {
  switch (type) {
    case 'campaign': return MapPin
    case 'task': return ClipboardList
    case 'ngo': return Building2
    case 'volunteer': return Users
    default: return Search
  }
}

// Get link for search result
function getResultLink(item: SearchItem): string {
  switch (item.type) {
    case 'campaign': return '/crisis-map'
    case 'task': return '/tasks'
    case 'ngo': return '/crisis-map'
    case 'volunteer': return `/volunteers/${item.id}`
    default: return '/'
  }
}

export function Navbar({ onMenuClick, sidebarOpen }: NavbarProps) {
  const { currentRole: globalRole, setRole, currentUser } = useRole()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const currentRoleConfig = ROLES.find((r) => r.value === globalRole)

  // Search results
  const searchResults = useMemo(() => {
    return searchAll(searchQuery)
  }, [searchQuery])

  const handleClearSearch = () => {
    setSearchQuery('')
    setSearchOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex h-full items-center px-4 sm:px-6 lg:px-8">
        {/* Left: Menu Button + Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Menu Button - Always visible, toggles sidebar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-md">
            J
          </div>
          <span className="text-lg font-bold text-foreground hidden sm:inline">JanSetu</span>
        </div>

        {/* Center: Search */}
        <div className="flex-1 flex justify-center px-4">
          <div className="w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search campaigns, tasks, NGOs, volunteers..."
                className="pl-10 pr-8 bg-muted border-0 focus-visible:ring-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 300)}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {searchOpen && searchQuery && (
                <div className="absolute top-12 left-0 right-0 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-2 border-b border-border">
                    <span className="text-xs text-muted-foreground">
                      {searchResults.length > 0 
                        ? `Found ${searchResults.length} result${searchResults.length > 1 ? 's' : ''} for "${searchQuery}"`
                        : `No results found for "${searchQuery}"`
                      }
                    </span>
                  </div>
                  {searchResults.length > 0 ? (
                    <div className="py-1">
                      {searchResults.slice(0, 10).map((item) => {
                        const Icon = getTypeIcon(item.type)
                        return (
                          <Link
                            key={`${item.type}-${item.id}`}
                            href={getResultLink(item)}
                            onClick={() => {
                              setSearchOpen(false)
                              setSearchQuery('')
                            }}
                            className="flex items-start gap-3 px-3 py-2.5 hover:bg-muted transition-colors cursor-pointer"
                          >
                            <div className={cn('mt-0.5 p-1.5 rounded-md', getTypeColor(item.type))}>
                              <Icon className="h-3.5 w-3.5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-foreground truncate">
                                  {item.title}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase font-medium">
                                  {getTypeLabel(item.type)}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {item.description}
                              </p>
                              {item.location && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span>{item.location}</span>
                                </div>
                              )}
                            </div>
                          </Link>
                        )
                      })}
                      {searchResults.length > 10 && (
                        <div className="px-3 py-2 text-xs text-muted-foreground text-center border-t border-border">
                          Showing 10 of {searchResults.length} results
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-sm text-muted-foreground">No matching results</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try searching for campaigns, tasks, NGOs, or volunteers
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <div className="px-3 py-2 text-sm border-l-2 border-accent bg-accent/5 cursor-pointer hover:bg-accent/10">
                  <p className="font-medium">Flood Alert</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Flash flood warning in District X
                  </p>
                  <p className="text-xs text-muted-foreground">2 min ago</p>
                </div>
                <div className="px-3 py-2 text-sm border-l-2 border-secondary bg-secondary/5 cursor-pointer hover:bg-secondary/10">
                  <p className="font-medium">New Volunteer</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    5 new volunteers joined today
                  </p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
                <div className="px-3 py-2 text-sm border-l-2 border-primary bg-primary/5 cursor-pointer hover:bg-primary/10">
                  <p className="font-medium">Donation Received</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ₹50,000 donated to Relief Fund
                  </p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Role Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
                <span className={cn('h-2 w-2 rounded-full', currentRoleConfig?.color)} />
                <span className="text-xs">{currentRoleConfig?.label}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ROLES.map((r) => (
                <DropdownMenuItem
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={cn(globalRole === r.value && 'bg-muted')}
                >
                  <span className={cn('h-2 w-2 rounded-full mr-2', r.color)} />
                  {r.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {currentUser.name.split(' ').map((n) => n[0]).join('')}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2" asChild>
                <Link href="/settings">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-destructive">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
