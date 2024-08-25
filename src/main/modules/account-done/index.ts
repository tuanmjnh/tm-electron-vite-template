import { ipcMain } from 'electron'
import { readFile, readFiles } from '../../../utils/lib-fs'
const path = require('path')
const fs = require('fs')
const collectionName = "accountDone"

ipcMain.handle(`${collectionName}.get`, async (event, args) => {
  try {
    const rs = [] as any
    const inText = [] as any
    const inPath = [] as any
    let outText = ''
    //Get data from in text
    // console.log(args.inText)
    if (!args.inText && !args.inText.length) return rs
    const inRow = args.inText.trim().split('\n')
    if (inRow.length) {
      inRow.forEach(r => {
        if (r && r.length) {
          const inCol = r.trim().split('|')
          if (inCol.length > 1)
            inText.push({
              email: inCol[0],
              passMail: inCol[1]
            })
        }
      })
    }

    //Get data from in path
    const files = readFiles(args.inPath, { type: 'file', ext: '.txt' })
    if (!files || !files.length) return rs
    files.forEach(e => {
      //in text: alaimosee745890@hotmail.com|aqwrW9ZR9
      // done text: heringckq497896@hotmail.com|exWI6aU9|Nick$E3593|x9brayanjatr23021s|token
      const file = readFile(path.join(e.dir, e.name))
      const row = file != null ? file.trim().split('\r\n') : []
      if (row.length)
        row.forEach(r => {
          if (r && r.length) {
            const col = r.trim().split('|')
            if (col.length > 4)
              inPath.push({
                email: col[0],
                passMail: col[1],
                account: col[3],
                password: col[2],
                token: col[4]
              })
          }
        })
    })
    if (inText.length) {
      inText.forEach(e => {
        const i = inPath.find(x => x.email == e.email && x.passMail == e.passMail)
        // if (i) outText += `${e.email}\t${e.passMail}\t${i.password}\t${i.account}`
        // else outText += `${e.email}\t${e.passMail}`
        if (i) outText += `${i.password}\t${i.account}\t${i.token}`
        outText += '\n'
      })
    }
    // console.log(rs)
    return { inText: inText, inPath: inPath, outText: outText }
  } catch (e) {
    console.log(e)
    return false
  }
})
