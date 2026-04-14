import { Sidebar } from './sidebar'
import { Navbar } from './navbar'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto mt-16 lg:mt-0 p-4 sm:p-6 lg:p-8 bg-muted/30 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  )
}
