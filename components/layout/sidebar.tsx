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
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'flex h-[calc(100vh-64px)] w-64 flex-col border-r border-border bg-background transition-all duration-300',
          'fixed left-0 top-16 z-40 lg:relative lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
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
