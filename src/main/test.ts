import { ipcMain } from 'electron'

export default () => {
  ipcMain.on('test', (event, arg) => {
    console.log(arg)
  })
}
