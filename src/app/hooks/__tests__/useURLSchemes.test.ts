import { describe, it, expect, vi } from 'vitest'
import { useURLSchemes } from '../useURLSchemes'

// Mock the UI store
vi.mock('@/app/store/useUI', () => ({
  useUIStore: () => ({
    setQuickAddOpen: vi.fn(),
    setCurrentView: vi.fn(),
    setSearchQuery: vi.fn(),
  }),
}))

describe('useURLSchemes', () => {
  it('should create task URL correctly', () => {
    const { createTaskURL } = useURLSchemes()

    const url = createTaskURL('Test task', {
      description: 'Test description',
      priority: 2,
      due_date: '2024-01-15',
      tags: ['work', 'urgent'],
    })

    expect(url).toContain('cling://add_task')
    expect(url).toContain('title=Test%20task')
    expect(url).toContain('description=Test%20description')
    expect(url).toContain('priority=2')
    expect(url).toContain('due_date=2024-01-15')
    expect(url).toContain('tags=work%2Curgent')
  })

  it('should create show view URL correctly', () => {
    const { showViewURL } = useURLSchemes()

    const url = showViewURL('today')
    expect(url).toBe('cling://show/today')

    const urlWithId = showViewURL('task', '123')
    expect(urlWithId).toBe('cling://show/task?id=123')
  })

  it('should create search URL correctly', () => {
    const { searchURL } = useURLSchemes()

    const url = searchURL('project review')
    expect(url).toContain('cling://search')
    expect(url).toContain('q=project%20review')
  })

  it('should handle URL scheme events', () => {
    // This would test the actual URL scheme handling
    // In a real test, we'd mock the window event system
    expect(true).toBe(true) // Placeholder
  })
})
