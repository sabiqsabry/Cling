/**
 * Environment variable utilities
 */

export function isSupabaseConfigured(): boolean {
  return !!(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  )
}

export function getSupabaseUrl(): string | undefined {
  return import.meta.env.VITE_SUPABASE_URL
}

export function getSupabaseAnonKey(): string | undefined {
  return import.meta.env.VITE_SUPABASE_ANON_KEY
}

export function getAppName(): string {
  return import.meta.env.VITE_APP_NAME || 'Cling'
}

export function getAppVersion(): string {
  return import.meta.env.VITE_APP_VERSION || '1.0.0'
}
