import { useState } from 'react'

export default function SettingsPanel() {
  const [status, setStatus] = useState<string | null>(null)

  const handleLoadHistory = async () => {
    setStatus('loading')
    try {
      const result = await window.electronAPI.loadHistory()
      setStatus(`Imported ${result.imported} commands from existing history`)
      setTimeout(() => setStatus(null), 3000)
    } catch (e) {
      setStatus('Failed to load history')
      setTimeout(() => setStatus(null), 3000)
    }
  }

  const handleClearAll = async () => {
    const confirmed = window.confirm('Are you sure you want to delete ALL commands? This cannot be undone.')
    if (!confirmed) return
    try {
      await window.electronAPI.clearAll()
      setStatus('All commands cleared')
      setTimeout(() => setStatus(null), 3000)
    } catch (e) {
      setStatus('Failed to clear commands')
      setTimeout(() => setStatus(null), 3000)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="glass rounded-xl p-6 space-y-6">
        <h3 className="text-sm font-semibold text-white">General Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-glass-border">
            <div>
              <p className="text-sm text-slate-300">Run at startup</p>
              <p className="text-xs text-slate-500 mt-0.5">Automatically start CLI Logging when Windows starts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-slate-700 rounded-full peer peer-checked:bg-accent peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
            </label>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-glass-border">
            <div>
              <p className="text-sm text-slate-300">Minimize to tray</p>
              <p className="text-xs text-slate-500 mt-0.5">Close to system tray instead of quitting</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-slate-700 rounded-full peer peer-checked:bg-accent peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
            </label>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-glass-border">
            <div>
              <p className="text-sm text-slate-300">Watch PowerShell</p>
              <p className="text-xs text-slate-500 mt-0.5">Track commands from PowerShell 5.1 and 7+</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-slate-700 rounded-full peer peer-checked:bg-accent peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
            </label>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-6 space-y-6">
        <h3 className="text-sm font-semibold text-white">Data Management</h3>

        <div className="space-y-3">
          <button
            onClick={handleLoadHistory}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-surface hover:bg-surface-lighter transition-colors group"
          >
            <div className="text-left">
              <p className="text-sm text-slate-300">Load Existing History</p>
              <p className="text-xs text-slate-500 mt-0.5">Import commands from PSReadLine history files</p>
            </div>
            <svg className="text-slate-600 group-hover:text-accent transition-colors" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15V19A2 2 0 0119 21H5A2 2 0 013 19V15M17 8L12 3M12 3L7 8M12 3V15"/>
            </svg>
          </button>

          <button
            onClick={handleClearAll}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-red-500/5 hover:bg-red-500/10 transition-colors group border border-red-500/10"
          >
            <div className="text-left">
              <p className="text-sm text-red-400">Clear All Commands</p>
              <p className="text-xs text-red-400/60 mt-0.5">Permanently delete all tracked commands</p>
            </div>
            <svg className="text-red-400/70 group-hover:text-red-400 transition-colors" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6H5H21M19 6V20A2 2 0 0117 22H7A2 2 0 015 20V6M8 6V4A2 2 0 0110 2H14A2 2 0 0116 4V6"/>
            </svg>
          </button>
        </div>
      </div>

      {status && (
        <div className="glass rounded-xl p-4 text-center animate-fade-in">
          <p className="text-sm text-accent">{status}</p>
        </div>
      )}

      <div className="glass rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Keyboard Shortcuts</h3>
        <div className="space-y-2">
          {[
            { keys: ['Ctrl', 'F'], desc: 'Focus search bar' },
            { keys: ['Ctrl', 'K'], desc: 'Focus and clear search bar' },
            { keys: ['Ctrl', 'Shift', 'L'], desc: 'Toggle window visibility' },
            { keys: ['Esc'], desc: 'Clear search / blur' },
          ].map(({ keys, desc }) => (
            <div key={desc} className="flex items-center justify-between py-1.5 border-b border-glass-border last:border-none">
              <span className="text-sm text-slate-400">{desc}</span>
              <div className="flex gap-1">
                {keys.map((k, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-slate-600">+</span>}
                    <kbd className="px-2 py-0.5 text-[10px] rounded bg-slate-700 border border-slate-600 text-slate-300 font-semibold">{k}</kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
