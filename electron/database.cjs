const path = require('path')
const fs = require('fs')
const { app } = require('electron')
const initSqlJs = require('sql.js')

const userDataPath = app.getPath('userData')
const dbPath = path.join(userDataPath, 'cli-logging.db')

let db = null
let saveTimer = null

async function initDatabase() {
  const SQL = await initSqlJs({
    locateFile: (file) => {
      const candidates = [
        path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', file),
        path.join(process.resourcesPath || '', 'app.asar', 'node_modules', 'sql.js', 'dist', file),
        path.join(process.resourcesPath || '', 'app.asar.unpacked', 'node_modules', 'sql.js', 'dist', file),
      ]
      for (const p of candidates) {
        try { if (fs.existsSync(p)) return p } catch (_) {}
      }
      return file
    }
  })

  try {
    if (fs.existsSync(dbPath) && fs.statSync(dbPath).size > 0) {
      const buffer = fs.readFileSync(dbPath)
      db = new SQL.Database(buffer)
    } else {
      db = new SQL.Database()
    }
  } catch (e) {
    db = new SQL.Database()
  }

  db.run('PRAGMA journal_mode = MEMORY')
  db.run('PRAGMA synchronous = OFF')

  db.run(`
    CREATE TABLE IF NOT EXISTS commands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      command TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'powershell',
      category TEXT NOT NULL DEFAULT 'general',
      timestamp INTEGER NOT NULL,
      working_directory TEXT,
      frequency INTEGER DEFAULT 1
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `)

  const countStmt = db.prepare('SELECT COUNT(*) FROM commands')
  let hasData = false
  if (countStmt.step()) {
    const row = countStmt.get()
    hasData = row && row[0] > 0
  }
  countStmt.free()

  if (!hasData) {
    insertDefaultSettings()
  }

  saveDatabase()
}

function insertDefaultSettings() {
  db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['autoStart', 'true'])
  db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['minimizeToTray', 'true'])
  db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['watchPowerShell', 'true'])
  db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['watchCmd', 'true'])
}

function getDatabase() {
  return db
}

function execRows(sql, params = []) {
  if (!db) return []
  const stmt = db.prepare(sql)
  if (params && params.length) {
    stmt.bind(params)
  }
  const rows = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject())
  }
  stmt.free()
  return rows
}

function execOne(sql, params = []) {
  if (!db) return null
  const stmt = db.prepare(sql)
  if (params && params.length) {
    stmt.bind(params)
  }
  let result = null
  if (stmt.step()) {
    result = stmt.getAsObject()
  }
  stmt.free()
  return result
}

function saveDatabase() {
  if (!db) return
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    syncSave()
  }, 500)
}

function syncSave() {
  if (!db) return
  try {
    const data = db.export()
    fs.writeFileSync(dbPath, Buffer.from(data))
  } catch (e) {
    console.error('Failed to save database:', e.message)
  }
}

function addCommand(cmd, source = 'powershell', cwd = null) {
  cmd = cmd.trim()
  if (!cmd || cmd.length > 2000 || cmd.startsWith('#')) return null

  const { categorizeCommand } = require('./categorizer.cjs')
  const category = categorizeCommand(cmd)
  const now = Date.now()

  const existing = execOne(
    'SELECT id, frequency FROM commands WHERE command = ? ORDER BY timestamp DESC LIMIT 1',
    [cmd]
  )

  if (existing) {
    db.run('UPDATE commands SET frequency = frequency + 1, timestamp = ? WHERE id = ?', [now, existing.id])
    saveDatabase()
    return existing.id
  }

  db.run(
    'INSERT INTO commands (command, source, category, timestamp, working_directory) VALUES (?, ?, ?, ?, ?)',
    [cmd, source, category, now, cwd]
  )
  saveDatabase()
  return null
}

function getCommands({ limit = 100, offset = 0 }) {
  return execRows(
    'SELECT * FROM commands ORDER BY timestamp DESC LIMIT ? OFFSET ?',
    [limit, offset]
  )
}

function searchCommands(query) {
  if (!query || query.trim() === '') {
    return getCommands({ limit: 200, offset: 0 })
  }

  const lowerQuery = query.toLowerCase().trim()

  if (lowerQuery.startsWith('category:')) {
    const cat = lowerQuery.replace('category:', '').trim()
    return execRows(
      'SELECT * FROM commands WHERE category = ? ORDER BY timestamp DESC LIMIT 200',
      [cat]
    )
  }

  return execRows(
    'SELECT * FROM commands WHERE LOWER(command) LIKE ? ORDER BY timestamp DESC LIMIT 200',
    [`%${lowerQuery}%`]
  )
}

function getStats() {
  const total = execOne('SELECT COUNT(*) as count FROM commands')

  const today = execOne(
    'SELECT COUNT(*) as count FROM commands WHERE timestamp > ?',
    [Date.now() - 86400000]
  )

  const unique = execOne('SELECT COUNT(DISTINCT command) as count FROM commands')

  const categories = execRows(
    'SELECT category, COUNT(*) as count FROM commands GROUP BY category ORDER BY count DESC'
  )

  const topCommands = execRows(
    'SELECT command, frequency, category FROM commands ORDER BY frequency DESC LIMIT 10'
  )

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

  const hourlyActivity = []
  for (let h = 0; h < 24; h++) {
    const startMs = sevenDaysAgo
    hourlyActivity.push({
      hour: h,
      count: 0,
    })
  }

  const hourlyRows = execRows(
    'SELECT CAST(strftime(\'%H\', timestamp/1000, \'unixepoch\') AS INTEGER) as hour, COUNT(*) as count FROM commands WHERE timestamp > ? GROUP BY hour ORDER BY hour',
    [sevenDaysAgo]
  )

  for (const row of hourlyRows) {
    if (row.hour >= 0 && row.hour < 24) {
      hourlyActivity[row.hour].count = row.count
    }
  }

  return {
    total: total ? total.count : 0,
    today: today ? today.count : 0,
    unique: unique ? unique.count : 0,
    categories,
    topCommands,
    hourlyActivity,
  }
}

function getCategories() {
  return execRows(
    'SELECT category, COUNT(*) as count FROM commands GROUP BY category ORDER BY count DESC'
  )
}

function loadHistoryFromFile() {
  const histories = [
    path.join(process.env.APPDATA, 'Microsoft', 'Windows', 'PowerShell', 'PSReadLine', 'ConsoleHost_history.txt'),
    path.join(process.env.APPDATA, 'PowerShell', 'PSReadLine', 'ConsoleHost_history.txt'),
  ]

  let count = 0

  for (const histPath of histories) {
    try {
      if (fs.existsSync(histPath)) {
        const content = fs.readFileSync(histPath, 'utf-8')
        const lines = content.split('\n').filter(l => l.trim())
        for (const line of lines) {
          addCommand(line, 'powershell')
          count++
        }
      }
    } catch (e) {
      console.log(`Could not read history: ${histPath}`, e.message)
    }
  }

  return { imported: count }
}

function closeDatabase() {
  if (saveTimer) clearTimeout(saveTimer)
  syncSave()
  if (db) {
    db.close()
    db = null
  }
}

module.exports = { initDatabase, getDatabase, execRows, execOne, addCommand, getCommands, searchCommands, getStats, getCategories, loadHistoryFromFile, closeDatabase, saveDatabase }
