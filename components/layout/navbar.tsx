'use client'

import { useState } from 'react'
import { Search, Bell, ChevronDown, LogOut, User } from 'lucide-react'
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

type UserRole = 'admin' | 'volunteer' | 'donor'

const ROLES: { value: UserRole; label: string; color: string }[] = [
  { value: 'admin', label: 'NGO Admin', color: 'bg-primary' },
  { value: 'volunteer', label: 'Volunteer', color: 'bg-secondary' },
  { value: 'donor', label: 'Donor', color: 'bg-accent' },
]

export function Navbar() {
  const [role, setRole] = useState<UserRole>('admin')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const currentRole = ROLES.find((r) => r.value === role)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex h-full items-center px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
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
                placeholder="Search campaigns, volunteers..."
                className="pl-10 bg-muted border-0 focus-visible:ring-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
              />
              {searchOpen && searchQuery && (
                <div className="absolute top-12 left-0 right-0 bg-card border border-border rounded-lg shadow-lg z-50 p-2">
                  <div className="text-xs text-muted-foreground p-2">
                    Search results for "{searchQuery}"
                  </div>
                  <div className="text-xs text-muted-foreground p-2">
                    (AI search feature coming soon)
                  </div>
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
                <span className={cn('h-2 w-2 rounded-full', currentRole?.color)} />
                <span className="text-xs">{currentRole?.label}</span>
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
                  className={cn(role === r.value && 'bg-muted')}
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
                  JD
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
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
