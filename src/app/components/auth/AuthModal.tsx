import { useState, useEffect } from 'react'
import { LoginForm } from './LoginForm'
import { SignUpForm } from './SignUpForm'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { X, Wifi, WifiOff } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute -top-2 -right-2 z-10 bg-background border border-border rounded-full w-8 h-8 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        {mode === 'login' ? (
          <LoginForm onSwitchToSignUp={() => setMode('signup')} />
        ) : (
          <SignUpForm onSwitchToLogin={() => setMode('login')} />
        )}
        
        {/* Offline indicator */}
        {!isOnline && (
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="flex items-center space-x-2 p-3">
                <WifiOff className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  You're offline. Some features may be limited.
                </span>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
