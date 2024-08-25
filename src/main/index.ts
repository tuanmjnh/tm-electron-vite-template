import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import './Dialog'
import './NativeTheme'
import './Config'

//MongoDB
// import * as  MongoDB from '../services/mongoose'
//MongoDB Modules
import './modules/authenticates'
import './modules/groups'
import './modules/roles'
import './modules/users'
import './modules/profiles'

console.log(`Environment Mode: ${import.meta.env.MODE}`)
// Read
// ipcMain.handle('config:getKey', (event, args) => {
//   return args && args.length > 0 && global.config[args] ? JSON.stringify(global.config[args]) : null
// })
// import test from './test'
// MongoDB.initialize()
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
const root = process.cwd()
let mainWindow
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1150,
    height: 768,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegrationInWorker: true,
      devTools: true
      // nodeIntegration: true,
      // contextIsolation: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // mainWindow.webContents.on('before-input-event', (_, input) => {
  //   if (input.type === 'keyDown' && input.key === 'F12') {
  //     mainWindow.webContents.isDevToolsOpened()
  //       ? mainWindow.webContents.closeDevTools()
  //       : mainWindow.webContents.openDevTools({ mode: 'detach' })
  //   }
  // })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

//nativeTheme


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  //Set children window
  // WindowChome({ parent: mainWindow, modal: false })
  // SeleniumChrome({ parent: mainWindow, modal: false })
  // SeleniumFirefox({ parent: mainWindow, modal: false })
  // PuppeteerChrome({ parent: mainWindow, modal: false })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// process.dlopen = () => {
//   throw new Error('Load native module is not safe')
// }
// const worker = new Worker('script.js')
