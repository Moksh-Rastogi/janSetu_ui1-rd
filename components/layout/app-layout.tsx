import { Sidebar } from './sidebar'
import { Navbar } from './navbar'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 mt-16 p-4 sm:p-6 lg:p-8 bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  )
}
