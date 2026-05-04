import type { Command } from '../types'

const SOURCE_BADGES: Record<string, string> = {
  powershell: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  cmd: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  pwsh: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
}

const CATEGORY_COLORS: Record<string, string> = {
  git: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  npm: 'bg-red-500/15 text-red-400 border-red-500/20',
  docker: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  python: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  rust: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  node: 'bg-green-500/15 text-green-400 border-green-500/20',
  go: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  java: 'bg-red-600/15 text-red-400 border-red-600/20',
  dotnet: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  package: 'bg-teal-500/15 text-teal-400 border-teal-500/20',
  network: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  editor: 'bg-gray-500/15 text-gray-400 border-gray-500/20',
  filesystem: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  powershell: 'bg-blue-600/15 text-blue-400 border-blue-600/20',
  system: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
  environment: 'bg-lime-500/15 text-lime-400 border-lime-500/20',
  cloud: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
  scripts: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  framework: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  comment: 'bg-white/5 text-slate-500 border-white/10',
  general: 'bg-white/5 text-slate-400 border-white/10',
}

interface CommandCardProps {
  command: Command
}

export default function CommandCard({ command }: CommandCardProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(command.command)
  }

  const time = new Date(command.timestamp)
  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const dateStr = time.toLocaleDateString([], { month: 'short', day: 'numeric' })

  const isFrequent = command.frequency > 2

  return (
    <div className="glass-hover glass rounded-lg px-4 py-2.5 flex items-center gap-3 transition-all animate-in cursor-default group">
      <div className="flex-1 min-w-0 flex items-center gap-3">
        <code className="text-sm text-white/90 code-font truncate flex-1" title={command.command}>
          {command.command}
        </code>

        {isFrequent && (
          <span className="text-[10px] text-accent font-semibold opacity-60 shrink-0">
            x{command.frequency}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className={`category-badge border ${CATEGORY_COLORS[command.category] || CATEGORY_COLORS.general}`}>
          {command.category}
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${SOURCE_BADGES[command.source] || SOURCE_BADGES.powershell}`}>
          {command.source === 'powershell' ? 'PS' : command.source === 'pwsh' ? 'PS' : 'CMD'}
        </span>
        <span className="text-[10px] text-slate-600 w-16 text-right tabular-nums shrink-0">
          {timeStr}
        </span>
        <span className="text-[10px] text-slate-600 w-20 text-right tabular-nums shrink-0 hidden md:block">
          {dateStr}
        </span>
      </div>

      <button
        onClick={handleCopy}
        className="w-7 h-7 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 text-slate-500 hover:text-accent transition-all shrink-0"
        title="Copy command"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
        </svg>
      </button>
    </div>
  )
}
