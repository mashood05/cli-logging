import type { Stats } from '../types'

const CATEGORY_ICONS: Record<string, string> = {
  git: 'G',
  npm: 'N',
  docker: 'D',
  python: 'P',
  rust: 'R',
  node: 'J',
  go: 'G',
  java: 'Jv',
  dotnet: '.N',
  package: 'PK',
  network: 'W',
  editor: 'E',
  filesystem: 'FS',
  powershell: 'PS',
  system: 'S',
  environment: 'ENV',
  cloud: 'C',
  scripts: 'SH',
  comment: '#',
  framework: 'FW',
  general: '?',
}

const CATEGORY_COLORS: Record<string, string> = {
  git: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  npm: 'bg-red-500/20 text-red-400 border-red-500/30',
  docker: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  python: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  rust: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  node: 'bg-green-500/20 text-green-400 border-green-500/30',
  go: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  java: 'bg-red-600/20 text-red-400 border-red-600/30',
  dotnet: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  package: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  network: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  editor: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  filesystem: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  powershell: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  system: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  environment: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  cloud: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  scripts: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  framework: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  comment: 'bg-white/5 text-slate-500 border-white/10',
  general: 'bg-white/5 text-slate-400 border-white/10',
}

interface SidebarProps {
  stats: Stats | null
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
  view: string
  onViewChange: (view: 'home' | 'stats' | 'settings') => void
}

export default function Sidebar({ stats, selectedCategory, onSelectCategory, view, onViewChange }: SidebarProps) {
  const categories = stats?.categories || []

  return (
    <aside className="w-56 glass border-r border-glass-border flex flex-col shrink-0">
      <nav className="p-3 space-y-0.5">
        <button
          onClick={() => { onViewChange('home'); onSelectCategory(null) }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
            view === 'home' && !selectedCategory
              ? 'bg-accent/15 text-accent font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21"/>
          </svg>
          All Commands
        </button>
        <button
          onClick={() => onViewChange('stats')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
            view === 'stats'
              ? 'bg-accent/15 text-accent font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 20V10M12 20V4M6 20V14"/>
          </svg>
          Statistics
        </button>
        <button
          onClick={() => onViewChange('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
            view === 'settings'
              ? 'bg-accent/15 text-accent font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/><path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"/>
          </svg>
          Settings
        </button>
      </nav>

      <div className="px-3 py-2">
        <div className="h-px bg-glass-border" />
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Categories</span>
          {selectedCategory && (
            <button
              onClick={() => onSelectCategory(null)}
              className="text-xs text-accent hover:text-accent-hover transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-0.5">
          {categories.map(({ category, count }) => (
            <button
              key={category}
              onClick={() => onSelectCategory(selectedCategory === category ? null : category)}
              className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-all group ${
                selectedCategory === category
                  ? 'bg-accent/15 text-white font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`w-6 h-5 flex items-center justify-center rounded text-[10px] font-bold border ${CATEGORY_COLORS[category] || CATEGORY_COLORS.general}`}>
                {CATEGORY_ICONS[category] || '?'}
              </span>
              <span className="capitalize flex-1 text-left truncate">{category}</span>
              <span className="text-xs text-slate-600 tabular-nums">{count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-glass-border">
        <div className="glass rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Today</span>
            <span className="text-accent font-semibold tabular-nums">{stats?.today || 0}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Total</span>
            <span className="text-white font-semibold tabular-nums">{stats?.total.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Unique</span>
            <span className="text-slate-300 font-semibold tabular-nums">{stats?.unique.toLocaleString() || 0}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
