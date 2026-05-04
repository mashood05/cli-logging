const chokidar = require('chokidar')
const fs = require('fs')
const path = require('path')
const { addCommand } = require('./database.cjs')

let watchers = []

function getHistoryPaths() {
  const paths = []

  paths.push(
    path.join(process.env.APPDATA, 'Microsoft', 'Windows', 'PowerShell', 'PSReadLine', 'ConsoleHost_history.txt'),
    path.join(process.env.APPDATA, 'PowerShell', 'PSReadLine', 'ConsoleHost_history.txt'),
  )

  const psReadLineDir = path.join(process.env.APPDATA, 'Microsoft', 'Windows', 'PowerShell', 'PSReadLine')
  try {
    if (fs.existsSync(psReadLineDir)) {
      const files = fs.readdirSync(psReadLineDir)
      for (const f of files) {
        if (f.endsWith('_history.txt')) {
          paths.push(path.join(psReadLineDir, f))
        }
      }
    }
  } catch (e) {}

  const ps7Dir = path.join(process.env.APPDATA, 'PowerShell', 'PSReadLine')
  try {
    if (fs.existsSync(ps7Dir)) {
      const files = fs.readdirSync(ps7Dir)
      for (const f of files) {
        if (f.endsWith('_history.txt')) {
          paths.push(path.join(ps7Dir, f))
        }
      }
    }
  } catch (e) {}

  return [...new Set(paths)]
}

const filePositions = new Map()

function readNewLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const allLines = content.split('\n').filter(l => l.trim())
    const lastPos = filePositions.get(filePath) || 0
    const currentLength = allLines.length

    if (currentLength > lastPos) {
      const newLines = allLines.slice(lastPos)
      filePositions.set(filePath, currentLength)
      return newLines
    }

    if (currentLength < lastPos) {
      filePositions.set(filePath, currentLength)
    }

    return []
  } catch (e) {
    return []
  }
}

function startWatchers(onNewCommand) {
  const paths = getHistoryPaths()

  for (const p of paths) {
    try {
      const dir = path.dirname(p)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    } catch (e) {}
  }

  const validPaths = paths.filter(p => {
    try {
      const dir = path.dirname(p)
      return fs.existsSync(dir)
    } catch (e) {
      return false
    }
  })

  const source = validPaths.some(p => p.includes('PowerShell')) ? 'powershell' : 'cmd'

  for (const p of validPaths) {
    try {
      if (fs.existsSync(p)) {
        readNewLines(p)
      }
    } catch (e) {}
  }

  const watcher = chokidar.watch(validPaths, {
    persistent: true,
    ignoreInitial: false,
    awaitWriteFinish: {
      stabilityThreshold: 500,
      pollInterval: 200,
    },
  })

  watcher.on('change', (filePath) => {
    const newLines = readNewLines(filePath)
    for (const line of newLines) {
      addCommand(line, source)
    }
    if (newLines.length > 0 && onNewCommand) {
      onNewCommand()
    }
  })

  watcher.on('add', (filePath) => {
    readNewLines(filePath)
  })

  watcher.on('error', (error) => {
    console.error('Watcher error:', error)
  })

  watchers.push(watcher)

  const interval = setInterval(() => {
    for (const p of validPaths) {
      if (fs.existsSync(p)) {
        const newLines = readNewLines(p)
        for (const line of newLines) {
          addCommand(line, source)
        }
        if (newLines.length > 0 && onNewCommand) {
          onNewCommand()
        }
      }
    }
  }, 2000)

  watchers.push({ close: () => clearInterval(interval) })
}

function stopWatchers() {
  for (const w of watchers) {
    try {
      if (typeof w.close === 'function') w.close()
    } catch (e) {}
  }
  watchers = []
}

module.exports = { startWatchers, stopWatchers, getHistoryPaths }
