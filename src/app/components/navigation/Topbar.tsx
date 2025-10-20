import { Search, Plus, Bell, Focus, User } from 'lucide-react'
import { useUIStore } from '@/app/store/useUI'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function Topbar() {
  const setQuickAddOpen = useUIStore((state) => state.setQuickAddOpen)
  const focusMode = useUIStore((state) => state.focusMode)
  const setFocusMode = useUIStore((state) => state.setFocusMode)
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // TODO: Implement search
      console.log('Searching for:', searchQuery)
    }
  }

  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Search */}
        <div className="flex items-center space-x-4 flex-1">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* Center - Quick Add Button */}
        <div className="flex items-center">
          <button
            onClick={() => setQuickAddOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Quick Add</span>
          </button>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Focus Mode Toggle */}
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`
              p-2 rounded-md transition-colors
              ${
                focusMode
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }
            `}
            title={focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
          >
            <Focus className="h-4 w-4" />
          </button>

          {/* Notifications */}
          <button
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          {/* User Menu */}
          <button
            onClick={() => navigate('/profile')}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            title="User Profile"
          >
            <User className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
