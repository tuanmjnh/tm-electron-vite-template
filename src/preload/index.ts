import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

// NativeTheme
contextBridge.exposeInMainWorld('DarkMode', {
  Toggle: (args) => ipcRenderer.invoke('dark-mode:toggle', args),
  System: () => ipcRenderer.invoke('dark-mode:system')
})

// Dialog
contextBridge.exposeInMainWorld('Dialog', {
  OpenFile: (args) => ipcRenderer.invoke('dialog:open-file', args),
  OpenFolder: (args) => ipcRenderer.invoke('dialog:open-folder', args),
  SaveFile: (args) => ipcRenderer.invoke('dialog:save-file', args)
})

// Config
contextBridge.exposeInMainWorld('Config', {
  Set: (args) => ipcRenderer.send('config:set', args),
  SetKey: (args) => ipcRenderer.send('config:setKey', args),
  Get: (args) => ipcRenderer.invoke('config:get', args),
  GetKey: (args) => ipcRenderer.invoke('config:getKey', args),
})

// Puppeteer
contextBridge.exposeInMainWorld('Puppeteer', {
  Open: (args) => ipcRenderer.invoke('puppeteer:chrome', args)
})
