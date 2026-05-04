const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getCommands: (params) => ipcRenderer.invoke('commands:getAll', params),
  searchCommands: (query) => ipcRenderer.invoke('commands:search', query),
  getStats: () => ipcRenderer.invoke('commands:getStats'),
  getCategories: () => ipcRenderer.invoke('commands:getCategories'),
  getByCategory: (category) => ipcRenderer.invoke('commands:getByCategory', category),
  deleteCommand: (id) => ipcRenderer.invoke('commands:delete', id),
  clearAll: () => ipcRenderer.invoke('commands:clear'),
  loadHistory: () => ipcRenderer.invoke('commands:loadHistory'),

  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  quitApp: () => ipcRenderer.invoke('app:quit'),

  onCommandsUpdated: (callback) => {
    const listener = () => callback()
    ipcRenderer.on('commands:updated', listener)
    return () => ipcRenderer.removeListener('commands:updated', listener)
  },
})
