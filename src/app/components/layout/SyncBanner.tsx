import { X, CloudOff, WifiOff, CheckCircle } from 'lucide-react'
import { useUIStore } from '@/app/store/useUI'
import { useAuthStore } from '@/app/store/useAuth'

interface SyncBannerProps {
  onDismiss: () => void
}

export function SyncBanner({ onDismiss }: SyncBannerProps) {
  const { isOnline } = useUIStore()
  const { syncEnabled, isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) return null

  const getBannerConfig = () => {
    if (syncEnabled && isOnline) {
      return {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        iconColor: 'text-green-600',
        textColor: 'text-green-800',
        icon: CheckCircle,
        message: 'Cloud sync enabled - data synced across devices'
      }
    } else if (isOnline) {
      return {
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        iconColor: 'text-amber-600',
        textColor: 'text-amber-800',
        icon: CloudOff,
        message: 'Cloud sync not configured (local-only mode)'
      }
    } else {
      return {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconColor: 'text-red-600',
        textColor: 'text-red-800',
        icon: WifiOff,
        message: 'You\'re offline - working in local mode'
      }
    }
  }

  const config = getBannerConfig()
  const Icon = config.icon

  return (
    <div className={`${config.bgColor} border-b ${config.borderColor} px-4 py-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
          <div className="text-sm">
            <span className={`font-medium ${config.textColor}`}>
              {config.message}
            </span>
            {!syncEnabled && isOnline && (
              <span className={`${config.textColor.replace('800', '700')} ml-2`}>
                Your data is stored locally. Supabase is configured and ready.
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onDismiss}
          className={`${config.iconColor} hover:opacity-80 transition-colors`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
