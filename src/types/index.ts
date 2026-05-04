export interface Command {
  id: number
  command: string
  source: string
  category: string
  timestamp: number
  working_directory: string | null
  frequency: number
}

export interface Stats {
  total: number
  today: number
  unique: number
  categories: { category: string; count: number }[]
  topCommands: { command: string; frequency: number; category: string }[]
  hourlyActivity: { hour: number; count: number }[]
}

export interface ElectronAPI {
  getCommands: (params: { limit: number; offset: number }) => Promise<Command[]>
  searchCommands: (query: string) => Promise<Command[]>
  getStats: () => Promise<Stats>
  getCategories: () => Promise<{ category: string; count: number }[]>
  getByCategory: (category: string) => Promise<Command[]>
  deleteCommand: (id: number) => Promise<{ success: boolean }>
  clearAll: () => Promise<{ success: boolean }>
  loadHistory: () => Promise<{ imported: number }>

  minimizeWindow: () => void
  maximizeWindow: () => void
  closeWindow: () => void
  quitApp: () => void

  onCommandsUpdated: (callback: () => void) => () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
