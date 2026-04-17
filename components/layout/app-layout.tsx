'use client'

import { Sidebar } from './sidebar'
import { Navbar } from './navbar'
import { useSidebar } from './sidebar-context'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, toggleSidebar, closeSidebar } = useSidebar()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onMenuClick={toggleSidebar} sidebarOpen={isOpen} />
      <div className="flex flex-1 pt-16 overflow-hidden">
        <Sidebar isOpen={isOpen} onClose={closeSidebar} />
        <main className="flex-1 overflow-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
