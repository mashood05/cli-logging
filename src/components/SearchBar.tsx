import { useRef, useEffect } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onRefresh: () => void
  activeCategory: string | null
  onClearCategory: () => void
}

export default function SearchBar({ value, onChange, onRefresh, activeCategory, onClearCategory }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur()
        onChange('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onChange])

  return (
    <div className="px-4 py-3 glass border-b border-glass-border shrink-0">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"/><path d="M21 21L16.65 16.65"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search commands... (Ctrl+F / Ctrl+K)"
            className="w-full h-9 pl-9 pr-10 bg-surface-light border border-glass-border rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent/50 input-glow transition-all code-font"
          />
          {value && (
            <button
              onClick={() => onChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6L18 18"/>
              </svg>
            </button>
          )}
        </div>

        {activeCategory && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-xs text-accent font-medium">
            <span>{activeCategory}</span>
            <button onClick={onClearCategory} className="hover:text-white transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6L18 18"/>
              </svg>
            </button>
          </div>
        )}

        <button
          onClick={onRefresh}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all"
          title="Refresh"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 4V10H7M23 20V14H17"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14L18.36 18.36A9 9 0 013.51 15"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
