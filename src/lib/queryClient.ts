import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
})

// Query keys factory
export const queryKeys = {
  tasks: {
    all: ['tasks'] as const,
    lists: () => [...queryKeys.tasks.all, 'list'] as const,
    list: (id: string) => [...queryKeys.tasks.lists(), id] as const,
    detail: (id: string) => [...queryKeys.tasks.all, 'detail', id] as const,
    search: (query: string) =>
      [...queryKeys.tasks.all, 'search', query] as const,
    dateRange: (start: string, end: string) =>
      [...queryKeys.tasks.all, 'dateRange', start, end] as const,
  },
  lists: {
    all: ['lists'] as const,
    detail: (id: string) => [...queryKeys.lists.all, 'detail', id] as const,
  },
  tags: {
    all: ['tags'] as const,
  },
  habits: {
    all: ['habits'] as const,
    logs: (habitId: string) =>
      [...queryKeys.habits.all, 'logs', habitId] as const,
  },
  focus: {
    sessions: () => ['focus', 'sessions'] as const,
    stats: (period: string) => ['focus', 'stats', period] as const,
  },
}
