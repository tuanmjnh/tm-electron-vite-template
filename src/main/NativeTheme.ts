const { ipcMain, nativeTheme } = require('electron')
ipcMain.handle('dark-mode:toggle', (event, args) => {
  // system
  // dark
  // light
  // if (nativeTheme.shouldUseDarkColors) {
  //   nativeTheme.themeSource = 'light'
  // } else {
  //   nativeTheme.themeSource = 'dark'
  // }
  nativeTheme.themeSource = args[0] ? 'dark' : 'light'
  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system'
})
