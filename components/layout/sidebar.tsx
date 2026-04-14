'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Map,
  Zap,
  CheckSquare,
  Users,
  Network,
  Heart,
  BookOpen,
  BarChart3,
  MessageSquare,
  Settings,
  ChevronDown,
  Menu,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const MENU_ITEMS = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/',
  },
  {
    icon: Map,
    label: 'Map',
    href: '/map',
  },
  {
    icon: Zap,
    label: 'Campaigns',
    href: '/campaigns',
  },
  {
    icon: CheckSquare,
    label: 'Tasks',
    href: '/tasks',
  },
  {
    icon: Users,
    label: 'Volunteers',
    href: '/volunteers',
  },
  {
    icon: Network,
    label: 'NGO Network',
    href: '/network',
  },
  {
    icon: Heart,
    label: 'Donations',
    href: '/donations',
  },
  {
    icon: BookOpen,
    label: 'Resources',
    href: '/resources',
  },
  {
    icon: BarChart3,
    label: 'Analytics',
    href: '/analytics',
  },
  {
    icon: MessageSquare,
    label: 'Messages',
    href: '/messages',
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/settings',
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-5 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-40 flex h-[calc(100vh-64px)] w-64 flex-col border-r border-border bg-background transition-all duration-300 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)]',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-border px-6 py-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-md">
              J
            </div>
            <span className="text-lg font-bold text-foreground">JanSetu</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-1">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-foreground hover:bg-muted'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-4 py-4">
          <p className="text-xs text-muted-foreground">
            JanSetu v1.0 | Smart NGO Ecosystem
          </p>
        </div>
      </aside>
    </>
  )
}
