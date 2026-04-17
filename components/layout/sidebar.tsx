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
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MENU_ITEMS = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/',
  },
  {
    icon: Map,
    label: 'Crisis Map',
    href: '/crisis-map',
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

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      {/* Mobile Overlay - Only visible on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Width-based push layout on desktop, overlay on mobile */}
      <aside
        className={cn(
          'flex flex-col border-r border-border bg-background transition-all duration-300 ease-in-out',
          'h-[calc(100vh-64px)]',
          // Desktop: relative positioning for width-based push layout
          'md:relative',
          // Mobile: fixed overlay
          'fixed left-0 top-16 z-40',
          // Dynamic width based on open state
          isOpen ? 'w-64 md:w-64' : 'w-0 md:w-64'
        )}
      >
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
                  onClick={onClose}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="md:block hidden">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-4 py-4">
          <p className="text-xs text-muted-foreground hidden md:block">
            JanSetu v1.0 | Smart NGO Ecosystem
          </p>
        </div>
      </aside>
    </>
  )
}
