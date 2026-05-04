const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron')
const path = require('path')
const { initDatabase, closeDatabase } = require('./database.cjs')
const { getCommands, searchCommands, getStats, getCategories, loadHistoryFromFile } = require('./database.cjs')
const { startWatchers, stopWatchers } = require('./watcher.cjs')
const { setupTray, destroyTray } = require('./tray.cjs')

const isDev = process.env.NODE_ENV === 'development'

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 800,
    minHeight: 500,
    frame: false,
    show: false,
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault()
      mainWindow.hide()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function setupIPC() {
  ipcMain.handle('commands:getAll', async (_event, { limit, offset }) => {
    return getCommands({ limit, offset })
  })

  ipcMain.handle('commands:search', async (_event, query) => {
    return searchCommands(query)
  })

  ipcMain.handle('commands:getStats', async () => {
    return getStats()
  })

  ipcMain.handle('commands:getCategories', async () => {
    return getCategories()
  })

  ipcMain.handle('commands:getByCategory', async (_event, category) => {
    return searchCommands(`category:${category}`)
  })

  ipcMain.handle('commands:delete', async (_event, id) => {
    const { getDatabase } = require('./database.cjs')
    const db = getDatabase()
    if (db) {
      db.run('DELETE FROM commands WHERE id = ?', [id])
      const { saveDatabase } = require('./database.cjs')
      saveDatabase()
    }
    return { success: true }
  })

  ipcMain.handle('commands:clear', async () => {
    const { getDatabase } = require('./database.cjs')
    const db = getDatabase()
    if (db) {
      db.run('DELETE FROM commands')
      const { saveDatabase } = require('./database.cjs')
      saveDatabase()
    }
    return { success: true }
  })

  ipcMain.handle('commands:loadHistory', async () => {
    const result = loadHistoryFromFile()
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('commands:updated')
    }
    return result
  })

  ipcMain.handle('window:minimize', () => {
    if (mainWindow) mainWindow.minimize()
  })

  ipcMain.handle('window:maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
      } else {
        mainWindow.maximize()
      }
    }
  })

  ipcMain.handle('window:close', () => {
    if (mainWindow) mainWindow.hide()
  })

  ipcMain.handle('app:quit', () => {
    app.isQuitting = true
    app.quit()
  })
}

app.whenReady().then(async () => {
  await initDatabase()
  setupIPC()
  createWindow()
  setupTray(mainWindow)

  setTimeout(() => {
    loadHistoryFromFile()
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('commands:updated')
    }
  }, 1500)

  startWatchers(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('commands:updated')
    }
  })

  globalShortcut.register('Ctrl+Shift+L', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
        mainWindow.focus()
      }
    }
  })
})

app.on('before-quit', () => {
  app.isQuitting = true
  stopWatchers()
  destroyTray()
  closeDatabase()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
    startWatchers(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('commands:updated')
      }
    })
  } else {
    mainWindow.show()
  }
})
