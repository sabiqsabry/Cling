import {
  Home,
  Calendar,
  List,
  Grid3X3,
  Clock,
  Target,
  Settings,
  ChevronLeft,
  ChevronRight,
  Folder,
  Tag,
} from 'lucide-react'
import { useUIStore } from '@/app/store/useUI'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Today', href: '/today', icon: Calendar },
  { name: 'List', href: '/list', icon: List },
  { name: 'Kanban', href: '/kanban', icon: Grid3X3 },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Timeline', href: '/timeline', icon: Clock },
  { name: 'Focus', href: '/focus', icon: Target },
  { name: 'Habits', href: '/habits', icon: Target },
]

const smartLists = [
  { name: 'Today', href: '/today' },
  { name: 'Next 7 Days', href: '/list?filter=next7days' },
  { name: 'Overdue', href: '/list?filter=overdue' },
]

export function Sidebar() {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((state) => state.setSidebarCollapsed)
  const location = useLocation()

  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-40 h-full bg-card border-r border-border transition-all duration-200',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!sidebarCollapsed && (
          <h1 className="text-xl font-bold text-foreground">Cling</h1>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1 rounded-md hover:bg-muted transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Main Navigation */}
          <div>
            {!sidebarCollapsed && (
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Views
              </h2>
            )}
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                        sidebarCollapsed && 'justify-center'
                      )}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="ml-3">{item.name}</span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Smart Lists */}
          {!sidebarCollapsed && (
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Smart Lists
              </h2>
              <ul className="space-y-1">
                {smartLists.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        )}
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Lists */}
          {!sidebarCollapsed && (
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Lists
              </h2>
              <ul className="space-y-1">
                <li>
                  <div className="flex items-center px-3 py-2 text-sm text-muted-foreground">
                    <Folder className="h-4 w-4 mr-3" />
                    <span>Inbox</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center px-3 py-2 text-sm text-muted-foreground">
                    <Folder className="h-4 w-4 mr-3" />
                    <span>Sprint</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center px-3 py-2 text-sm text-muted-foreground">
                    <Folder className="h-4 w-4 mr-3" />
                    <span>Personal</span>
                  </div>
                </li>
              </ul>
            </div>
          )}

          {/* Tags */}
          {!sidebarCollapsed && (
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Tags
              </h2>
              <ul className="space-y-1">
                <li>
                  <div className="flex items-center px-3 py-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4 mr-3" />
                    <span>#uni</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center px-3 py-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4 mr-3" />
                    <span>#work</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center px-3 py-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4 mr-3" />
                    <span>#home</span>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Settings */}
      <div className="border-t border-border p-4">
        <Link
          to="/settings"
          className={cn(
            'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
            location.pathname === '/settings'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted',
            sidebarCollapsed && 'justify-center'
          )}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          {!sidebarCollapsed && <span className="ml-3">Settings</span>}
        </Link>
      </div>
    </div>
  )
}
