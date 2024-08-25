import { ipcMain } from 'electron'
import { readFile, readFiles } from '../../../utils/lib-fs'
import { delay } from '../../../utils/promise'
import * as cookies from '../../../utils/lib-cookies'

const path = require('path')
const fs = require('fs')
const collectionName = "cookies"
const Database = require('better-sqlite3')
const AdmZip = require("adm-zip")
const DBInfo = {
  chrome: { name: 'Cookies', table: ['cookies', 'meta'] },
  firefox: { name: 'cookies.sqlite', table: ['moz_cookies'] }
}

ipcMain.handle(`${collectionName}.get`, async (event, args) => {
  try {
    if (!args.inPath || !args.outPath) return null
    args.outType = args.outType ? args.outType : 'firefox'

    const folders = readFiles(args.inPath, { type: 'folder', exclude: '_backup' })
    folders?.forEach(async e => {
      const profilePath = path.join(e.dir, e.name)
      const cookiesFirefox = path.join(profilePath, DBInfo.firefox.name)
      const cookiesChrome = path.join(profilePath, 'Default', 'Network', DBInfo.chrome.name)
      if (fs.existsSync(cookiesFirefox)) {
        // const db = new Database(cookiesFirefox)
        // const tables = db.prepare('SELECT name FROM sqlite_schema WHERE type=\'table\' ORDER BY name').all()
        // console.log(tables)
        // const moz_cookies = db.prepare('SELECT * FROM moz_cookies where host LIKE \'%tiktok%\'').all()
        //console.log('firefox')
        if (args.outType == 'firefox') {
          const zip = new AdmZip()
          zip.addLocalFile(cookiesFirefox)
          zip.writeZip(path.join(args.outPath, `${e.name}.zip`))
        } else if (args.outType == 'chrome') {
          const db = new Database(cookiesFirefox)
          const moz_cookies = db.prepare('SELECT * FROM moz_cookies where host LIKE \'%tiktok%\'').all()
          const cookies: Array<cookiesChrome> = []
          moz_cookies.forEach(e => {
            cookies.push({
              creation_utc: e.creationTime,
              host_key: e.host,
              top_frame_site_key: '',
              name: e.name,
              value: '',
              encrypted_value: e.value, //BLOB
              path: e.path,
              expires_utc: e.expiry,
              is_secure: e.isSecure,
              is_httponly: e.isHttpOnly,
              last_access_utc: e.lastAccessed,
              has_expires: 1,
              is_persistent: 1,
              priority: 1,
              samesite: e.sameSite,
              source_scheme: e.schemeMap,
              source_port: 443,
              last_update_utc: e.lastAccessed,
              source_type: 1,
              has_cross_site_ancestor: 1
            })
          })
          const dbChromePath = path.join(profilePath, DBInfo.chrome.name)
          console.log(dbChromePath)
          fs.unlinkSync(dbChromePath)
          const dbChrome = new Database(dbChromePath)//{ verbose: console.log }
          dbChrome.exec("CREATE TABLE IF NOT EXISTS meta(key LONGVARCHAR NOT NULL UNIQUE PRIMARY KEY, value LONGVARCHAR)")
          dbChrome.exec("CREATE TABLE IF NOT EXISTS cookies(creation_utc INTEGER NOT NULL,host_key TEXT NOT NULL,top_frame_site_key TEXT NOT NULL,name TEXT NOT NULL,value TEXT NOT NULL,encrypted_value BLOB NOT NULL,path TEXT NOT NULL,expires_utc INTEGER NOT NULL,is_secure INTEGER NOT NULL,is_httponly INTEGER NOT NULL,last_access_utc INTEGER NOT NULL,has_expires INTEGER NOT NULL,is_persistent INTEGER NOT NULL,priority INTEGER NOT NULL,samesite INTEGER NOT NULL,source_scheme INTEGER NOT NULL,source_port INTEGER NOT NULL,last_update_utc INTEGER NOT NULL,source_type INTEGER NOT NULL,has_cross_site_ancestor INTEGER NOT NULL)")
          dbChrome.exec("CREATE UNIQUE INDEX cookies_unique_index ON cookies(host_key, top_frame_site_key, name, path, source_scheme, source_port)")
          await delay(200)
          let qry = 'INSERT INTO cookies '
          qry += '(creation_utc,host_key,top_frame_site_key,name,value,encrypted_value,path,expires_utc,is_secure,is_httponly,last_access_utc,has_expires,is_persistent,priority,samesite,source_scheme,source_port,last_update_utc,source_type,has_cross_site_ancestor) '
          qry += 'VALUES (@creation_utc,@host_key,@top_frame_site_key,@name,@value,@encrypted_value,@path,@expires_utc,@is_secure,@is_httponly,@last_access_utc,@has_expires,@is_persistent,@priority,@samesite,@source_scheme,@source_port,@last_update_utc,@source_type,@has_cross_site_ancestor)'
          const insert = db.prepare(qry)
          const insertMany = dbChrome.transaction((cookies) => {
            for (const c of cookies) insert.run(c)
          })

          insertMany(moz_cookies)
        }
      }
      else {
        const db = new Database(cookiesChrome)
        const tables = db.prepare('SELECT name FROM sqlite_schema WHERE type=\'table\' ORDER BY name').all()
        // console.log(tables)
        // console.log('chrome')
      }
      // const info = JSON.parse(readFile(`${e.dir}\\${e.name}\\Default\\gpm_define`))
      // if (info) profiles.push({ ...JSON.parse(readFile(`${e.dir}\\${e.name}\\Default\\gpm_define`)), ...{ path: profile.dir } })
    })
    // const dbt = new Database('D:/cookies.sqlite')
    // const cookies = dbt.prepare('SELECT * FROM profiles').all()
    // console.log(cookies)
    return {}
  } catch (e) {
    console.log(e)
    return false
  }
})

ipcMain.handle(`${collectionName}.getone`, async (event, args) => {
  try {
    cookies.getDerivedKey((e, key) => {
      console.log(key)
    })
    // Encryption
    // const cookie = Buffer.from('40A9170375BEA1D38B5B97E7AF33E1CD~000000000000000000000000000000~YAAQV/rOF1y+wNiPAQAAXDiA6BhBA5eiq8VCcUNoCIXlBnyXpEAbnabqRus7S1eKu04z530npn2CgpQW1c6mk4jkz8bYtT0cgFa31rMg99/kORZ6wMyT8PSmFSxbRSD+ghJ2pK0GzcKcYtjkAL8CgxUCY/ivtXOfFRY6CBEJS0+uWxY4+UANnKkNHW8VdaTKkDtIyje2/e9JdZz6IoZtlo/ZcUG6+0vIfRP5kg3+IjFD/Pxqh2xC78CCqaUz/oUbxdWi24/8IseM6BHV78GPUvH0t7oRIr4poX/FkL+Ihtk+VlTZgN/ITsJV3d70OlUC0naKMqrujb8fVaI0qNPZ343vBNDQlrnPUvMwC7hyU8AEuzk94kudIjoNql7FODqThGWigeBHklZ4VA==');
    // const key = Buffer.from('01234567890123456789012345678901');
    // const encryptedCookie = cookies.encryptCookie(cookie, key);
    // console.log(encryptedCookie);
    // console.log(encryptedCookie.length);

    // Decryption
    // const decryptedCookie = cookies.decryptCookie('', key);
    // console.log(decryptedCookie.toString('utf8'));

    if (!args.inPath || !args.outPath) return null
    args.outType = args.outType ? args.outType : 'firefox'
    const cookiesFirefox = path.join(args.inPath, DBInfo.firefox.name)
    const cookiesChrome = path.join(args.inPath, 'Default', 'Network', DBInfo.chrome.name)
    if (fs.existsSync(cookiesFirefox)) {
      // const db = new Database(cookiesFirefox)
      // const tables = db.prepare('SELECT name FROM sqlite_schema WHERE type=\'table\' ORDER BY name').all()
      // console.log(tables)
      // const moz_cookies = db.prepare('SELECT * FROM moz_cookies where host LIKE \'%tiktok%\'').all()
      //console.log('firefox')
      if (args.outType == 'firefox') {
        const zip = new AdmZip()
        zip.addLocalFile(cookiesFirefox)
        zip.writeZip(path.join(args.outPath, `cookies.zip`))
      } else if (args.outType == 'chrome') {
        const db = new Database(cookiesFirefox)
        const moz_cookies = db.prepare('SELECT * FROM moz_cookies').all()//'SELECT * FROM moz_cookies where host LIKE \'%tiktok%\''
        const cookies: Array<cookiesChrome> = []
        moz_cookies.forEach(e => {
          // console.log(e.name, e.host)
          // console.log(cookies.findIndex(x => x.name == 'msToken'))
          // if (cookies.findIndex(x => x.name == 'msToken') < 0)


          cookies.push({
            creation_utc: e.creationTime,
            host_key: e.host,
            top_frame_site_key: '',
            name: e.name,
            value: '',
            encrypted_value: e.value, //BLOB
            path: e.path,
            expires_utc: e.expiry,
            is_secure: e.isSecure,
            is_httponly: e.isHttpOnly,
            last_access_utc: e.lastAccessed,
            has_expires: 1,
            is_persistent: 1,
            priority: 1,
            samesite: e.sameSite,
            source_scheme: e.schemeMap,
            source_port: 443,
            last_update_utc: e.lastAccessed,
            source_type: 1,
            has_cross_site_ancestor: 1
          })
        })
        const dbChromePath = path.join(args.inPath, DBInfo.chrome.name)
        // console.log(cookies)
        // fs.unlinkSync(dbChromePath)
        const dbChrome = new Database(dbChromePath)//{ verbose: console.log }
        // dbChrome.prepare('CREATE TABLE IF NOT EXISTS tm(creation_utc INTEGER NOT NULL, host_key TEXT NOT NULL)').run()
        // const insert = dbChrome.prepare('INSERT INTO tm')
        // const insertMany = dbChrome.transaction((obj) => {
        //   for (const c of obj) insert.run(c)
        // })
        // insertMany(moz_cookies)
        if (fs.existsSync(dbChromePath)) dbChrome.prepare('DROP TABLE IF EXISTS cookies').run()
        dbChrome.prepare('CREATE TABLE IF NOT EXISTS meta(key LONGVARCHAR NOT NULL UNIQUE PRIMARY KEY, value LONGVARCHAR)').run()
        dbChrome.prepare('CREATE TABLE IF NOT EXISTS cookies(creation_utc INTEGER NOT NULL,host_key TEXT NOT NULL,top_frame_site_key TEXT NOT NULL,name TEXT NOT NULL,value TEXT NOT NULL,encrypted_value BLOB NOT NULL,path TEXT NOT NULL,expires_utc INTEGER NOT NULL,is_secure INTEGER NOT NULL,is_httponly INTEGER NOT NULL,last_access_utc INTEGER NOT NULL,has_expires INTEGER NOT NULL,is_persistent INTEGER NOT NULL,priority INTEGER NOT NULL,samesite INTEGER NOT NULL,source_scheme INTEGER NOT NULL,source_port INTEGER NOT NULL,last_update_utc INTEGER NOT NULL,source_type INTEGER NOT NULL,has_cross_site_ancestor INTEGER NOT NULL)').run()
        dbChrome.prepare('CREATE UNIQUE INDEX cookies_unique_index ON cookies(host_key, top_frame_site_key, name, path, source_scheme, source_port)').run()
        await delay(1000)

        let qry = 'INSERT INTO cookies'
        qry += '(creation_utc,host_key,top_frame_site_key,name,value,encrypted_value,path,expires_utc,is_secure,is_httponly,last_access_utc,has_expires,is_persistent,priority,samesite,source_scheme,source_port,last_update_utc,source_type,has_cross_site_ancestor) '
        qry += 'VALUES (@creation_utc,@host_key,@top_frame_site_key,@name,@value,@encrypted_value,@path,@expires_utc,@is_secure,@is_httponly,@last_access_utc,@has_expires,@is_persistent,@priority,@samesite,@source_scheme,@source_port,@last_update_utc,@source_type,@has_cross_site_ancestor)'
        const insert = dbChrome.prepare(qry)
        const insertMany = dbChrome.transaction((cookies) => {
          for (const c of cookies) insert.run(c)
        })
        insertMany(cookies)
      }
    }
    else {
      const db = new Database(cookiesChrome)
      const tables = db.prepare('SELECT name FROM sqlite_schema WHERE type=\'table\' ORDER BY name').all()
      // console.log(tables)
      // console.log('chrome')
    }
    return {}
  } catch (e) {
    console.log(e)
    return false
  }
})
interface cookiesChrome {
  //cookies
  // CREATE TABLE cookies(
  // creation_utc INTEGER NOT NULL,
  // host_key TEXT NOT NULL,
  // top_frame_site_key TEXT NOT NULL,
  // name TEXT NOT NULL,
  // value TEXT NOT NULL,
  // encrypted_value BLOB NOT NULL,
  // path TEXT NOT NULL,
  // expires_utc INTEGER NOT NULL,
  // is_secure INTEGER NOT NULL,
  // is_httponly INTEGER NOT NULL,
  // last_access_utc INTEGER NOT NULL,
  // has_expires INTEGER NOT NULL,
  // is_persistent INTEGER NOT NULL,
  // priority INTEGER NOT NULL,
  // samesite INTEGER NOT NULL,
  // source_scheme INTEGER NOT NULL,
  // source_port INTEGER NOT NULL,
  // last_update_utc INTEGER NOT NULL,
  // source_type INTEGER NOT NULL,
  // has_cross_site_ancestor INTEGER NOT NULL);
  creation_utc: number,
  host_key: string,
  top_frame_site_key: string,
  name: string,
  value: string,
  encrypted_value: string, //BLOB
  path: string,
  expires_utc: number,
  is_secure: number,
  is_httponly: number,
  last_access_utc: number,
  has_expires: number,
  is_persistent: number,
  priority: number,
  samesite: number,
  source_scheme: number,
  source_port: number,
  last_update_utc: number,
  source_type: number,
  has_cross_site_ancestor: number
}

interface cookiesFirefox {
  //moz_cookies
  // CREATE TABLE moz_cookies (
  //   id INTEGER PRIMARY KEY,
  //   originAttributes TEXT NOT NULL DEFAULT '',
  //   name TEXT,
  //   value TEXT,
  //   host TEXT,
  //   path TEXT,
  //   expiry INTEGER,
  //   lastAccessed INTEGER,
  //   creationTime INTEGER,
  //   isSecure INTEGER,
  //   isHttpOnly INTEGER,
  //   inBrowserElement INTEGER DEFAULT 0,
  //   sameSite INTEGER DEFAULT 0,
  //   rawSameSite INTEGER DEFAULT 0,
  //   schemeMap INTEGER DEFAULT 0,
  //   CONSTRAINT moz_uniqueid UNIQUE (name, host, path, originAttributes));
  id: number,
  originAttributes: string,
  name: string,
  value: string,
  host: string,
  expiry: number,
  lastAccessed: number,
  creationTime: number,
  isSecure: number,
  isHttpOnly: number,
  inBrowserElement: number,
  sameSite: number,
  rawSameSite: number,
  schemeMap: number
}
