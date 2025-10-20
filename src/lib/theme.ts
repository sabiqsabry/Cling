import { useEffect } from 'react'
import { useUIStore } from '@/app/store/useUI'

export function useTheme() {
  const { theme, setTheme } = useUIStore()

  useEffect(() => {
    const root = document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (themePreference: string) => {
      if (themePreference === 'system') {
        // Remove existing theme classes
        root.classList.remove('light', 'dark')
        // Apply system preference
        if (mediaQuery.matches) {
          root.classList.add('dark')
        } else {
          root.classList.add('light')
        }
      } else {
        // Remove existing theme classes
        root.classList.remove('light', 'dark')
        // Apply specific theme
        root.classList.add(themePreference)
      }
    }

    // Apply initial theme
    applyTheme(theme)

    // Listen for system theme changes
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        applyTheme(theme)
      }
    }

    // Listen for theme changes from the store
    const unsubscribe = useUIStore.subscribe(
      (state) => state.theme,
      (newTheme) => {
        applyTheme(newTheme)
      }
    )

    // Listen for system theme changes
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    // Cleanup
    return () => {
      unsubscribe()
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [theme])

  return {
    theme,
    setTheme,
    isDark:
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches),
  }
}

// Initialize theme on app startup
export function initializeTheme() {
  const root = document.documentElement
  const savedTheme = localStorage.getItem('cling-ui')
    ? JSON.parse(localStorage.getItem('cling-ui')!).theme
    : 'system'

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  if (savedTheme === 'system') {
    root.classList.remove('light', 'dark')
    if (mediaQuery.matches) {
      root.classList.add('dark')
    } else {
      root.classList.add('light')
    }
  } else {
    root.classList.remove('light', 'dark')
    root.classList.add(savedTheme)
  }
}
