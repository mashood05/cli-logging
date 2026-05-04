import { useRef, useEffect, useState } from 'react'
import type { Command } from '../types'
import CommandCard from './CommandCard'

interface CommandListProps {
  commands: Command[]
  loading: boolean
  onRefresh: () => void
}

function groupByDate(commands: Command[]): Map<string, Command[]> {
  const groups = new Map<string, Command[]>()
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const yesterday = today - 86400000
  const weekAgo = today - 7 * 86400000

  for (const cmd of commands) {
    const cmdDate = new Date(cmd.timestamp)
    const cmdDay = new Date(cmdDate.getFullYear(), cmdDate.getMonth(), cmdDate.getDate()).getTime()
    let label: string

    if (cmdDay === today) {
      label = 'Today'
    } else if (cmdDay === yesterday) {
      label = 'Yesterday'
    } else if (cmdDay >= weekAgo) {
      label = 'This Week'
    } else {
      label = cmdDate.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })
    }

    if (!groups.has(label)) groups.set(label, [])
    groups.get(label)!.push(cmd)
  }

  return groups
}

export default function CommandList({ commands, loading }: CommandListProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(50)

  useEffect(() => {
    setVisibleCount(50)
  }, [commands])

  useEffect(() => {
    const el = listRef.current
    if (!el) return

    function handleScroll() {
      if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 200) {
        setVisibleCount(prev => Math.min(prev + 50, commands.length))
      }
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [commands.length])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <span className="text-sm text-slate-500">Loading commands...</span>
        </div>
      </div>
    )
  }

  if (commands.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center px-8">
          <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
              <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21"/>
            </svg>
          </div>
          <div>
            <p className="text-slate-400 font-medium">No commands found</p>
            <p className="text-xs text-slate-600 mt-1">Open a terminal and start typing commands.<br/>They will appear here automatically.</p>
          </div>
          <div className="flex gap-1 text-xs text-slate-600 mt-2">
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Shift</kbd>
            <span>+</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">L</kbd>
            <span className="ml-2">to toggle window</span>
          </div>
        </div>
      </div>
    )
  }

  const groups = groupByDate(commands.slice(0, visibleCount))

  return (
    <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
      {Array.from(groups.entries()).map(([date, cmds]) => (
        <div key={date}>
          <div className="flex items-center gap-3 mb-2 px-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{date}</span>
            <div className="flex-1 h-px bg-glass-border" />
            <span className="text-[10px] text-slate-600 tabular-nums">{cmds.length}</span>
          </div>
          <div className="space-y-1">
            {cmds.map((cmd) => (
              <CommandCard key={cmd.id} command={cmd} />
            ))}
          </div>
        </div>
      ))}

      {visibleCount < commands.length && (
        <div className="py-4 text-center">
          <span className="text-xs text-slate-600">
            Showing {visibleCount.toLocaleString()} of {commands.length.toLocaleString()} commands
          </span>
        </div>
      )}
    </div>
  )
}
