import { useEffect } from 'react'
import { useUIStore } from '@/app/store/useUI'

interface URLSchemeParams {
  action: string
  data?: string
  query?: string
}

export function useURLSchemes() {
  const { setQuickAddOpen, setCurrentView, setSearchQuery } = useUIStore()

  useEffect(() => {
    // Handle URL schemes when the app is opened
    const handleURLScheme = (url: string) => {
      try {
        // Parse URL scheme: cling://action?param=value
        const urlObj = new URL(url)
        const action = urlObj.hostname
        const params = Object.fromEntries(urlObj.searchParams.entries())

        console.log('URL Scheme received:', { action, params })

        switch (action) {
          case 'add_task':
            handleAddTask(params)
            break
          case 'show':
            handleShow(params)
            break
          case 'search':
            handleSearch(params)
            break
          default:
            console.warn('Unknown URL scheme action:', action)
        }
      } catch (error) {
        console.error('Error parsing URL scheme:', error)
      }
    }

    const handleAddTask = (params: Record<string, string>) => {
      const { title, description, priority, due_date, tags } = params

      // TODO: Implement task creation with pre-filled data
      // For now, just open the quick add modal
      setQuickAddOpen(true)

      // If title is provided, we could pre-fill the quick add modal
      if (title) {
        console.log('Pre-filling task with:', {
          title,
          description,
          priority,
          due_date,
          tags,
        })
      }
    }

    const handleShow = (params: Record<string, string>) => {
      const { view, id } = params

      switch (view) {
        case 'dashboard':
          setCurrentView('dashboard')
          break
        case 'today':
          setCurrentView('today')
          break
        case 'list':
          setCurrentView('list')
          break
        case 'kanban':
          setCurrentView('kanban')
          break
        case 'calendar':
          setCurrentView('calendar')
          break
        case 'timeline':
          setCurrentView('timeline')
          break
        case 'focus':
          setCurrentView('focus')
          break
        case 'habits':
          setCurrentView('habits')
          break
        case 'settings':
          setCurrentView('settings')
          break
        case 'task':
          if (id) {
            // TODO: Open specific task for editing
            console.log('Opening task:', id)
          }
          break
        default:
          console.warn('Unknown show view:', view)
      }
    }

    const handleSearch = (params: Record<string, string>) => {
      const { q, query } = params
      const searchQuery = q || query || ''

      if (searchQuery) {
        setSearchQuery(searchQuery)
        setCurrentView('list') // Switch to list view to show search results
      }
    }

    // Listen for URL scheme events (this would be set up in Tauri)
    // For now, we'll simulate it with a custom event
    const handleCustomURLScheme = (event: CustomEvent) => {
      handleURLScheme(event.detail.url)
    }

    window.addEventListener(
      'url-scheme',
      handleCustomURLScheme as EventListener
    )

    // Example usage for testing:
    // window.dispatchEvent(new CustomEvent('url-scheme', {
    //   detail: { url: 'cling://add_task?title=New Task&priority=2' }
    // }))

    return () => {
      window.removeEventListener(
        'url-scheme',
        handleCustomURLScheme as EventListener
      )
    }
  }, [setQuickAddOpen, setCurrentView, setSearchQuery])

  // Utility functions for external use
  const createTaskURL = (
    title: string,
    options?: {
      description?: string
      priority?: number
      due_date?: string
      tags?: string[]
    }
  ) => {
    const params = new URLSearchParams()
    params.set('title', title)

    if (options?.description) params.set('description', options.description)
    if (options?.priority) params.set('priority', options.priority.toString())
    if (options?.due_date) params.set('due_date', options.due_date)
    if (options?.tags) params.set('tags', options.tags.join(','))

    return `cling://add_task?${params.toString()}`
  }

  const showViewURL = (view: string, id?: string) => {
    const params = new URLSearchParams()
    if (id) params.set('id', id)

    return `cling://show/${view}${params.toString() ? '?' + params.toString() : ''}`
  }

  const searchURL = (query: string) => {
    const params = new URLSearchParams()
    params.set('q', query)

    return `cling://search?${params.toString()}`
  }

  return {
    createTaskURL,
    showViewURL,
    searchURL,
  }
}

// Example usage documentation:
/*
URL Scheme Examples:

1. Add a new task:
   cling://add_task?title=Review%20project%20proposal&priority=2&due_date=2024-01-15&tags=work,review

2. Show specific view:
   cling://show/today
   cling://show/calendar
   cling://show/task?id=123

3. Search for tasks:
   cling://search?q=project%20review

4. Quick add with description:
   cling://add_task?title=Buy%20groceries&description=Milk,%20bread,%20eggs&priority=4

Browser Integration:
- Register the URL scheme in tauri.conf.json
- Add protocol handler in OS (Windows Registry, macOS Info.plist)
- Enable deep linking from web browsers and other apps

macOS Integration:
Add to Info.plist:
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>cling</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>cling</string>
    </array>
  </dict>
</array>

Windows Integration:
Register in registry under:
HKEY_CLASSES_ROOT\cling\shell\open\command
*/
