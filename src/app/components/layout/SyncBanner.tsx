import { X, CloudOff } from 'lucide-react'

interface SyncBannerProps {
  onDismiss: () => void
}

export function SyncBanner({ onDismiss }: SyncBannerProps) {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CloudOff className="h-5 w-5 text-amber-600" />
          <div className="text-sm">
            <span className="font-medium text-amber-800">
              Cloud sync not configured (local-only mode)
            </span>
            <span className="text-amber-700 ml-2">
              Your data is stored locally. Set up Supabase to enable cloud sync.
            </span>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-amber-600 hover:text-amber-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
