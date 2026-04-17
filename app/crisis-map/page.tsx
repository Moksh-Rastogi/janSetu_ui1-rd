'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { MapView } from '@/components/crisis-map/map-view'

export default function CrisisMapPage() {
  return (
    <AppLayout>
      <div className="h-[calc(100vh-4rem)] p-2 sm:p-4">
        <MapView />
      </div>
    </AppLayout>
  )
}
