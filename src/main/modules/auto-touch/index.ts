import { ipcMain } from 'electron'
import { NewGuid } from '../../../utils/crypto'
import { readFiles, readFile, writeFile, createDir } from '../../../utils/lib-fs'
import { splitBrackets } from '../../../utils/lib-regex'
const collectionName = "autoTouch"

ipcMain.handle(`${collectionName}.get`, async (event, args) => {
  try {
    console.log(NewGuid())
    // if (!args.filePath || !args.dirPath) return { msg: 'noExist' }
    //Create path if not exist
    // if (!fs.existsSync(args.dirPath)) await fs.mkdirSync(args.dirPath)
    return {
      tuanmjnh: 'abc',
      inPath: 'vhdgh',
      inText: 'fdhdfh',
      outText: 'fdhgbdftyertyre'
    }
  } catch (e) {
    console.log(e)
    return false
  }
})

ipcMain.handle(`${collectionName}.exportConfig`, async (event, args) => {
  try {
    const rs = await writeFile(args.filePath, args.content)
    if (rs) return { success: true }
    else return { error: true }
  } catch (e) {
    console.log(e)
    return false
  }
})
ipcMain.handle(`${collectionName}.importConfig`, async (event, args) => {
  try {
    return readFile(args.filePath)
  } catch (e) {
    console.log(e)
    return false
  }
})
ipcMain.handle(`${collectionName}.exportData`, async (event, args) => {
  try {
    await createDir(args.dir, '\\')
    const rs = await writeFile(`${args.dir}\\${args.file}`, args.content)
    if (rs) return { success: true }
    else return { error: true }
  } catch (e) {
    console.log(e)
    return false
  }
})
ipcMain.handle(`${collectionName}.readData`, async (event, args) => {
  const rs = {
    status: false,
    data: [] as any,
    msg: ''
  }
  try {
    const files = readFiles(args.dir, { ext: '.txt' })
    for (const f of files) {
      const name = splitBrackets(f.name)
      if (name.length > 1 && `${name[1]}${f.ext}` == args.file) {
        //&& name[1] == args.file
        // console.log(`${name[0]}-${name[1]}${f.ext}`)
        const content = await readFile(`${f.dir}\\${f.name}`)
        if (content != null) {
          const rows = content.trim().split('\n')
          if (rows && rows.length) {
            for (let i = 0; i < rows.length; i++) {
              const col = rows[i].trim().split('|')
              if (col && col.length > 1) {
                rs.data.push({
                  device: name[0],
                  file: args.file,
                  mail: col[0],
                  passMail: col[1],
                  username: col[3],
                  password: col[2],
                  token: col[4]
                })
              }
              // if (col && col.length > 1) {
              //   rs += `${name[0]}\t`
              //   if (col.length > 0) rs += `${col[0]}\t`
              //   if (col.length > 1) rs += `${col[1]}\t`
              //   if (col.length > 2) rs += `${col[2]}\t`
              //   if (col.length > 3) rs += `${col[3]}\t`
              //   if (col.length > 4) rs += `${col[4]}\t`
              //   if (i < rows.length) rs += '\n'
              // }
            }
          }
        }
      }
    }
    rs.status = true
    return rs
  } catch (e) {
    console.log(e)
    rs.msg = e as string
    return rs
  }
})

ipcMain.handle(`${collectionName}.getFiles`, async (event, args) => {
  try {
    const files = readFiles(args.dir, { content: true })
    if (files && files.length) return { status: true, data: files }
    else return { status: true }
  } catch (e) {
    console.log(e)
    return false
  }
})
