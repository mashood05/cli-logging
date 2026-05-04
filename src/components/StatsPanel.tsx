import type { Stats } from '../types'

interface StatsPanelProps {
  stats: Stats | null
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  if (!stats) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  const maxHourly = Math.max(...stats.hourlyActivity.map(h => h.count), 1)

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-xl p-5">
          <p className="text-xs text-slate-500 mb-1">Total Commands</p>
          <p className="text-2xl font-bold text-white tabular-nums">{stats.total.toLocaleString()}</p>
        </div>
        <div className="glass rounded-xl p-5">
          <p className="text-xs text-slate-500 mb-1">Today</p>
          <p className="text-2xl font-bold text-accent tabular-nums">{stats.today.toLocaleString()}</p>
        </div>
        <div className="glass rounded-xl p-5">
          <p className="text-xs text-slate-500 mb-1">Unique Commands</p>
          <p className="text-2xl font-bold text-slate-300 tabular-nums">{stats.unique.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Category Breakdown</h3>
          <div className="space-y-3">
            {stats.categories.map(({ category, count }) => (
              <div key={category} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 capitalize w-24 truncate">{category}</span>
                <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 tabular-nums w-12 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Top Commands</h3>
          <div className="space-y-2">
            {stats.topCommands.map(({ command, frequency, category }, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-5 tabular-nums text-right">{i + 1}</span>
                <code className="text-xs text-slate-300 flex-1 truncate code-font">{command}</code>
                <span className="text-[10px] text-accent font-semibold tabular-nums">x{frequency}</span>
                <span className="text-[10px] text-slate-600 capitalize">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Activity (Last 7 Days)</h3>
        <div className="flex items-end gap-1 h-32">
          {stats.hourlyActivity.map(({ hour, count }) => (
            <div key={hour} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full relative" style={{ height: '120px' }}>
                <div
                  className="absolute bottom-0 w-full bg-accent/40 group-hover:bg-accent/70 rounded-t transition-all"
                  style={{
                    height: `${Math.max((count / maxHourly) * 100, 2)}%`,
                  }}
                />
              </div>
              <span className="text-[9px] text-slate-600">
                {hour.toString().padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-slate-600">00:00</span>
          <span className="text-[9px] text-slate-600">12:00</span>
          <span className="text-[9px] text-slate-600">23:00</span>
        </div>
      </div>
    </div>
  )
}
