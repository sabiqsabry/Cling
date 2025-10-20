import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AppShell } from './app/components/layout/AppShell'
import { AuthModal } from './app/components/auth/AuthModal'
import { Dashboard } from './app/routes/Dashboard'
import { Today } from './app/routes/Today'
import { List } from './app/routes/List'
import { Kanban } from './app/routes/Kanban'
import { Calendar } from './app/routes/Calendar'
import { Timeline } from './app/routes/Timeline'
import { Focus } from './app/routes/Focus'
import { Habits } from './app/routes/Habits'
import { Settings } from './app/routes/Settings'
import { Profile } from './app/routes/Profile'
import { useAuthStore } from './app/store/useAuth'
import { useDataStore } from './app/store/useData'
import { useTheme } from './lib/theme'
import { initializeTheme } from './lib/theme'
import { Loader2 } from 'lucide-react'

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const {
    isAuthenticated,
    isLoading: authLoading,
    initialize: initAuth,
  } = useAuthStore()
  const { initialize: initData } = useDataStore()

  // Initialize theme system
  useTheme()

  useEffect(() => {
    // Initialize theme on app startup
    initializeTheme()

    // Initialize authentication
    initAuth()
  }, [initAuth])

  useEffect(() => {
    // Initialize data layer when authenticated
    if (isAuthenticated && !authLoading) {
      initData()
    }
  }, [isAuthenticated, authLoading, initData])

  // Show loading screen while initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Cling...</p>
        </div>
      </div>
    )
  }

  // Show auth modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <AuthModal isOpen={true} onClose={() => {}} />
      </div>
    )
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/today" element={<Today />} />
        <Route path="/list" element={<List />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/focus" element={<Focus />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AppShell>
  )
}

export default App
