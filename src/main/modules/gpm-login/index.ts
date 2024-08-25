import { app, ipcMain, BrowserWindow } from 'electron'
import { RunExec } from '../../../utils/process-cmd'
import path, { resolve } from 'path'
const fs = require('fs')
const AdmZip = require("adm-zip")
const Database = require('better-sqlite3')
const { DownloaderHelper } = require('node-downloader-helper')
const collectionName = "profilesGPM"

ipcMain.handle(`${collectionName}.get`, async (event, args) => {
  try {
    const profile = global.config.directory.profiles.find(x => x.name == 'GPMLogin')
    const db = new Database(path.join(profile.dir, 'profile_data.db'))
    const profiles = db.prepare('SELECT * FROM profiles').all()
    // const folders = readFiles(profile.dir, { type: 'folder', exclude: '_backup' })
    // const profiles = [] as any
    // folders?.forEach(e => {
    //   const info = JSON.parse(readFile(`${e.dir}\\${e.name}\\Default\\gpm_define`))
    //   if (info) profiles.push({ ...JSON.parse(readFile(`${e.dir}\\${e.name}\\Default\\gpm_define`)), ...{ path: profile.dir } })
    // })
    return profiles
  } catch (e) {
    // console.log(e)
    // if (e instanceof Error) return { error: e.message }
    // else return { error: e }
    return []
  }
})

ipcMain.handle(`${collectionName}.getGroup`, async (event, args) => {
  try {
    const profile = global.config.directory.profiles.find(x => x.name == 'GPMLogin')
    const db = new Database(path.join(profile.dir, 'profile_data.db'))
    const groups = db.prepare('SELECT * FROM groups').all()
    return JSON.stringify(groups)
  } catch (e) {
    // console.log(e)
    // if (e instanceof Error) return { error: e.message }
    // else return { error: e }
    return null
  }
})

ipcMain.handle(`${collectionName}.open`, async (event, args) => {
  try {
    /*
    Set firefox="D:\MMO\tools\GPMLogin\gpm_browser\gpm_browser_firefox_core_119"
    %firefox%\firefox.exe -no-remote --profile D:\MMO\tools\GPMLogin\Profiles\eiAALx9E9i-01052024
    */
    // RunExecFile('D:\\MMO\\tools\\GPMLogin\\gpm_browser\\gpm_browser_firefox_core_119\\firefox.exe', ['-no-remote', '--profile D:\\MMO\\tools\\GPMLogin\\Profiles\\eiAALx9E9i-01052024'])
    // RunExec('D:\\MMO\\tools\\GPMLogin\\gpm_browser\\gpm_browser_firefox_core_119\\firefox.exe', '-no-remote --profile D:\\MMO\\tools\\GPMLogin\\Profiles\\36UidLcVxo-26042024')
    const profile = global.config.directory.profiles.find(x => x.name == 'GPMLogin')
    const browser = global.config.directory.browsers.find(x => x.name == 'GPMLogin')

    if (profile && browser) {
      const rs = await RunExec(`"${browser.dir}"`, `-no-remote --profile "${profile.dir}\\${args}"`)
      // console.log(rs)
      return rs
    } else return false
  } catch (e) {
    // console.log(e)
    // if (e instanceof Error) return { error: e.message }
    // else return { error: e }
    return false
  }
})

// For sqlite3 get databse from main process
ipcMain.handle(`${collectionName}.getProfileData`, () => {
  // const filePath = path.join(app.getPath('userData'), 'database.sqlite3')
  // console.log(filePath)
  // getSqlite3().then(db => {
  //   console.log(db)
  // })
  return JSON.stringify({ filePath: '' })
})

// For sqlite3 initialize of Renderer process
ipcMain.handle('get-database-path', () => path.join(app.getPath('userData'), 'database.sqlite3'))


ipcMain.handle(`${collectionName}.installEXTGPM`, async (event, args) => {
  try {
    // const win = BrowserWindow.getFocusedWindow()
    // if (win)
    //   await download(win, import.meta.env.MAIN_VITE_TMACTIONSURL, { directory: "c:/tm-actions" })
    const dl = new DownloaderHelper(import.meta.env.MAIN_VITE_TMACTIONSURL, 'C:\\ProgramData', { override: true })
    dl.on('end', () => console.log('Download Completed'))
    dl.on('error', (err) => console.log('Download Failed', err))
    dl.start().catch(err => console.error(err))

    // args.filePath = 'D:\\profiles\\GPMLogin\\ZAa6JEvhwg-09052024\\extensions\\{960a3725-2944-418b-8776-2c7fb41b865f}.xpi'
    if (!args.filePath || !args.dirPath) return { msg: 'noExist' }
    //
    const profile = global.config.directory.profiles.find(x => x.name == 'GPMLogin')
    const db = new Database(path.join(profile.dir, 'profile_data.db'))
    const profiles = db.prepare('SELECT * FROM profiles').all()
    // Zip
    const zip = new AdmZip(args.filePath)
    const zipEntries = zip.getEntries()
    zipEntries.forEach(function (zipEntry) {
      // console.log(zipEntry.toString()) // outputs zip entries information
      if (zipEntry.entryName == "manifest.json") {
        const manifest = JSON.parse(zipEntry.getData().toString("utf8"))
        const id = manifest.browser_specific_settings.gecko.id
        profiles.forEach(e => {
          const p = path.join(profile.dir, e.ProfilePath, 'extensions')
          //Create path if not exist
          if (!fs.existsSync(p)) fs.mkdirSync(p)
          fs.copyFile(args.filePath, path.join(p, `${id}.xpi`), (err) => {
            if (err) throw err
            // console.log('copied', ' ', args.dirPath, `${id}.xpi`)
          })
          // console.log(p)
        })
      }
    })
    return {}
  } catch (e) {
    // console.log(e)
    return false
  }
})

const DownloaderExtension = () => {
  return new Promise(resolve => {
    const ProgramData = 'C:\\ProgramData'
    const dl = new DownloaderHelper(import.meta.env.MAIN_VITE_TMACTIONSURL, ProgramData, { override: true })
    dl.on('end', (x) => {
      console.log(x)
      resolve(x)
    })
    dl.on('error', (err) => console.log('Download Failed', err))
    dl.start().catch(err => console.error(err))
  })
}
ipcMain.handle(`${collectionName}.installEXTTMACTION`, async (event, args) => {
  try {
    return new Promise(async resolve => {
      const ProgramData = 'C:\\ProgramData'
      const dl = new DownloaderHelper(import.meta.env.MAIN_VITE_TMACTIONSURL, ProgramData, { override: true })
      dl.on('end', (x) => {
        // args.filePath = 'D:\\profiles\\GPMLogin\\ZAa6JEvhwg-09052024\\extensions\\{960a3725-2944-418b-8776-2c7fb41b865f}.xpi'
        // get profiles
        const profile = global.config.directory.profiles.find(x => x.name == 'GPMLogin')
        const db = new Database(path.join(profile.dir, 'profile_data.db'))
        const profiles = db.prepare('SELECT * FROM profiles').all()
        // Zip
        const zip = new AdmZip(x.filePath)
        const zipEntries = zip.getEntries()
        if (zipEntries.length)
          zipEntries.forEach(function (zipEntry) {
            // console.log(zipEntry.toString()) // outputs zip entries information
            if (zipEntry.entryName == "manifest.json") {
              const manifest = JSON.parse(zipEntry.getData().toString("utf8"))
              const id = manifest.browser_specific_settings.gecko.id
              profiles.forEach(e => {
                const p = path.join(profile.dir, e.ProfilePath, 'extensions')
                //Create path if not exist
                if (!fs.existsSync(p)) fs.mkdirSync(p)
                fs.copyFile(x.filePath, path.join(p, `${id}.xpi`), (err) => {
                  if (err) throw err
                  // console.log('copied', ' ', args.dirPath, `${id}.xpi`)
                })
                // console.log(p)
              })
              resolve({ data: true })
            }
          })
        else resolve({ msg: 'noExist' })
      })
      dl.on('error', (err) => console.log('Download Failed', err))
      dl.start().catch(err => console.error(err))
    })
  } catch (e) {
    console.log(e)
    return false
  }
})
