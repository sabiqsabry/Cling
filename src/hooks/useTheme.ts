import { useEffect } from 'react'
import { useUIStore } from '@/app/store/useUI'
import { useAuthStore } from '@/app/store/useAuth'

export function useThemeSync() {
  const { theme, setTheme } = useUIStore()
  const { profile, updateProfile, isAuthenticated } = useAuthStore()

  // Sync theme preference with Supabase when authenticated
  useEffect(() => {
    if (isAuthenticated && profile && profile.theme_preference && profile.theme_preference !== theme) {
      // Load theme from profile if different from current
      setTheme(profile.theme_preference as any)
    }
  }, [isAuthenticated, profile, theme, setTheme])

  // Save theme preference to Supabase when it changes
  useEffect(() => {
    if (isAuthenticated && profile && profile.theme_preference !== theme) {
      updateProfile({ theme_preference: theme })
    }
  }, [theme, isAuthenticated, profile, updateProfile])

  return {
    theme,
    setTheme,
  }
}
