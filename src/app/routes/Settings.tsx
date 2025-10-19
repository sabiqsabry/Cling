import { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Keyboard, 
  Palette, 
  Download, 
  Upload, 
  Trash2, 
  Database,
  Cloud,
  Shield,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'
import { useUIStore } from '@/app/store/useUI'
import { cn } from '@/lib/utils'

export function Settings() {
  const { 
    theme, 
    setTheme, 
    menuBarMiniEnabled, 
    setMenuBarMiniEnabled,
    trayMiniEnabled,
    setTrayMiniEnabled,
    syncBannerDismissed,
    setSyncBannerDismissed
  } = useUIStore()
  
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
    { id: 'data', label: 'Data & Sync', icon: Cloud },
    { id: 'about', label: 'About', icon: User },
  ]

  const handleExportData = () => {
    // TODO: Implement data export
    console.log('Exporting data...')
  }

  const handleImportData = () => {
    // TODO: Implement data import
    console.log('Importing data...')
  }

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      // TODO: Implement data reset
      console.log('Resetting data...')
    }
  }

  const handleSeedData = () => {
    if (confirm('This will add sample data to your database. Continue?')) {
      // TODO: Implement seed data
      console.log('Seeding data...')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Customize your Cling experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border">
            <div className="p-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 text-left rounded-md transition-colors",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">General</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">Menu Bar Mini Window</h3>
                        <p className="text-sm text-muted-foreground">
                          Enable mini window in menu bar (macOS)
                        </p>
                      </div>
                      <button
                        onClick={() => setMenuBarMiniEnabled(!menuBarMiniEnabled)}
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                          menuBarMiniEnabled ? "bg-primary" : "bg-muted"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                            menuBarMiniEnabled ? "translate-x-6" : "translate-x-1"
                          )}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">System Tray Mini Window</h3>
                        <p className="text-sm text-muted-foreground">
                          Enable mini window in system tray (Windows)
                        </p>
                      </div>
                      <button
                        onClick={() => setTrayMiniEnabled(!trayMiniEnabled)}
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                          trayMiniEnabled ? "bg-primary" : "bg-muted"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                            trayMiniEnabled ? "translate-x-6" : "translate-x-1"
                          )}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">Dismiss Sync Banner</h3>
                        <p className="text-sm text-muted-foreground">
                          Hide the cloud sync not configured banner
                        </p>
                      </div>
                      <button
                        onClick={() => setSyncBannerDismissed(!syncBannerDismissed)}
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                          syncBannerDismissed ? "bg-primary" : "bg-muted"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                            syncBannerDismissed ? "translate-x-6" : "translate-x-1"
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-foreground mb-3">Theme</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'light', label: 'Light', icon: Sun },
                          { id: 'dark', label: 'Dark', icon: Moon },
                          { id: 'system', label: 'System', icon: Monitor },
                        ].map((themeOption) => (
                          <button
                            key={themeOption.id}
                            onClick={() => setTheme(themeOption.id as any)}
                            className={cn(
                              "flex items-center space-x-2 p-3 rounded-lg border transition-colors",
                              theme === themeOption.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <themeOption.icon className="h-4 w-4" />
                            <span className="text-sm font-medium">{themeOption.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
                  
                  <div className="space-y-4">
                    <div className="text-center py-12">
                      <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Notification settings will be available when cloud sync is configured.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Shortcuts Settings */}
              {activeTab === 'shortcuts' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">Keyboard Shortcuts</h2>
                  
                  <div className="space-y-4">
                    <div className="overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 font-medium text-foreground">Action</th>
                            <th className="text-left py-2 font-medium text-foreground">Shortcut</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr>
                            <td className="py-2 text-sm text-foreground">Quick Add</td>
                            <td className="py-2 text-sm text-muted-foreground">
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Cmd+Shift+A</kbd>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 text-sm text-foreground">Toggle Mini Window</td>
                            <td className="py-2 text-sm text-muted-foreground">
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Cmd+Shift+O</kbd>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 text-sm text-foreground">Open Search</td>
                            <td className="py-2 text-sm text-muted-foreground">
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Cmd+K</kbd>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 text-sm text-foreground">Complete Selected Task</td>
                            <td className="py-2 text-sm text-muted-foreground">
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Cmd+Enter</kbd>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Data & Sync Settings */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">Data & Sync</h2>
                  
                  <div className="space-y-6">
                    {/* Local Storage */}
                    <div>
                      <h3 className="font-medium text-foreground mb-3">Local Storage</h3>
                      <div className="space-y-3">
                        <button
                          onClick={handleExportData}
                          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>Export Data</span>
                        </button>
                        
                        <button
                          onClick={handleImportData}
                          className="flex items-center space-x-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Import Data</span>
                        </button>
                        
                        <button
                          onClick={handleSeedData}
                          className="flex items-center space-x-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                        >
                          <Database className="h-4 w-4" />
                          <span>Reset to Sample Data</span>
                        </button>
                        
                        <button
                          onClick={handleResetData}
                          className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Reset All Data</span>
                        </button>
                      </div>
                    </div>

                    {/* Cloud Sync */}
                    <div>
                      <h3 className="font-medium text-foreground mb-3">Cloud Sync</h3>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Cloud className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">Not Configured</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Cloud sync is not configured. Your data is stored locally and encrypted with SQLCipher.
                        </p>
                        <button className="mt-3 text-sm text-primary hover:text-primary/80 transition-colors">
                          Configure Supabase Sync →
                        </button>
                      </div>
                    </div>

                    {/* Security */}
                    <div>
                      <h3 className="font-medium text-foreground mb-3">Security</h3>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-foreground">Data Encrypted</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Your local data is encrypted using SQLCipher with a key stored securely in your system keychain.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* About Settings */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">About</h2>
                  
                  <div className="space-y-4">
                    <div className="bg-muted p-6 rounded-lg text-center">
                      <h3 className="text-2xl font-bold text-foreground mb-2">Cling</h3>
                      <p className="text-muted-foreground mb-4">Version 1.0.0</p>
                      <p className="text-sm text-muted-foreground">
                        A powerful, offline-first task management application built with Tauri and React.
                      </p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Built with:</span>
                        <span className="text-foreground">Tauri 2.x, React 18, TypeScript</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Database:</span>
                        <span className="text-foreground">SQLite with SQLCipher</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">License:</span>
                        <span className="text-foreground">MIT</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}