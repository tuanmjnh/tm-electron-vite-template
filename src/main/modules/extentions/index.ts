import { ipcMain } from 'electron'
const path = require('path')
const fs = require('fs')
const AdmZip = require("adm-zip")
const collectionName = "extentions"

ipcMain.handle(`${collectionName}.installGPM`, async (event, args) => {
  try {
    console.log(args)
    // args.filePath = 'D:\\profiles\\GPMLogin\\ZAa6JEvhwg-09052024\\extensions\\{960a3725-2944-418b-8776-2c7fb41b865f}.xpi'
    if (!args.filePath || !args.dirPath) return { msg: 'noExist' }
    //Create path if not exist
    const extPath = 'extensions'
    if (!fs.existsSync(args.dirPath)) await fs.mkdirSync(args.dirPath)

    // Zip
    const zip = new AdmZip(args.filePath)
    const zipEntries = zip.getEntries()
    zipEntries.forEach(function (zipEntry) {
      // console.log(zipEntry.toString()) // outputs zip entries information
      if (zipEntry.entryName == "manifest.json") {
        const manifest = JSON.parse(zipEntry.getData().toString("utf8"))
        const id = manifest.browser_specific_settings.gecko.id
        fs.copyFile(args.filePath, path.join(args.dirPath, `${id}.xpi`), (err) => {
          if (err) throw err
          console.log('source.txt was copied to destination.txt')
        })
      }
    })
    return {}
  } catch (e) {
    console.log(e)
    return false
  }
})
