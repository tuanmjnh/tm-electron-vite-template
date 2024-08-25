import { ipcMain } from 'electron'

ipcMain.on('config:set', (event, args) => {
  if (args) global.config = JSON.parse(args)
})
ipcMain.on('config:setKey', (event, args) => {
  // console.log(global.config)
  // console.log(args)
  // const obj = Object.keys(JSON.parse(args))
  // if (obj.length > 0 && args[obj[0]].length > 0)
  //   global.config[obj[0]] = args[obj[0]]
  global.config = { ...global.config, ...JSON.parse(args) }
})
ipcMain.handle('config:get', (event, args) => {
  return global.config ? JSON.stringify(global.config) : null
})
ipcMain.handle('config:getKey', (event, args) => {
  return args && args.length > 0 && global.config[args] ? JSON.stringify(global.config[args]) : null
})

export { }
