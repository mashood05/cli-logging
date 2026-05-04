const { Tray, Menu, nativeImage, app } = require('electron')
const path = require('path')

let tray = null

function setupTray(mainWindow) {
  try {
    const iconPath = path.join(__dirname, '..', 'public', 'tray-icon.png')
    let icon

    try {
      icon = nativeImage.createFromPath(iconPath)
    } catch (e) {
      icon = nativeImage.createEmpty()
    }

    if (icon.isEmpty()) {
      const size = 16
      const canvas = Buffer.alloc(size * size * 4)
      for (let i = 0; i < size * size; i++) {
        const offset = i * 4
        canvas[offset] = 34
        canvas[offset + 1] = 211
        canvas[offset + 2] = 238
        canvas[offset + 3] = 255
      }
      icon = nativeImage.createFromBuffer(canvas, { width: size, height: size })
    }

    tray = new Tray(icon)
    tray.setToolTip('CLI Logging - Command Tracker')

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open CLI Logging',
        click: () => {
          if (mainWindow) {
            mainWindow.show()
            mainWindow.focus()
          }
        },
      },
      { type: 'separator' },
      {
        label: 'Reload History',
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.send('reload-history')
          }
        },
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          app.isQuitting = true
          app.quit()
        },
      },
    ])

    tray.setContextMenu(contextMenu)

    tray.on('double-click', () => {
      if (mainWindow) {
        mainWindow.show()
        mainWindow.focus()
      }
    })
  } catch (e) {
    console.error('Failed to create tray:', e)
  }
}

function destroyTray() {
  if (tray) {
    tray.destroy()
    tray = null
  }
}

module.exports = { setupTray, destroyTray }
