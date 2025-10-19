import { ReactNode } from 'react'
import { Sidebar } from '../navigation/Sidebar'
import { Topbar } from '../navigation/Topbar'
import { SyncBanner } from './SyncBanner'
import { useUIStore } from '@/app/store/useUI'
import { isSupabaseConfigured } from '@/lib/env'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed)
  const syncBannerDismissed = useUIStore((state) => state.syncBannerDismissed)
  const setSyncBannerDismissed = useUIStore(
    (state) => state.setSyncBannerDismissed
  )

  const showSyncBanner = !isSupabaseConfigured() && !syncBannerDismissed

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Sync banner */}
        {showSyncBanner && (
          <SyncBanner onDismiss={() => setSyncBannerDismissed(true)} />
        )}

        {/* Main content */}
        <main
          className={`flex-1 overflow-auto transition-all duration-200 ${
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          }`}
        >
          <div className="h-full p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
