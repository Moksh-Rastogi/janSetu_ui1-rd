'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { Navbar } from './navbar'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="flex pt-16">
        <div className="hidden lg:flex">
          <Sidebar isOpen={true} onClose={() => setSidebarOpen(false)} />
        </div>
        <div className="lg:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
