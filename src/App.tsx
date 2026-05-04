import { useState, useCallback, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import SearchBar from './components/SearchBar'
import CommandList from './components/CommandList'
import StatsPanel from './components/StatsPanel'
import SettingsPanel from './components/SettingsPanel'
import type { Command, Stats } from './types'

type View = 'home' | 'stats' | 'settings'

export default function App() {
  const [commands, setCommands] = useState<Command[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [view, setView] = useState<View>('home')
  const [loading, setLoading] = useState(true)

  const loadCommands = useCallback(async () => {
    try {
      const query = searchQuery || (selectedCategory ? `category:${selectedCategory}` : '')
      const result = query
        ? await window.electronAPI.searchCommands(query)
        : await window.electronAPI.getCommands({ limit: 200, offset: 0 })
      setCommands(result)
    } catch (e) {
      console.error('Failed to load commands:', e)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedCategory])

  useEffect(() => {
    loadCommands()
  }, [loadCommands])

  useEffect(() => {
    async function fetchStats() {
      try {
        const s = await window.electronAPI.getStats()
        setStats(s)
      } catch (e) {}
    }
    fetchStats()
    const unsubscribe = window.electronAPI.onCommandsUpdated(() => {
      loadCommands()
      fetchStats()
    })
    return unsubscribe
  }, [loadCommands])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setSelectedCategory(null)
  }, [])

  const handleCategorySelect = useCallback((category: string | null) => {
    setSelectedCategory(category)
    setSearchQuery('')
  }, [])

  const handleRefresh = useCallback(() => {
    loadCommands()
  }, [loadCommands])

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar
        stats={stats}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        view={view}
        onViewChange={setView}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-12 flex items-center justify-between px-4 glass border-b border-glass-border shrink-0" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-glow" />
              <h1 className="text-sm font-semibold text-white/90 tracking-wide">CLI LOGGING</h1>
            </div>
            {stats && (
              <span className="text-xs text-slate-500">
                {stats.total.toLocaleString()} commands
              </span>
            )}
          </div>

          <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
            <button
              onClick={() => window.electronAPI.minimizeWindow()}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              onClick={() => window.electronAPI.maximizeWindow()}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="1" width="10" height="10" stroke="currentColor" strokeWidth="1.5" rx="1"/>
              </svg>
            </button>
            <button
              onClick={() => window.electronAPI.closeWindow()}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </header>

        {view === 'home' && (
          <>
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              onRefresh={handleRefresh}
              activeCategory={selectedCategory}
              onClearCategory={() => handleCategorySelect(null)}
            />
            <CommandList commands={commands} loading={loading} onRefresh={handleRefresh} />
          </>
        )}

        {view === 'stats' && <StatsPanel stats={stats} />}
        {view === 'settings' && <SettingsPanel />}
      </main>
    </div>
  )
}
